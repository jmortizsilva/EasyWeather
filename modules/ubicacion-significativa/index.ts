import { requireOptionalNativeModule } from 'expo';

// Seguimiento de ubicacion por cambios significativos de iOS. El codigo nativo esta en ios/;
// aqui solo esta la puerta, tipada.
//
// `requireOptionalNativeModule` y no `requireNativeModule`: en la web y en cualquier build que no
// lleve el modulo compilado, esto devuelve null en vez de reventar al importar. Toda la app pasa
// por aqui al sincronizar los avisos, asi que un fallo aqui se llevaria por delante los avisos
// enteros.

interface ModuloNativo {
  configurar(url: string, appKey: string, token: string): Promise<void>;
  empezar(): Promise<void>;
  parar(): Promise<void>;
  estaActivo(): Promise<boolean>;
}

const nativo = requireOptionalNativeModule<ModuloNativo>('UbicacionSignificativa');

/** True si esta build lleva el modulo compilado. Sin el, la app funciona sin seguimiento. */
export const hayModuloDeUbicacion = nativo != null;

/**
 * Enciende el seguimiento y le dice a donde reportar.
 *
 * Hay que llamarlo con la app abierta y cada vez que cambie algo (el token de push se renueva al
 * reinstalar): lo que se le pasa aqui es lo que usara luego, ya sin JavaScript, cuando iOS lo
 * despierte con la app cerrada.
 */
export async function empezarSeguimiento(
  url: string,
  appKey: string,
  token: string,
): Promise<void> {
  if (!nativo) {
    return;
  }
  await nativo.configurar(url, appKey, token);
  await nativo.empezar();
}

export async function pararSeguimiento(): Promise<void> {
  await nativo?.parar();
}

/** Si el seguimiento esta encendido de verdad, para poder enseñarlo en vez de suponerlo. */
export async function seguimientoActivo(): Promise<boolean> {
  return (await nativo?.estaActivo()) ?? false;
}
