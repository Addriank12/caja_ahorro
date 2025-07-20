# Sistema de Caja de Ahorro - Frontend

Una aplicación web moderna para la gestión de una caja de ahorro, desarrollada con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Dashboard intuitivo** con estadísticas y resúmenes
- **Gestión de Socios** - registro, edición y consulta de socios
- **Cuentas de Ahorro** - administración completa de cuentas
- **Movimientos de Ahorro** - registro de depósitos, retiros y transferencias
- **Aportaciones** - control de aportaciones de socios
- **Interfaz responsiva** - funciona en desktop, tablet y móvil
- **Búsqueda y filtros avanzados** en todas las secciones

## 🛠️ Tecnologías Utilizadas

- **React 19** - Biblioteca de interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router DOM** - Navegación del lado del cliente
- **Lucide React** - Iconos modernos
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Date-fns** - Utilidades para fechas
- **Vite** - Herramienta de construcción rápida

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Un servidor backend compatible con la API (ver swagger.json)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd caja_ahorro
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Ejecuta el linter para revisar el código
- `npm run preview` - Previsualiza la construcción de producción

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de interfaz básicos
│   └── Layout.tsx      # Layout principal de la aplicación
├── pages/              # Páginas de la aplicación
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── Socios.tsx      # Gestión de socios
│   ├── CuentasAhorro.tsx # Gestión de cuentas
│   ├── Movimientos.tsx # Registro de movimientos
│   └── Aportaciones.tsx # Gestión de aportaciones
├── services/           # Servicios de API
│   └── api.ts          # Cliente de API principal
├── hooks/              # Hooks personalizados
│   └── useApi.ts       # Hook para llamadas a la API
├── types/              # Definiciones de tipos TypeScript
│   └── api.ts          # Tipos de la API
├── utils/              # Utilidades y helpers
│   └── formatters.ts   # Funciones de formateo
├── config/             # Configuración de la aplicación
│   └── constants.ts    # Constantes globales
└── assets/             # Recursos estáticos
```

## 🔧 Configuración de la API

La aplicación está diseñada para trabajar con una API REST. Asegúrate de que tu backend tenga los siguientes endpoints:

### Endpoints principales:
- `GET /api/Socio` - Obtener todos los socios
- `POST /api/Socio` - Crear un nuevo socio
- `GET /api/CuentasAhorro` - Obtener todas las cuentas
- `GET /api/MovimientosAhorro` - Obtener todos los movimientos
- `GET /api/Aportaciones` - Obtener todas las aportaciones

Revisa el archivo `swagger.json` para la documentación completa de la API.

## 🎨 Personalización

### Colores y Temas
Los colores se pueden personalizar en el archivo `tailwind.config.js` y los estilos globales en `src/App.css`.

### Agregar Nuevas Páginas
1. Crear el componente en `src/pages/`
2. Agregar la ruta en `src/App.tsx`
3. Actualizar la navegación en `src/components/Layout.tsx`

### Customizar la API
Modifica `src/services/api.ts` para ajustar las llamadas a tu backend específico.

## 📱 Características Responsivas

La aplicación es completamente responsiva y se adapta a:
- **Desktop** (1024px+) - Sidebar fijo y vista completa
- **Tablet** (768px-1023px) - Layout adaptado
- **Móvil** (<768px) - Sidebar colapsable, controles touch-friendly

## 🔒 Características de Seguridad

- Validación de datos en el frontend
- Sanitización de inputs
- Manejo seguro de errores
- Protección contra XSS básica

## 🚀 Despliegue

### Construcción para Producción
```bash
npm run build
```

### Despliegue en Netlify/Vercel
1. Conecta tu repositorio
2. Configura las variables de entorno
3. El comando de construcción es `npm run build`
4. El directorio de salida es `dist`

### Despliegue en servidor propio
1. Ejecuta `npm run build`
2. Copia el contenido de `dist/` a tu servidor web
3. Configura el servidor para servir `index.html` en todas las rutas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

## 🔄 Roadmap

### Próximas Funcionalidades
- [ ] Módulo de Créditos completo
- [ ] Reportes y gráficos avanzados
- [ ] Exportación de datos a PDF/Excel
- [ ] Sistema de notificaciones
- [ ] Módulo de configuración avanzada
- [ ] Integración con sistemas de pago
- [ ] App móvil (React Native)

---

Desarrollado con ❤️ para facilitar la gestión de cajas de ahorro.
