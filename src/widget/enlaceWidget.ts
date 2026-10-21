// El enlace que abre la app al tocar el widget: `<identificador de la app>://lugar/<id>`. El
// esquema es el identificador para que el widget de pruebas abra la app de pruebas y no la otra.

/** El id del lugar de un enlace del widget, o undefined si el enlace no es del widget. */
export function lugarDeEnlace(url: string | null | undefined): string | undefined {
  const encontrado = url?.match(/^[a-z0-9.+-]+:\/\/lugar\/([^/?#]+)/i);
  if (!encontrado) return undefined;
  try {
    return decodeURIComponent(encontrado[1]);
  } catch {
    return undefined;
  }
}
