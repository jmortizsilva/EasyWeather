-- Anade la columna `nombre` a `dispositivos` (nombre del sitio actual del telefono).
-- Ejecutar UNA vez sobre una BD ya creada con el esquema anterior. Las filas existentes quedan con
-- nombre NULL: el resumen de "mi ubicacion" seguira diciendo "tu ubicacion" hasta que el telefono
-- reporte su ubicacion con nombre (al moverse de zona o al reabrir la app).

ALTER TABLE dispositivos ADD COLUMN nombre TEXT;
