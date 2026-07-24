-- Tabla de dispositivos suscritos al aviso de temperatura.
-- token: identificador de push de Expo del iPhone (clave única).
-- last_above / last_below: si en la última comprobación la temperatura estaba por encima del
--   máximo o por debajo del mínimo. NULL = todavía no se ha comprobado (no se avisa la 1ª vez).
CREATE TABLE IF NOT EXISTS devices (
  token TEXT PRIMARY KEY,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  place_name TEXT,
  max_threshold REAL NOT NULL,
  min_threshold REAL NOT NULL,
  last_above INTEGER,
  last_below INTEGER,
  updated_at INTEGER
);
