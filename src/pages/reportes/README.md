# Módulo de Reportes Dinámicos - Frontend

## 📋 Descripción

Sistema completo de generación de reportes con tres modalidades:

1. **Reportes Estáticos**: Reportes predefinidos listos para usar
2. **Reportes Personalizados**: Crea reportes seleccionando campos y filtros
3. **Lenguaje Natural**: Genera reportes escribiendo consultas en español

## 🚀 Instalación y Uso

### Acceder al módulo

Una vez implementado, accede a través de la ruta:

```
http://localhost:5173/analitica/reportes
```

### Estructura de Archivos

```
src/
├── api/
│   └── reportesApi.jsx          # API client para endpoints de reportes
├── pages/
│   └── reportes/
│       ├── index.js             # Exportaciones centralizadas
│       ├── ReportesPage.jsx     # Página principal con tabs
│       ├── ReportesEstaticos.jsx
│       ├── ReportesPersonalizados.jsx
│       ├── ReportesNaturales.jsx
│       └── components/
│           ├── SelectorEntidad.jsx
│           ├── SelectorCampos.jsx
│           └── FiltrosDinamicos.jsx
└── routers/
    └── AppRouter.jsx            # Configuración de rutas
```

## 🎯 Características

### 1. Reportes Estáticos

- 5 reportes predefinidos:
  - Ventas por Estado
  - Ventas del Mes
  - Productos con Stock Bajo
  - Ventas por Cliente
  - Productos Más Vendidos
- Formatos: PDF y Excel
- Filtros opcionales por rango de fechas

### 2. Reportes Personalizados

- Selección de entidad (Productos, Clientes, Ventas, Categorías)
- Selección de campos personalizados
- Filtros dinámicos según la entidad
- Proceso en 3 pasos:
  1. Selecciona entidad
  2. Elige campos
  3. Aplica filtros y genera

### 3. Lenguaje Natural

- Escribe consultas en español natural
- Ejemplos de consultas disponibles
- Interpretación automática de filtros
- Feedback de interpretación

**Ejemplos de consultas:**

```
- "Productos con stock bajo"
- "Clientes activos"
- "Ventas pagadas este mes"
- "Productos sin stock"
- "Ventas del último mes"
```

## 🔧 Configuración

### Variables de Entorno

Asegúrate de tener configurada la variable de entorno en `.env`:

```env
VITE_API_URL=http://localhost:8000
```

### Backend Requerido

El backend debe estar corriendo en `http://localhost:8000` con los siguientes endpoints:

```
GET    /api/analitica/reportes/disponibles/
POST   /api/analitica/reportes/generar-estatico/
GET    /api/analitica/reportes/entidades/
GET    /api/analitica/reportes/campos-entidad/
POST   /api/analitica/reportes/generar-personalizado/
POST   /api/analitica/reportes/generar-natural/
GET    /api/analitica/reportes/ejemplos-nl/
GET    /api/analitica/reportes/historial/
GET    /api/analitica/reportes/:id/descargar/
```

## 📊 Uso Práctico

### Ejemplo 1: Reporte Estático

1. Accede a la tab "Reportes Estáticos"
2. Selecciona "Ventas del Mes"
3. Elige formato (PDF o Excel)
4. Opcionalmente agrega rango de fechas
5. Haz clic en "Generar Reporte"
6. El archivo se descarga automáticamente

### Ejemplo 2: Reporte Personalizado

1. Accede a la tab "Reportes Personalizados"
2. Selecciona la entidad "Productos"
3. Marca los campos: nombre, precio, stock, categoria
4. Agrega filtro: stock menor a 10
5. Selecciona formato Excel
6. Genera el reporte

### Ejemplo 3: Lenguaje Natural

1. Accede a la tab "Lenguaje Natural"
2. Escribe: "Productos con stock bajo"
3. Selecciona formato PDF
4. Haz clic en "Generar Reporte"
5. El sistema interpreta y genera automáticamente

## 🔐 Autenticación

Todos los endpoints requieren autenticación JWT. El token se envía automáticamente desde `localStorage`:

```javascript
const token = localStorage.getItem('access');
```

## 🐛 Troubleshooting

### Error: "No hay token de acceso"

**Solución**: Asegúrate de estar autenticado. Inicia sesión nuevamente.

### Error: "Error al cargar reportes disponibles"

**Solución**: Verifica que el backend esté corriendo y accesible en `http://localhost:8000`

### Error: "Error al generar reporte"

**Solución**: 
- Verifica que hayas seleccionado al menos un campo
- Revisa la consola del navegador para más detalles
- Verifica que los filtros tengan valores válidos

### Reportes no se descargan

**Solución**:
- Verifica que tu navegador no esté bloqueando descargas
- Revisa la consola del navegador
- Verifica que el backend esté devolviendo el archivo correctamente

## 📝 Ejemplos de Código

### Llamar API directamente

```javascript
import { generarReporteNatural } from '../../api/reportesApi';

const generarReporte = async () => {
  try {
    const resultado = await generarReporteNatural({
      consulta: 'Productos con stock bajo',
      formato: 'PDF'
    });
    console.log('Reporte generado:', resultado);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🎨 Personalización

### Agregar Iconos Personalizados

Edita `SelectorEntidad.jsx`:

```javascript
const iconos = {
  productos: <FaBox className="text-4xl text-blue-600" />,
  // Agrega más iconos aquí
};
```

### Cambiar Colores

Edita las clases de Tailwind en cada componente:

```javascript
className="bg-blue-600 hover:bg-blue-700"
```

## 📈 Próximas Mejoras

- [ ] Historial de reportes con visualización en tabla
- [ ] Programación de reportes automáticos
- [ ] Compartir reportes por email
- [ ] Visualizaciones gráficas de datos
- [ ] Exportar configuraciones de reportes

## 🤝 Soporte

Para reportar problemas o sugerencias:

1. Revisa la consola del navegador
2. Verifica los logs del backend
3. Consulta la documentación del backend en `backend-smart/INTEGRACION_FRONTEND.md`

---

**Desarrollado con ❤️ para el proyecto Smart**
