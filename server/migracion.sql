-- Migracion del esquema antiguo (una sola tabla `devices` con umbral) al nuevo.
-- Ejecutar UNA vez, despues de crear las tablas nuevas (schema.sql). Los dispositivos con umbral
-- ya registrados pasan a dispositivos + umbrales sin perder su estado (last_above/last_below).
-- Los resumenes no se migran: en el esquema antiguo eran locales del telefono, no del servidor.

INSERT OR IGNORE INTO dispositivos (token, lat, lon, zona_horaria, updated_at)
  SELECT token, lat, lon, NULL, updated_at FROM devices;

INSERT OR IGNORE INTO umbrales (token, max_threshold, min_threshold, last_above, last_below)
  SELECT token, max_threshold, min_threshold, last_above, last_below FROM devices;

-- Cuando se confirme que todo funciona con el esquema nuevo, se puede eliminar la vieja:
-- DROP TABLE devices;
