-- VitalLume schema for Supabase / PostgreSQL
-- Run this in the Supabase SQL editor (or psql) before starting the FastAPI backend.

create extension if not exists "pgcrypto";

create table if not exists public.devices (
  id bigint generated always as identity primary key,
  device_id varchar(64) unique not null,
  name varchar(128) not null,
  status varchar(32) default 'ONLINE',
  last_seen timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.sensor_readings (
  id bigint generated always as identity primary key,
  device_id varchar(64) not null,
  timestamp timestamptz default now(),
  temperature numeric(5, 2),
  humidity numeric(5, 2),
  pressure numeric(7, 2),
  pm25 numeric(7, 2),
  gas numeric(7, 2),
  sound numeric(5, 2),
  motion boolean default false,
  presence boolean default false,
  respiration numeric(5, 2),
  ac_voltage numeric(7, 2),
  ac_current numeric(7, 2),
  raw_payload jsonb,
  created_at timestamptz default now()
);

create table if not exists public.alerts (
  id varchar(64) primary key,
  device_id varchar(64) not null,
  type varchar(64) not null,
  severity varchar(32) not null,
  message text not null,
  sensor varchar(64) not null,
  value numeric(7, 2),
  threshold numeric(7, 2),
  acknowledged boolean default false,
  acknowledged_at timestamptz,
  timestamp timestamptz default now()
);

create index if not exists idx_sensor_readings_device_time
  on public.sensor_readings (device_id, timestamp desc);
create index if not exists idx_alerts_device_time
  on public.alerts (device_id, timestamp desc);
create index if not exists idx_alerts_ack
  on public.alerts (acknowledged);
create index if not exists idx_devices_last_seen
  on public.devices (last_seen desc);

alter table public.devices enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.alerts enable row level security;

-- Dashboard reads (anon key). Writes go through FastAPI using the service role key,
-- which bypasses RLS.
drop policy if exists "public read devices" on public.devices;
create policy "public read devices"
  on public.devices for select
  to anon, authenticated
  using (true);

drop policy if exists "public read sensor_readings" on public.sensor_readings;
create policy "public read sensor_readings"
  on public.sensor_readings for select
  to anon, authenticated
  using (true);

drop policy if exists "public read alerts" on public.alerts;
create policy "public read alerts"
  on public.alerts for select
  to anon, authenticated
  using (true);

insert into public.devices (device_id, name, status)
values
  ('vitallume-001', 'Master Overhead Socket Node', 'ONLINE'),
  ('ESP32-001', 'Living Room Sensor Cluster', 'ONLINE')
on conflict (device_id) do nothing;
