# 🐾 AdopcionMascotas - Frontend

Una aplicación web moderna para la adopción de mascotas, construida con React y Tailwind CSS.

## 📋 Descripción

AdopcionMascotas es una plataforma que conecta mascotas necesitadas con familias amorosas. La aplicación permite a los usuarios explorar mascotas disponibles para adopción y facilita el proceso de conexión entre adoptantes y refugios o dueños actuales.

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite** - Herramienta de construcción rápida para desarrollo frontend
- **Tailwind CSS** - Framework de CSS utilitario para diseño responsive
- **React Router DOM** - Enrutamiento para aplicaciones React
- **ESLint** - Linter para mantener la calidad del código

## 📦 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16.0 o superior)
- **npm** (normalmente viene con Node.js)

### Verificar instalación:
```cmd
node --version
npm --version
```

## 🛠️ Instalación

1. **Clonar el repositorio:**
```cmd
git clone https://github.com/tu-usuario/MP_202510_G81_E1_AdopcionMascotas_Front.git
cd MP_202510_G81_E1_AdopcionMascotas_Front
```

2. **Instalar dependencias:**
```cmd
npm install
```

## 🎯 Scripts Disponibles

### Desarrollo
Para iniciar el servidor de desarrollo:
```cmd
npm run dev
```
Esto iniciará la aplicación en `http://localhost:3000` y se abrirá automáticamente en tu navegador.

### Construcción para Producción
Para crear una versión optimizada para producción:
```cmd
npm run build
```
Los archivos se generarán en la carpeta `dist/`.

### Vista previa de Producción
Para previsualizar la versión de producción localmente:
```cmd
npm run preview
```

### Linting
Para verificar y corregir problemas de código:
```cmd
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Barra de navegación
│   └── Footer.jsx      # Pie de página
├── pages/              # Páginas principales
│   └── Home.jsx        # Página de inicio
├── App.jsx             # Componente principal
├── main.jsx            # Punto de entrada
└── index.css           # Estilos globales con Tailwind

public/                 # Archivos públicos estáticos
index.html             # Template HTML principal
package.json           # Dependencias y scripts
vite.config.js         # Configuración de Vite
tailwind.config.js     # Configuración de Tailwind CSS
postcss.config.js      # Configuración de PostCSS
```

## 🎨 Características

- **Diseño Responsivo:** Optimizado para dispositivos móviles, tabletas y escritorio
- **Interfaz Moderna:** Diseño limpio y atractivo con Tailwind CSS
- **Navegación Intuitiva:** Fácil navegación entre secciones
- **Componentes Reutilizables:** Arquitectura modular para fácil mantenimiento
- **Optimización de Rendimiento:** Construido con Vite para carga rápida

## 🔧 Configuración de Desarrollo

### Extensiones Recomendadas para VS Code:
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag

### Variables de Entorno (Opcional)
Crea un archivo `.env` en la raíz del proyecto para variables de entorno:
```env
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel`
3. Sigue las instrucciones

### Netlify
1. Construye el proyecto: `npm run build`
2. Arrastra la carpeta `dist` a Netlify Deploy

### Otros servicios
El proyecto es compatible con cualquier servicio que soporte aplicaciones estáticas como GitHub Pages, Firebase Hosting, etc.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Comandos de Desarrollo Rápido

```cmd
# Instalación inicial completa
npm install

# Desarrollo con hot reload
npm run dev

# Construcción y preview
npm run build && npm run preview

# Verificación de código
npm run lint
```

## 🐛 Solución de Problemas

### Error: "npm command not found"
- Instala Node.js desde [nodejs.org](https://nodejs.org/)

### Error: "Port 3000 is already in use"
- Cambia el puerto en `vite.config.js` o cierra la aplicación que usa el puerto 3000

### Problemas con Tailwind CSS
- Verifica que los archivos estén incluidos en `tailwind.config.js`
- Asegúrate de que `@tailwind` esté importado en `src/index.css`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo de Desarrollo

- **Grupo 81** - Equipo de desarrollo
- **Proyecto:** MP_202510_G81_E1

---

**¡Gracias por contribuir a AdopcionMascotas! 🐕🐱**
