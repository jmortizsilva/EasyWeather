// Formato de la temperatura actual que se muestra junto a cada lugar (en "Mis lugares" y en el
// selector de "Hoy"). Logica pura, sin dependencias de React Native: se decide aqui, se prueba con
// Jest sin dispositivo.

/** Temperatura actual guardada de un lugar, con la hora en que se obtuvo. */
export interface TempGuardada {
  temperature?: number;
  fetchedAt?: number;
}

// Por debajo de este margen el dato se considera fresco y no se anuncia su antiguedad. La
// prevision se cachea 30 min en el resto de la app; mantenemos el mismo criterio.
export const TEMP_FRESCA_MS = 30 * 60 * 1000;

/**
 * Antiguedad en lenguaje natural para VoiceOver: "1 minuto", "40 minutos", "2 horas". Se redondea
 * a la unidad mas grande que no engane (a partir de 90 min pasa a horas).
 */
export function describirEdad(ms: number): string {
  const minutos = Math.round(ms / 60000);
  if (minutos <= 1) {
    return '1 minuto';
  }
  // Por debajo de 45 min se dice en minutos; a partir de ahí, en horas (redondeando, para no dar
  // una falsa sensación de precisión con un dato viejo).
  if (minutos < 45) {
    return `${minutos} minutos`;
  }
  const horas = Math.round(minutos / 60);
  return horas === 1 ? '1 hora' : `${horas} horas`;
}

export interface TextoTemp {
  /** Corto, para la pantalla: "15º" o "15º · hace 40 min". */
  visible: string;
  /** Desarrollado, para VoiceOver: "15 grados" o "15 grados, hace 40 minutos". */
  hablado: string;
}

/**
 * Devuelve el texto de la temperatura, o undefined si no hay dato. Cuando el dato no es fresco se
 * anade su antiguedad (decision del usuario: preferir el numero con su edad a esconderlo), para que
 * un valor viejo nunca se cante como si fuera de ahora.
 */
export function textoTempActual(
  entry: TempGuardada | undefined,
  ahora: number,
): TextoTemp | undefined {
  if (!entry || entry.temperature === undefined) {
    return undefined;
  }

  const grados = Math.round(entry.temperature);
  const visibleBase = `${grados}º`;
  const habladoBase = `${grados} grados`;

  const edad = entry.fetchedAt ? ahora - entry.fetchedAt : 0;
  if (entry.fetchedAt && edad > TEMP_FRESCA_MS) {
    const edadTexto = describirEdad(edad);
    return {
      // En pantalla se abrevia "min"/"h"; para VoiceOver va desarrollado.
      visible: `${visibleBase} · hace ${edadTexto.replace(' minutos', ' min').replace(' minuto', ' min').replace(' horas', ' h').replace(' hora', ' h')}`,
      hablado: `${habladoBase}, hace ${edadTexto}`,
    };
  }

  return { visible: visibleBase, hablado: habladoBase };
}

/**
 * Texto de un lugar con su temperatura, para la fila de "Mis lugares" y el selector de "Hoy".
 * Sin temperatura conocida, solo el nombre. Puro: se prueba sin dispositivo.
 */
export function textoLugar(
  name: string,
  entry: TempGuardada | undefined,
  ahora: number,
): { visible: string; hablado: string } {
  const temp = textoTempActual(entry, ahora);
  if (!temp) {
    return { visible: name, hablado: name };
  }
  return { visible: `${name}  ${temp.visible}`, hablado: `${name}, ${temp.hablado}` };
}
