import type { RequestPhrases } from './types';

export const es: RequestPhrases = {
  folderLabel: 'Edita los videos en',
  folderPlaceholder: '[indica la carpeta de los videos]',
  goalLabel: 'Objetivo',
  defaultGoal: 'convertir el material en un video claro y atractivo',
  formatLabel: 'Formato',
  paceLabel: 'Ritmo',
  captionsLabel: 'Subtítulos',
  visualsLabel: 'Visuales',
  sceneReference: reference => `Referencia del catálogo: ${reference}. Adapta el texto al material real.`,
  cleanupLabel: 'Limpieza estándar de la edición',
  cleanup: 'Elimina pausas innecesarias, respiraciones audibles, errores, falsos comienzos y repeticiones redundantes. Conserva las palabras completas, el ritmo natural, las pausas intencionales y el sentido del discurso. Mide los cortes sobre la grabación real y revisa las transiciones para que el habla no quede cortada. En revisiones puntuales, aplica la limpieza solo dentro del alcance de edición pedido; conserva el contenido no relacionado y los tiempos ya aprobados.',
  closing: 'Primero revisa el entorno y los archivos. Conserva los originales, las palabras habladas y el sentido. No inventes precios, resultados ni testimonios. Prepara una muestra de 8–15 segundos para que la revise antes de terminar el video completo. No uses servicios de pago ni subas contenido a terceros sin mi autorización. Al terminar, indica el archivo final y las comprobaciones realizadas.',
  formats: { vertical: '9:16 (vertical)', horizontal: '16:9 (horizontal)', square: '1:1 (cuadrado)', portrait: '4:5 (retrato para el feed)' },
  paces: { natural: 'natural, conservando las pausas intencionales', dynamic: 'dinámico, con cortes precisos que conservan las palabras completas', calm: 'tranquilo, con espacio para la expresión y la comprensión' },
  captions: { readable: 'legibles, con un énfasis sutil en las palabras importantes', subtle: 'discretos, sin animación', none: 'sin subtítulos' },
  effects: { subtle: 'sutiles, solo cuando ayudan a explicar el discurso', educational: 'didácticos, con pasos, indicaciones y títulos', expressive: 'expresivos, con transiciones y énfasis equilibrados', none: 'sin escenas visuales ni efectos adicionales' },
};
