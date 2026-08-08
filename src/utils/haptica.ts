import { Vibration } from 'react-native';

// Confirmacion tactil de una accion (guardar un aviso, enviar una prueba, seleccionar un lugar).
// Util sobre todo sin mirar la pantalla: la vibracion dice "se ha registrado" aunque VoiceOver no
// llegue a anunciarlo (sus anuncios se pierden a veces al competir con el gesto).
//
// Se usa el modulo Vibration de React Native, que ya viene en el binario: asi esto viaja por
// `eas update` sin recompilar. Limitacion conocida: en iOS el patron se ignora (vibra una vez
// igual para exito y error). Si algun dia se quiere distinguirlos con el motor taptico (exito /
// aviso / error), hay que cambiar aqui a `expo-haptics`, que es nativo y OBLIGA A UNA BUILD nueva.

export function vibrarConfirmacion(): void {
  Vibration.vibrate();
}

export function vibrarError(): void {
  // En Android este patron (dos toques) se siente distinto; en iOS se percibe como una vibracion.
  Vibration.vibrate([0, 90, 70, 90]);
}
