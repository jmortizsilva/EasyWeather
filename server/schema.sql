-- Esquema del servidor de avisos. Separa tres cosas porque un dispositivo puede tener solo el
-- umbral, solo resumenes, o ambos:
--   dispositivos: ubicacion actual del telefono + su zona horaria (la actualiza la geovalla).
--   umbrales:     el aviso de temperatura (0 o 1 por dispositivo). Usa la ubicacion del dispositivo.
--   resumenes:    los avisos de resumen (0+ por dispositivo). Cada uno lleva su lugar; los de
--                 "mi ubicacion" van con seguir_ubicacion=1 y usan la ubicacion viva del telefono.

CREATE TABLE IF NOT EXISTS dispositivos (
  token TEXT PRIMARY KEY,
  lat REAL,
  lon REAL,
  zona_horaria TEXT,
  -- Nombre del sitio donde esta el telefono (lo resuelve la app por geocodificacion inversa y lo
  -- manda al reportar ubicacion). Sirve para titular los resumenes de "mi ubicacion" con la ciudad
  -- en vez de "tu ubicacion". NULL hasta el primer reporte con nombre.
  nombre TEXT,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS umbrales (
  token TEXT PRIMARY KEY,
  max_threshold REAL NOT NULL,
  min_threshold REAL NOT NULL,
  -- Si en la ultima comprobacion la temperatura estaba por encima del maximo / por debajo del
  -- minimo. NULL = aun no comprobado (no se avisa la 1a vez, para no soltar algo que ya ocurria).
  last_above INTEGER,
  last_below INTEGER
);

CREATE TABLE IF NOT EXISTS resumenes (
  token TEXT NOT NULL,
  id TEXT NOT NULL,
  hora INTEGER NOT NULL,
  minuto INTEGER NOT NULL,
  campos TEXT NOT NULL,            -- JSON: array de nombres de campo
  seguir_ubicacion INTEGER NOT NULL,  -- 0/1: usar la ubicacion viva del telefono
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  nombre TEXT NOT NULL,
  ultimo_envio TEXT,              -- fecha local YYYY-MM-DD del ultimo envio (dedupe por dia)
  PRIMARY KEY (token, id)
);
