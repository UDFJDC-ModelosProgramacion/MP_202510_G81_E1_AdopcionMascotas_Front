# 🐾 AdopcionMascotas - Frontend

Una aplicación web moderna para la adopción de mascotas con sistema de fallback inteligente, construida con React, TypeScript y Tailwind CSS.

## 📋 Descripción

AdopcionMascotas es una plataforma integral que conecta mascotas necesitadas con familias amorosas. La aplicación permite a los usuarios explorar mascotas disponibles para adopción, gestionar refugios, consultar veterinarios especializados y participar en eventos de adopción.

### ✨ Características Principales

- 🏠 **Gestión de Refugios:** Explorar refugios, ver detalles y registrar nuevos refugios
- 🐕 **Catálogo de Mascotas:** Búsqueda y filtrado avanzado de mascotas disponibles
- 👨‍⚕️ **Directorio Veterinario:** Acceso a veterinarios especializados por refugio
- 📅 **Eventos:** Jornadas de adopción, vacunación y actividades especiales
- 📦 **Sistema de Llegadas:** Historial de rescates y llegadas de mascotas
- 🔄 **Sistema de Fallback Inteligente:** Datos mock cuando el backend no está disponible
- 📱 **Diseño Responsivo:** Optimizado para dispositivos móviles, tabletas y escritorio
- 🖼️ **Manejo de Imágenes:** Placeholders automáticos para imágenes faltantes
- ⚡ **Rendimiento Optimizado:** Carga rápida con Vite y componentes optimizados

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript** - Tipado estático para mayor robustez del código
- **Vite** - Herramienta de construcción rápida para desarrollo frontend
- **Tailwind CSS** - Framework de CSS utilitario para diseño responsive
- **React Router DOM** - Enrutamiento para aplicaciones React de una sola página
- **Lucide React** - Biblioteca de iconos moderna y ligera
- **Axios** - Cliente HTTP para peticiones a la API
- **ESLint** - Linter para mantener la calidad del código

## 🏗️ Arquitectura del Sistema

### Sistema de Fallback Inteligente
El frontend implementa un sistema robusto de fallback que:

1. **Detección de Backend:** Verifica automáticamente la disponibilidad del backend
2. **Fallback a Mock:** Si el backend no responde, utiliza datos mock predefinidos
3. **Manejo de Estados:** Distingue entre backend no disponible vs endpoints vacíos
4. **Logs Detallados:** Sistema de logging para facilitar el debugging

```typescript
// Ejemplo de lógica de fallback
const isAvailable = await this.isBackendAvailable();
if (!isAvailable) {
    console.warn("🔄 Puerto no responde - Usando datos MOCK");
    return this.getMockData();
}
// Continuar con datos reales del backend...
```

## � Inicio Rápido

```cmd
# 1. Clonar e instalar
git clone https://github.com/tu-usuario/MP_202510_G81_E1_AdopcionMascotas_Front.git
cd MP_202510_G81_E1_AdopcionMascotas_Front
npm install

# 2. Iniciar desarrollo
npm run dev

# 3. Abrir http://localhost:5173
```

**¡Listo!** La aplicación funcionará con datos mock si no hay backend disponible.

## �📦 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.0 o superior)
- **npm** (versión 8.0 o superior)

### Verificar instalación:
```cmd
node --version
npm --version
```

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio:**
```cmd
git clone https://github.com/tu-usuario/MP_202510_G81_E1_AdopcionMascotas_Front.git
cd MP_202510_G81_E1_AdopcionMascotas_Front
```

2. **Instalar dependencias:**
```cmd
npm install
```

3. **Configurar variables de entorno:**
```cmd
# El backend está configurado por defecto para:
# API_BASE_URL = "http://localhost:8080/api"
```

## 🎯 Scripts Disponibles

### Desarrollo
```cmd
npm run dev
```
Inicia el servidor de desarrollo en `http://localhost:5173` con hot reload automático.

### Construcción para Producción
```cmd
npm run build
```
Genera los archivos optimizados en la carpeta `dist/`.

### Vista previa de Producción
```cmd
npm run preview
```
Previsualiza la versión de producción localmente.

### Verificación de Código
```cmd
npm run lint
```
Ejecuta ESLint para verificar y corregir problemas de código.

## 📁 Estructura del Proyecto

```
📁 proyecto/
├── 📁 apps/                    # Páginas principales de la aplicación
│   ├── 📄 page.tsx            # Página de inicio con mascotas y refugios
│   ├── � layout.tsx          # Layout principal de la aplicación
│   ├── 📄 globals.css         # Estilos globales
│   ├── 📁 components/         # Componentes específicos de páginas
│   ├── �📁 shelter/            # Módulo de refugios
│   │   ├── 📄 page.tsx        # Lista de refugios y registro
│   │   └── 📁 detail/         # Detalle de refugio específico
│   │       └── 📄 page.tsx    # Vista detallada con tabs
│   ├── 📁 adoption/           # Módulo de adopción
│   ├── 📁 register/           # Módulo de registro
│   └── 📁 veterinarian/       # Módulo de veterinarios
├── 📁 src/                    # Código fuente principal
│   ├── 📁 components/         # Componentes reutilizables UI
│   ├── 📁 lib/               # Configuraciones y utilidades
│   ├── 📁 services/          # Servicios y lógica de API
│   │   └── 📄 api.ts         # Servicio principal con fallback inteligente
│   ├── 📁 types/             # Definiciones de tipos TypeScript
│   │   └── 📄 index.ts       # Interfaces para Pet, Shelter, Veterinarian, etc.
│   └── 📄 main.tsx           # Punto de entrada con configuración de rutas
├── 📁 public/                # Archivos estáticos
│   └── 📄 placeholder.svg    # Placeholder para imágenes faltantes
├── 📄 package.json           # Dependencias y scripts
├── 📄 vite.config.js         # Configuración de Vite
├── 📄 tailwind.config.js     # Configuración de Tailwind CSS
└── 📄 tsconfig.json          # Configuración de TypeScript
```

