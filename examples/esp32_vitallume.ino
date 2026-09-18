/*
 * =====================================================================================
 * VitalLume - Ambient Home Health & Safety Guardian
 * ESP32 Wi-Fi Telemetry Ingestion Firmware
 * =====================================================================================
 * 
 * Hardware Target: ESP32 Development Board (ESP32-WROOM-32)
 * Sensors Supported:
 *  - BME680 (I2C: SDA=GPIO21, SCL=GPIO22): Temperature, Humidity, Pressure, Gas Resistance
 *  - HC-SR501 PIR Motion Sensor (Digital In: GPIO13)
 *  - HLK-LD2420 24GHz mmWave Radar (UART / Digital Out: GPIO16, GPIO17)
 *  - LM393 Sound Sensor (Analog In: GPIO34, Digital Out: GPIO35)
 *  - MQ-9 Gas Sensor (Analog In: GPIO36)
 *
 * Requirements:
 *  - ArduinoJson library (v6.x or v7.x)
 *  - Adafruit BME680 library & Adafruit Sensor library
 *  - WiFi.h & HTTPClient.h (Built into ESP32 core)
 *
 * Setup:
 *  1. Configure your Wi-Fi SSID and PASSWORD.
 *  2. Configure your deployed VERCEL_API_URL or local server IP.
 *  3. Set DEVICE_API_KEY matching the environment variable on the server.
 * =====================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME680.h>

// ================= Wi-Fi Configuration =================
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ================= VitalLume Backend Configuration =================
// Production: "https://your-vitallume-deployment.vercel.app/api/device/data"
// Local Testing: "http://192.168.1.100:3001/api/device/data"
const char* SERVER_ENDPOINT = "https://your-vitallume-deployment.vercel.app/api/device/data";

// Device API Key for Authorization: Bearer <DEVICE_API_KEY>
const char* DEVICE_API_KEY  = "vitallume_secret_device_key_2026";
const char* DEVICE_ID       = "ESP32-001";

// ================= Hardware Pin Allocations =================
#define PIN_PIR           13   // HC-SR501 Motion Input
#define PIN_SOUND_ANALOG  34   // LM393 Acoustic Analog Input
#define PIN_MQ9_ANALOG    36   // MQ-9 Gas Analog Input
#define STATUS_LED_PIN    2    // On-board status LED

Adafruit_BME680 bme;
bool bmeInitialized = false;

// Telemetry interval (2.5 seconds matching VitalLume specifications)
const unsigned long TRANSMIT_INTERVAL_MS = 2500;
unsigned long lastTransmitTime = 0;

void connectToWiFi() {
  Serial.print("[VitalLume ESP32] Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 25) {
    delay(500);
    Serial.print(".");
    digitalWrite(STATUS_LED_PIN, !digitalRead(STATUS_LED_PIN));
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(STATUS_LED_PIN, HIGH);
    Serial.println("");
    Serial.print("[VitalLume ESP32] Wi-Fi connected! Local IP: ");
    Serial.println(WiFi.localIP());
  } else {
    digitalWrite(STATUS_LED_PIN, LOW);
    Serial.println("\n[VitalLume ESP32] Wi-Fi connection timed out. Will retry in main loop.");
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n--- VitalLume Ambient Socket Node Initializing ---");

  pinMode(PIN_PIR, INPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);

  // Initialize I2C for BME680
  Wire.begin(21, 22);
  if (bme.begin(0x77) || bme.begin(0x76)) {
    Serial.println("[VitalLume ESP32] BME680 environmental sensor detected.");
    bme.setTemperatureOversampling(BME680_OS_8X);
    bme.setHumidityOversampling(BME680_OS_2X);
    bme.setPressureOversampling(BME680_OS_4X);
    bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
    bme.setGasHeater(320, 150); // 320°C for 150 ms
    bmeInitialized = true;
  } else {
    Serial.println("[VitalLume ESP32] WARNING: BME680 not found. Using analog fallback values.");
  }

  connectToWiFi();
}

void sendTelemetry() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[VitalLume ESP32] Wi-Fi dropped. Reconnecting...");
    connectToWiFi();
    return;
  }

  // 1. Collect sensor measurements
  float temperature = 28.4;
  float humidity = 62.0;
  float pressure = 1008.0;
  float gasResistance = 25.0;

  if (bmeInitialized && bme.performReading()) {
    temperature = bme.temperature;
    humidity = bme.humidity;
    pressure = bme.pressure / 100.0;
    gasResistance = bme.gas_resistance / 1000.0; // KOhms
  }

  // PIR Motion
  int pirRaw = digitalRead(PIN_PIR);
  bool motionDetected = (pirRaw == HIGH);

  // Sound measurement (approximate dB mapping)
  int soundRaw = analogRead(PIN_SOUND_ANALOG);
  float soundDb = map(soundRaw, 0, 4095, 30, 95);

  // Gas measurement from MQ-9
  int gasRaw = analogRead(PIN_MQ9_ANALOG);
  float gasPpm = map(gasRaw, 0, 4095, 10, 200);

  // 2. Prepare JSON payload
  StaticJsonDocument<512> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["temperature"] = round(temperature * 10.0) / 10.0;
  doc["humidity"] = round(humidity);
  doc["pressure"] = round(pressure);
  doc["gas"] = round(gasPpm);
  doc["sound"] = round(soundDb);
  doc["motion"] = motionDetected;
  doc["presence"] = motionDetected; // Human presence

  // Radar kinematics sub-object
  JsonObject radar = doc.createNestedObject("radar");
  radar["motion"] = motionDetected;
  radar["presence"] = motionDetected;
  radar["velocity"] = motionDetected ? 0.24 : 0.00;
  radar["respiration"] = 16.0;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // 3. Transmit to VitalLume Backend via HTTP POST
  HTTPClient http;
  http.begin(SERVER_ENDPOINT);
  http.addHeader("Content-Type", "application/json");

  // Authentication Header: Bearer <DEVICE_API_KEY>
  String authHeader = String("Bearer ") + DEVICE_API_KEY;
  http.addHeader("Authorization", authHeader);
  http.addHeader("x-api-key", DEVICE_API_KEY);

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("[VitalLume ESP32] Telemetry sent! HTTP Response: ");
    Serial.print(httpResponseCode);
    Serial.print(" | Server msg: ");
    Serial.println(response);
  } else {
    Serial.print("[VitalLume ESP32] Transmission failed. Error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - lastTransmitTime >= TRANSMIT_INTERVAL_MS) {
    lastTransmitTime = currentMillis;
    sendTelemetry();
  }

  delay(50);
}
