// Estilos compartidos por todas las pantallas de Avisos. Estaban dentro de AlertsScreen, que era
// una sola pantalla; al partirla en cuatro, duplicarlos habria sido garantizar que se separan.

import { StyleSheet } from 'react-native';
import { Paleta } from '../../theme/colores';

export const crearEstilos = (c: Paleta) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.fondo,
    },
    modalRoot: {
      backgroundColor: c.fondo,
    },
    content: {
      paddingTop: 24,
      paddingHorizontal: 16,
      paddingBottom: 96,
      gap: 12,
    },
    title: {
      color: c.texto,
      fontSize: 34,
      fontWeight: '700',
    },
    sectionHeader: {
      color: c.textoSeccion,
      fontSize: 20,
      fontWeight: '600',
      marginTop: 8,
    },
    card: {
      backgroundColor: c.tarjeta,
      borderRadius: 16,
      overflow: 'hidden',
      paddingHorizontal: 16,
    },
    row: {
      minHeight: 44,
      justifyContent: 'center',
      paddingVertical: 12,
    },
    switchRow: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 8,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.borde,
    },
    rowTitle: {
      color: c.textoFila,
      fontSize: 17,
      flexShrink: 1,
    },
    rowMeta: {
      color: c.textoMeta,
      fontSize: 15,
      marginTop: 2,
    },
    // El campo lleva borde: en la paleta clara su relleno es blanco como el de la tarjeta y sin
    // borde no se distinguiria donde se escribe.
    input: {
      minWidth: 80,
      minHeight: 44,
      borderRadius: 12,
      paddingHorizontal: 12,
      backgroundColor: c.campo,
      borderWidth: 1,
      borderColor: c.borde,
      color: c.textoCampo,
      fontSize: 17,
      textAlign: 'right',
    },
    // El interruptor visual no captura el toque: la fila-conmutador (Pressable) es quien cambia.
    switchControl: {
      pointerEvents: 'none',
    },
    note: {
      color: c.textoTenue,
      fontSize: 15,
    },
    buttonPrimary: {
      borderRadius: 12,
      backgroundColor: c.primario,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 4,
    },
    buttonPrimaryText: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    // Boton secundario: relleno visible + borde del color del texto (un borde de acento se volvia
    // invisible en la paleta clara, donde acento y primario coinciden). Antes el relleno era casi
    // identico al fondo y "Probar notificación" / "Cancelar" apenas se veian.
    buttonSecondary: {
      borderRadius: 12,
      backgroundColor: c.primario,
      borderWidth: 1,
      borderColor: c.textoPrimario,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    buttonSecondaryText: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    // Aviso visible flotante (toast) para confirmar acciones sin depender solo de VoiceOver.
    toast: {
      position: 'absolute',
      left: 16,
      right: 16,
      borderRadius: 12,
      backgroundColor: c.exitoFondo,
      borderWidth: 1,
      borderColor: c.exitoBorde,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    toastText: {
      color: c.exitoTexto,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    // Barra "Listo" sobre el teclado numerico.
    tecladoBarra: {
      backgroundColor: c.tarjeta,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.borde,
      paddingHorizontal: 12,
      paddingVertical: 8,
      alignItems: 'flex-end',
    },
    tecladoBoton: {
      minHeight: 44,
      minWidth: 72,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: c.primario,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tecladoBotonTexto: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    buttonDanger: {
      borderRadius: 12,
      backgroundColor: c.peligro,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    buttonDangerText: {
      color: c.textoPeligro,
      fontSize: 17,
      fontWeight: '600',
    },
    // Fila del indice que lleva a otra pantalla. El estado va debajo del titulo para que se lea
    // sin entrar, y el chevron es solo para quien mira: VoiceOver ya dice "boton".
    filaNavegacion: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 12,
    },
    filaNavegacionTextos: {
      flexShrink: 1,
    },
    chevron: {
      color: c.textoMeta,
      fontSize: 20,
    },
    // Hoja de una subpantalla y capa de un nivel mas hondo (fenomenos, editor de resumen). La
    // capa NO es otro Modal: iOS no presenta dos a la vez desde el mismo sitio y se queda muerta.
    hoja: {
      flex: 1,
      backgroundColor: c.fondo,
    },
    capa: {
      // absoluteFill, no absoluteFillObject: en RN 0.86 ya no existe el segundo y el primero es
      // el objeto plano, así que se puede esparcir.
      ...StyleSheet.absoluteFill,
      backgroundColor: c.fondo,
    },
    cabecera: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    aviso: {
      color: c.textoTenue,
      fontSize: 15,
      fontStyle: 'italic',
    },
  });