## 🎨 Funcionalidades Implementadas

### 🏠 Gestión de Refugios
- **Lista de Refugios:** Vista de tarjetas con información básica
- **Detalle de Refugio:** Información completa con sistema de tabs
- **Registro de Refugios:** Formulario para agregar nuevos refugios
- **Estadísticas:** Capacidad, ocupación, mascotas disponibles

### 🐕 Catálogo de Mascotas
- **Búsqueda Avanzada:** Filtros por tamaño, género y raza
- **Información Detallada:** Perfil completo de cada mascota
- **Estado de Salud:** Información sobre vacunas y esterilización
- **Proceso de Adopción:** Formularios y seguimiento

### 👨‍⚕️ Directorio Veterinario
- **Especialistas por Refugio:** Veterinarios asociados a cada refugio
- **Información Profesional:** Licencias, especialidades y experiencia
- **Disponibilidad:** Horarios de atención (mañana, tarde, noche)

### 📅 Sistema de Eventos
- **Eventos por Refugio:** Jornadas de vacunación, adopción, educación
- **Estados:** Próximos, completados y en progreso
- **Información Detallada:** Fechas, descripciones y organizador

### 📦 Sistema de Llegadas
- **Historial de Rescates:** Registro de llegadas de mascotas
- **Razones de Ingreso:** Abandono, entrega voluntaria, rescate
- **Estado de Salud:** Condición al momento del ingreso

## 🔧 Configuración de Desarrollo

### Backend Requerido
El frontend espera un backend en `http://localhost:8080/api` con los siguientes endpoints:

```
GET /pets                           # Lista de mascotas
GET /shelters                       # Lista de refugios
GET /shelters/{id}                  # Detalle de refugio
GET /shelters/{id}/pets             # Mascotas por refugio
GET /shelters/{id}/veterinarians    # Veterinarios por refugio
GET /shelters/{id}/events           # Eventos por refugio
GET /shelters/{id}/arrivals         # Llegadas por refugio
POST /shelters                      # Crear refugio
```

### Modo Fallback
Si el backend no está disponible, la aplicación automáticamente:
- ✅ Detecta la falta de conexión
- ✅ Muestra datos mock predefinidos
- ✅ Mantiene funcionalidad completa
- ✅ Registra el estado en consola para debugging

### Extensiones Recomendadas para VS Code:
- **Tailwind CSS IntelliSense** - Autocompletado para clases CSS
- **TypeScript Importer** - Auto-import para TypeScript
- **ES7+ React/Redux/React-Native snippets** - Snippets útiles
- **Prettier - Code formatter** - Formateo automático
- **ESLint** - Linting en tiempo real
- **Auto Rename Tag** - Renombrado automático de tags JSX

## 🚦 Estados de la Aplicación

### Conexión con Backend
```typescript
🔍 Verificando disponibilidad del backend...
✅ Backend DISPONIBLE (status: 200) - Puerto responde
❌ Backend NO DISPONIBLE - Puerto no responde

🔄 Puerto no responde - Usando datos MOCK
🔧 Puerto responde pero endpoint tiene error - Mostrando lista vacía
```

### Datos Mock Incluidos

El sistema de fallback incluye datos mock realistas y variados:

- **5 Refugios** - Desde pequeños refugios locales hasta grandes organizaciones
- **17+ Mascotas** - Diferentes especies (perros, gatos, conejos), razas y edades
- **14 Veterinarios** - Con especialidades variadas y horarios de atención
- **17 Eventos** - Jornadas de adopción, vacunación, educación y celebraciones
- **14+ Registros de llegada** - Historiales detallados con diferentes razones de ingreso

### Probando el Sistema de Fallback

Para probar la funcionalidad de fallback:

1. **Con Backend Disponible:** Inicia el backend en puerto 8080 y el frontend
2. **Sin Backend:** Solo inicia el frontend - automáticamente usará datos mock
3. **Backend Parcial:** Backend con algunos endpoints faltantes - muestra datos vacíos según corresponda

La aplicación registra automáticamente en consola el estado de conexión para facilitar el debugging.

## 📝 Comandos de Desarrollo Útiles

```cmd
# Instalación inicial completa
npm install

# Desarrollo con hot reload
npm run dev

# Construcción y preview
npm run build && npm run preview

# Verificación de código
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

## ⚡ Características Técnicas

### Optimización de Rendimiento

- **Lazy Loading:** Carga de componentes bajo demanda
- **Image Optimization:** Placeholders automáticos y manejo de errores
- **Build Optimization:** Vite para bundling ultrarrápido
- **TypeScript:** Detección de errores en tiempo de compilación

### Accesibilidad y UX

- **Responsive Design:** Adaptado a móviles, tablets y desktop
- **Error Boundaries:** Manejo robusto de errores sin crashear la aplicación
- **Loading States:** Indicadores de carga para mejor experiencia
- **Fallback Images:** Placeholders automáticos para imágenes faltantes

## 🐛 Debugging y Logs

La aplicación incluye logging detallado en la consola del navegador:

```javascript
// Ejemplos de logs que verás:
console.log('🏠 Intentando obtener shelter 1...');
console.log('✅ Backend respondió con shelter 1');
console.warn('🔄 Puerto no responde - Usando datos MOCK para pets del shelter 1');
```

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo de Desarrollo

- **Grupo 81** - "Aves de Hermes"
- **Proyecto:** MP_202510_G81_E1
- **Período:** 2025-1

---

### ¡Gracias por contribuir a AdopcionMascotas! 🐕🐱💝
