// Contenido escrito de cada lección, por bloques, en el orden en que se lee.
// Una lección sin contenido aquí no se le enseña al alumno.

export type Bloque =
  | { tipo: "texto"; texto: string }
  | { tipo: "pasos"; items: string[] }
  | { tipo: "lista"; items: string[] }
  | { tipo: "prompt"; texto: string }
  | { tipo: "cita"; texto: string };

export type Seccion = { titulo: string; bloques: Bloque[] };

export type Contenido = {
  consigues: string;
  tiempo?: string;
  caso?: string;
  secciones: Seccion[];
  asiQueda?: Seccion;
  revisalo?: string[];
  siNoTeSale?: string[];
  recibes?: string[];
};

export const CONTENIDOS: Record<string, Contenido> = {
  fundamentos: {
    consigues: "Tienes Claude listo en el ordenador y en el móvil, y sabes qué le puedes pasar de tu hotel y qué no.",
    tiempo: "20 minutos",
    secciones: [
      {
        titulo: "Tu cuenta, en el ordenador y en el móvil",
        bloques: [
          {
            tipo: "pasos",
            items: [
              "Entra en **claude.ai** con el correo que usas para trabajar.",
              "Pasa al plan **Pro**. Con el gratuito te quedas sin mensajes en mitad de una tarea larga, y aquí vas a pasarle documentos enteros.",
              "Descarga la app de Claude en el móvil y entra con la misma cuenta. Lo que empiezas en el despacho lo sigues durante la ronda.",
            ],
          },
        ],
      },
      {
        titulo: "Dos ajustes antes de pasarle nada",
        bloques: [
          {
            tipo: "pasos",
            items: [
              "En **Ajustes**, apartado **Privacidad**, desactiva la opción de ayudar a mejorar Claude. Así tus conversaciones no se usan para entrenarlo.",
              "En **Ajustes**, apartado **Perfil**, escribe en dos líneas quién eres y cómo quieres que te conteste. Por ejemplo: «Soy director de un hotel de 80 habitaciones en la costa. Contéstame corto, en castellano de España y sin tecnicismos».",
            ],
          },
        ],
      },
      {
        titulo: "Lo que le puedes pasar y lo que nunca",
        bloques: [
          {
            tipo: "texto",
            texto: "Trátalo como a un consultor de fuera. Le pasas números y procesos, y nunca datos de personas.",
          },
          {
            tipo: "lista",
            items: [
              "**Sí:** totales y porcentajes del mes, la ocupación prevista, la carta, tus procedimientos, tus borradores y los correos con los nombres quitados.",
              "**Nunca:** nombres, DNI o pasaportes de huéspedes, tarjetas, nóminas con nombre, datos de salud ni contraseñas.",
            ],
          },
          {
            tipo: "texto",
            texto: "Si dudas, cambia el nombre por el cargo. «Un huésped» o «la gobernanta» le sirven igual para ayudarte.",
          },
        ],
      },
      {
        titulo: "Dónde se queda cada cosa",
        bloques: [
          {
            tipo: "lista",
            items: [
              "**El chat** es para algo suelto, como un correo o una duda. Cada chat nuevo empieza de cero.",
              "**Los proyectos** son para lo que se repite. Subes la ficha de tu hotel y tus instrucciones una vez, y cada chat que abres dentro ya se lo sabe. Lo montas en la práctica.",
              "**Los artefactos** son los documentos que te prepara en una ventana aparte, como un cuadrante o un informe. Los copias, los cambias o los descargas.",
            ],
          },
        ],
      },
      {
        titulo: "Tu primera prueba",
        bloques: [
          { tipo: "texto", texto: "Abre un chat nuevo, pega esto y rellena los corchetes. Si vas con el móvil, díctalo." },
          {
            tipo: "prompt",
            texto: `Soy [tu puesto] de un hotel de [habitaciones] habitaciones en [zona]. Te cuento cómo es una semana normal en mi despacho.

[cuéntalo como se lo contarías a alguien que empieza contigo: lo que haces cada día, lo que te llega cada semana y lo que te toca a fin de mes]

Antes de contestar, hazme las preguntas que te falten. Después dime qué tareas de las que te he contado podrías hacer tú, cuánto tiempo me ahorrarías en cada una y qué necesitarías de mí.`,
          },
          { tipo: "texto", texto: "Guárdate la respuesta. Luego sigue con la siguiente lección de hoy, cómo pedirle las cosas." },
        ],
      },
    ],
    revisalo: [
      "Que en lo que le has contado no haya nombres de personas.",
      "Que las tareas que te propone salgan de lo que le has contado tú y no de un hotel cualquiera.",
    ],
    siNoTeSale: [
      "Si te contesta largo y general, dile «más corto y solo con lo que te he contado yo».",
      "Si no ves los ajustes en el móvil, hazlo desde claude.ai en el ordenador. Se guardan para las dos.",
    ],
  },

  "dia-02": {
    consigues: "Le pides las cosas a Claude para que la respuesta salga bien a la primera.",
    tiempo: "15 minutos",
    caso:
      "Un huésped de la 214 escribe molesto porque le hemos cobrado 23,50 € del minibar y dice que no consumió nada. Vas a escribirle el correo probando tres formas de pedírselo a Claude.",
    secciones: [
      {
        titulo: "Forma 1 · Pídele otra vez",
        bloques: [
          {
            tipo: "pasos",
            items: [
              "Abre un chat nuevo y escribe: «Escribe un correo para un huésped que reclama un cargo de minibar de 23,50 € que dice no haber consumido».",
              "La respuesta sale correcta, pero suena a plantilla.",
              "Pulsa dos veces el botón de **reintentar**, la flecha circular que hay debajo de la respuesta. Tendrás tres versiones.",
              "Quédate con lo mejor de cada una: «Junta el arranque de la segunda con el cierre de la tercera».",
            ],
          },
        ],
      },
      {
        titulo: "Forma 2 · Que te pregunte primero",
        bloques: [
          { tipo: "texto", texto: "Añade esta frase al final de cualquier petición:" },
          { tipo: "prompt", texto: "Antes de escribir nada, hazme las preguntas que necesites para hacerlo bien." },
          {
            tipo: "texto",
            texto:
              "Claude te preguntará lo que le falta, por ejemplo si se revisó el minibar al salir o qué le quieres ofrecer. Contesta en dos líneas y verás cómo cambia el correo.",
          },
        ],
      },
      {
        titulo: "Forma 3 · Dale un ejemplo de cómo escribes tú",
        bloques: [{ tipo: "texto", texto: "Pega un correo tuyo que te guste y dile: «Así escribo yo. Escribe el nuevo con este tono»." }],
      },
      {
        titulo: "Las tres juntas",
        bloques: [
          {
            tipo: "prompt",
            texto: `Necesito responder a un huésped por correo.

QUÉ HA PASADO
[cuéntalo como me lo contarías a mí]

LO QUE PUEDO OFRECER
[por ejemplo, anular el cargo, o nada]

ASÍ ESCRIBO YO
[pega un correo tuyo que te guste]

Antes de escribir nada, hazme las preguntas que necesites para hacerlo bien. Después dame dos versiones, una de 120 palabras y otra de 60, con el tono de mi ejemplo.`,
          },
        ],
      },
    ],
    asiQueda: {
      titulo: "Así queda · Hotel Brisalta",
      bloques: [
        { tipo: "texto", texto: "**Lo que pregunta Claude**" },
        {
          tipo: "pasos",
          items: [
            "¿Se revisó el minibar al salir y qué faltaba?",
            "¿Es la primera vez que se aloja con vosotros?",
            "¿Hasta dónde puedes llegar, anular todo o una parte?",
          ],
        },
        {
          tipo: "texto",
          texto:
            "**Lo que le contestas:** se revisó al salir y faltaban una botella pequeña de cava, 15,50 €, y una bolsa de almendras, 8 €. Es su primera vez. Puedo anular las almendras.",
        },
        { tipo: "texto", texto: "**La versión corta**" },
        {
          tipo: "cita",
          texto:
            "Estimado señor, gracias por escribirnos. Hemos revisado el cargo del minibar. Al salir faltaban una botella pequeña de cava y una bolsa de almendras, 23,50 € en total. Entendemos que pueda haber una confusión, así que hemos anulado las almendras y el cargo queda en 15,50 €. Si lo desea, le enviamos el detalle. Un saludo, Laura Martín, directora del Hotel Brisalta.",
        },
      ],
    },
    revisalo: [
      "Que los importes cuadren con el cargo real.",
      "Que no reconozca un error que no ha habido.",
      "Que lo que ofrece sea lo que tú le has dicho.",
    ],
    siNoTeSale: [
      "Si te hace demasiadas preguntas, dile «hazme solo las tres más importantes».",
      "Si no copia tu tono, dile «fíjate más en mi ejemplo, con frases igual de cortas».",
    ],
    recibes: ["Las tres formas de pedir, cada una con su antes y su después.", "El prompt del correo delicado."],
  },

  "dia-03": {
    consigues: "Claude conoce tu hotel y cómo trabajas, en una ficha que rellenas una sola vez.",
    tiempo: "15 minutos",
    secciones: [
      {
        titulo: "Paso a paso",
        bloques: [
          {
            tipo: "pasos",
            items: [
              "Descarga la plantilla **Ficha del hotel**, en Word, en Recursos.",
              "Rellena lo que sepas de memoria y deja en blanco lo demás. No le dediques más de 10 minutos.",
              "Abre un chat nuevo en Claude, adjunta la ficha con el clip y pega el prompt de abajo.",
              "Contesta lo que te pregunte y pídele la ficha completa. Guárdala, porque con ella montas tu proyecto.",
            ],
          },
        ],
      },
      {
        titulo: "Lo que lleva la ficha",
        bloques: [
          {
            tipo: "lista",
            items: [
              "**El hotel:** nombre, ubicación, tipo y habitaciones por tipo.",
              "**Servicios y horarios:** restaurante, bar, piscina y recepción.",
              "**Lo que se vende aparte,** con su precio: parking, salida tardía, cenas especiales o traslados.",
              "**El equipo por cargos,** sin nombres: qué departamentos hay y quién manda en cada uno.",
              "**Las temporadas:** qué meses son altos, medios y bajos.",
              "**Cómo escribes:** de tú o de usted, tu firma y el tono.",
              "**Lo que nunca debe hacer,** por ejemplo prometer una mejora gratis o un descuento sin consultarte.",
            ],
          },
        ],
      },
      {
        titulo: "El prompt",
        bloques: [
          {
            tipo: "prompt",
            texto:
              "Te adjunto la ficha de mi hotel. Léela entera y dime qué te falta para ayudarme en el día a día con correos, reseñas, informes y el equipo. Hazme las preguntas de una en una. Cuando acabemos, devuélveme la ficha completa con todo lo que te haya contado, en el mismo orden.",
          },
        ],
      },
    ],
    asiQueda: {
      titulo: "Así queda · Hotel Brisalta",
      bloques: [
        { tipo: "texto", texto: "**La respuesta de Claude**" },
        {
          tipo: "cita",
          texto:
            "He leído la ficha del Hotel Brisalta. Las habitaciones y los horarios están muy completos. Para ayudarte bien me faltan cuatro cosas. Quién lleva cada departamento, por cargo. Cómo firmas los correos y si a los dueños les hablas de tú o de usted. Lo que se paga aparte y a qué precio. Y las temporadas del hotel. Empezamos por la primera. ¿Qué departamentos tiene el hotel y quién es el responsable de cada uno?",
        },
        { tipo: "texto", texto: "Al acabar, Claude te devuelve la ficha completa. La del Hotel Brisalta la tienes de ejemplo en Recursos." },
      ],
    },
    revisalo: [
      "Que no haya nombres de empleados ni datos de huéspedes. Solo cargos.",
      "Que los precios y los horarios sean los de este año.",
      "Que el tono que describe sea el tuyo.",
    ],
    siNoTeSale: [
      "Si te pregunta demasiado, dile «pregúntame solo lo imprescindible».",
      "Si no puede leer el Word, copia el texto y pégalo en el chat.",
    ],
    recibes: ["La plantilla de la ficha del hotel, en Word.", "La ficha del Hotel Brisalta ya rellena, como ejemplo."],
  },
};
