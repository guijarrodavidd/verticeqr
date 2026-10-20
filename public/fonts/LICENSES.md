# Los tipos de esta carpeta

Están aquí y no se piden a `fonts.googleapis.com` porque esa petición manda la
IP del huésped a un tercero cada vez que abre la carta, sin que nadie le haya
preguntado si consiente. Los genera `node scripts/fuentes.mjs`.

**Las ocho familias son SIL Open Font License 1.1**, que permite servirlas uno
mismo, incluso en un producto comercial, siempre que el aviso de copyright y la
licencia acompañen a los ficheros. Esto es ese aviso.

El texto completo de la licencia: <https://openfontlicense.org/>
(histórico: <https://scripts.sil.org/OFL>).

| Familia | Dónde se usa | Copyright |
| --- | --- | --- |
| Manrope | Panel de Vértice | Copyright 2018 The Manrope Project Authors (<https://github.com/sharanda/manrope>) |
| Cormorant Garamond | Carta de picancun, títulos | Copyright 2015 The Cormorant Project Authors (<https://github.com/CatharsisFonts/Cormorant>) |
| Jost | Carta de picancun, texto | Copyright 2020 The Jost Project Authors (<https://github.com/indestructible-type/Jost>) |
| DM Mono | Tickets, totales y códigos | Copyright 2020 The DM Mono Project Authors (<https://github.com/googlefonts/dm-mono>) |
| Great Vibes | Firma del chef | Copyright 2012 The Great Vibes Project Authors (<https://github.com/googlefonts/greatvibes>) |
| Quicksand | Carta de hixtapa, títulos | Copyright 2011 The Quicksand Project Authors (<https://github.com/andrew-paglinawan/QuicksandFamily>) |
| Raleway | Carta de hixtapa, texto | Copyright 2010 The Raleway Project Authors (<https://github.com/impallari/Raleway>) |
| Source Sans 3 | Carta de evenia-zoraida | Copyright 2010-2023 Adobe (<https://github.com/adobe-fonts/source-sans>) |

## Qué hay en los ficheros

Un `.woff2` por familia, peso, estilo y subconjunto. Solo `latin` y
`latin-ext`: la carta es ES/EN/DE, y el cirílico, el griego y el vietnamita
serían ficheros que nadie va a pedir.

Son 60 ficheros y unos 2 MB en disco, pero **el navegador se baja solo las
caras que pinta**: quien abre la carta de un hotel no descarga los tipos de los
otros dos, y quien solo escribe en castellano no descarga `latin-ext`. En la
práctica son dos o tres ficheros por visita, de 10 a 30 KB cada uno.
