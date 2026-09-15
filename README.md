<div align="center">

# 🍋 Limón — Portafolio Personal

**Portafolio web de José Manuel Limón Ávila**
Desarrollador Java Full Stack Jr.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)](#)

[![Demo](https://img.shields.io/badge/Demo-live-B7D532?style=flat-square)](#)
[![License](https://img.shields.io/badge/license-personal--use-lightgrey?style=flat-square)](#-licencia)

</div>

Sitio estático, oscuro y con acentos en verde lima (`#B7D532`), con una carita-limón interactiva como mascota del sitio.

> 🔗 **Demo en vivo:** _https://limonav.github.io/Creacion-de-Portafilio/_

---

## 📑 Tabla de contenido

- [Características](#-características)
- [Estructura del proyecto](#️-estructura-del-proyecto)
- [Tecnologías](#️-tecnologías)
- [Cómo correrlo localmente](#-cómo-correrlo-localmente)
- [Secciones del sitio](#-secciones-del-sitio)
- [Sobre mí](#-sobre-mí)
- [Licencia](#-licencia)

---

## ✨ Características

- **Diseño oscuro "glassmorphism"** con tarjetas translúcidas, blur y bordes sutiles en verde lima.
- **Fondo animado en WebGL**: shader de ruido fractal (fBm) que fluye lentamente, con parallax sutil según la posición del mouse. Se desactiva automáticamente si el navegador no soporta WebGL o si el usuario prefiere menos movimiento (`prefers-reduced-motion`).
- **Mascota "carita-limón" interactiva** (SVG): los ojos siguen el cursor, parpadea de forma periódica y aleatoria, y flota suavemente.
- **Cursor personalizado** con ícono de limón (normal y hover).
- **Navegación responsiva** con menú hamburguesa en móvil y *scrollspy* que resalta la sección activa.
- **Sección de portafolio filtrable** por categoría de proyecto.
- **Animaciones de entrada** (`fade-up`) y *reveal on scroll* mediante `IntersectionObserver`.
- **CV descargable** en PDF directamente desde la navegación.
- Totalmente responsivo (desktop, tablet y móvil).

---

## 🗂️ Estructura del proyecto

```
.
├── index.html              # Página principal (inicio, portafolio, acerca de, contacto)
├── css/
│   ├── style.css            # Tokens de diseño, layout base, nav, botones, footer
│   └── pages.css            # Estilos específicos de secciones (hero, tarjetas, about, blog, cta)
├── js/
│   ├── main.js               # Menú móvil, scrollspy, reveal on scroll, filtro de proyectos
│   ├── background.js         # Shader WebGL del fondo animado
│   └── lemon.js               # Lógica interactiva de la carita-limón (ojos + parpadeo)
└── assets/
    ├── favicon.svg / favicon-32.png / favicon-180.png
    ├── cursor-lemon.svg / .png          # Cursor normal
    ├── cursor-lemon-hover.svg / .png    # Cursor al pasar sobre links/botones
    └── jose-manuel-limon-avila-cv.pdf  # CV descargable
```
---

## 🛠️ Tecnologías

- HTML5 semántico
- CSS3 (variables/custom properties, Grid, Flexbox, animaciones)
- JavaScript vanilla (sin frameworks ni dependencias de build)
- WebGL (shader de fondo, sin librerías externas)
- Google Fonts: [Inter](https://fonts.google.com/specimen/Inter) y [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

No requiere `npm install` ni proceso de build: es HTML/CSS/JS puro.

---

## 🚀 Cómo correrlo localmente

1. Clona el repositorio:
   ```bash
   git clone https://github.com/LimonAv/<Creacion-de-Portafolio>.git
   cd <Creacion-de-Portafolio>
   ```
2. Abre `index.html` directamente en el navegador, o sirve la carpeta con un servidor local (recomendado para que el shader y las rutas de fuentes/íconos carguen sin problemas de CORS):
   ```bash
   # Con Python
   python3 -m http.server 8000

   # o con Node (npx)
   npx serve .
   ```
3. Visita `http://localhost:8000` en tu navegador.

---

## 📌 Secciones del sitio

| Sección | Descripción |
|---|---|
| **Inicio** | Hero con presentación, CTAs (Ver Portafolio / Descargar CV), datos de contacto y redes. |
| **Portafolio** | Proyectos destacados con filtro por categoría, tags de tecnologías y enlaces a repo/demo. |
| **Acerca de mí** | Historia profesional, habilidades y valores. |
| **CV** | Descarga directa del currículum en PDF. |
| **Contacto** | Bloque de llamada a la acción para contacto directo. |

---

## 🧑‍💻 Sobre mí

Desarrollador Java Full Stack Jr. con formación como Ingeniero en Sistemas Automotrices (IPN – ESIME UPIITA), actualmente especializándome en desarrollo de software. Experiencia en aplicaciones web con APIs REST y bases de datos SQL, además de proyectos de visión por computadora e inteligencia artificial (CNNs, YOLO).

<div align="center">

[![Email](https://img.shields.io/badge/Email-limonavilajosemanuel%40gmail.com-B7D532?style=flat-square&logo=gmail&logoColor=white)](mailto:limonavilajosemanuel@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-joselimonav-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/joselimonav/)
[![GitHub](https://img.shields.io/badge/GitHub-LimonAv-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/LimonAv)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-%2B52%2055%206434%203317-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://wa.me/525564343317)

📍 G.A.M., Ciudad de México — disponible para reubicación

</div>

---

## 📄 Licencia

Este proyecto es de uso personal. Puedes usar el código como referencia, pero por favor no reutilices el contenido personal (CV, fotos, textos) sin autorización.

<div align="center">

Hecho con 🍋 por [José Manuel Limón Ávila](https://github.com/LimonAv)

</div>
