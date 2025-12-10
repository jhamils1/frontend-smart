# Módulo de Detalle de Carrito - Estructura Reorganizada

## 📋 Descripción

El módulo de **Detalle de Carrito** ahora tiene su propia estructura completa, separada del módulo de Carrito, siguiendo el mismo patrón de arquitectura que otros módulos del sistema.

## 🗂️ Estructura de Archivos

```
src/pages/detallecarrito/
├── detalleCarritoPage.jsx    # Página principal (contenedor)
├── detalleCarritoList.jsx    # Lista de productos del carrito
└── detalleCarritoForm.jsx    # Formulario para agregar/editar productos
```

## 🔄 Flujo de Navegación

### 1. Desde el Listado de Carritos
- El usuario ve la lista de carritos en `/carrito`
- Al hacer clic en **"Ver Detalles"** en un carrito específico
- Se navega a `/detallecarrito` pasando la información del carrito seleccionado

### 2. En la Página de Detalles
- Se muestra la información del carrito (código, cliente, estado)
- Se lista todos los productos agregados al carrito
- El usuario puede:
  - ✅ Agregar nuevos productos
  - ✏️ Editar productos existentes (cantidad)
  - 🗑️ Eliminar productos del carrito
  - 🔍 Buscar productos en el carrito
  - ✓ Confirmar el pedido y proceder al pago

## 📄 Componentes

### detalleCarritoPage.jsx
**Responsabilidades:**
- Gestiona el estado global del módulo
- Carga los detalles del carrito desde la API
- Carga la lista de productos disponibles
- Maneja la navegación (recibe el carrito desde `location.state`)
- Muestra el formulario modal para agregar/editar productos
- Permite confirmar el pedido y navegar a la página de pago

**Props recibidas via navegación:**
```javascript
navigate("/detallecarrito", { 
  state: { 
    carrito: carritoObject 
  } 
})
```

### detalleCarritoList.jsx
**Props:**
- `detalles`: Array de productos en el carrito
- `carrito`: Objeto con información del carrito
- `onEdit`: Función para editar un detalle
- `onDelete`: Función para eliminar un detalle
- `onAddNew`: Función para agregar nuevo producto

**Características:**
- Muestra información del carrito en el encabezado
- Tabla con todos los productos agregados
- Búsqueda por producto, código o ID
- Cálculo automático del total de items y total del carrito
- Badges de estado y cantidad

### detalleCarritoForm.jsx
**Props:**
- `onSubmit`: Función para guardar el formulario
- `onCancel`: Función para cancelar
- `initialData`: Datos iniciales para edición
- `productos`: Array de productos disponibles
- `carritoId`: ID del carrito al que se agregan productos
- `loading`: Estado de carga

**Características:**
- Selector de producto con información completa
- Campo de cantidad con validación
- Precio unitario se asigna automáticamente del producto
- Cálculo automático del subtotal
- Validación de stock disponible

## 🔗 Integración con el Módulo de Carrito

### Cambios en carritoList.jsx
```javascript
// Antes: Llamaba a onViewDetails que mostraba el manager en la misma página
<button onClick={() => onViewDetails(c)}>Ver Detalles</button>

// Ahora: Navega a la página dedicada de detalles
<button onClick={() => navigate("/detallecarrito", { state: { carrito: c } })}>
  Ver Detalles
</button>
```

### Cambios en carritoPage.jsx
- ❌ Eliminado: `DetalleCarritoManager` (componente inline)
- ❌ Eliminado: Estado `viewingDetails`
- ❌ Eliminado: Carga de productos
- ✅ Simplificado: Solo maneja carritos (CRUD básico)

## 📊 Flujo de Datos

```
CarritoPage (Lista de carritos)
    │
    ├─> Click "Ver Detalles"
    │
    └─> navigate("/detallecarrito", { state: { carrito } })
            │
            ▼
    DetalleCarritoPage
            │
            ├─> Carga detalles del carrito (API)
            ├─> Carga productos disponibles (API)
            │
            ├─> DetalleCarritoList (muestra productos)
            │       ├─> Botón "Agregar Producto"
            │       ├─> Botón "Editar" por producto
            │       └─> Botón "Eliminar" por producto
            │
            └─> DetalleCarritoForm (modal)
                    ├─> Agregar nuevo producto
                    └─> Editar producto existente
```

## 🎯 Ventajas de la Nueva Estructura

### ✅ Separación de Responsabilidades
- Cada módulo tiene su propia estructura independiente
- Carrito se enfoca solo en la gestión de carritos
- Detalle Carrito se enfoca solo en productos del carrito

### ✅ Mejor Navegación
- URLs claras y semánticas (`/carrito` vs `/detallecarrito`)
- Historial de navegación del browser funciona correctamente
- Se puede acceder directamente a detalles con F5 (refresh)

### ✅ Código Más Mantenible
- Archivos más pequeños y enfocados
- Menos props drilling
- Más fácil de testear y debuggear

### ✅ Consistencia
- Sigue el mismo patrón que otros módulos
- Estructura predecible: `page.jsx` → `list.jsx` → `form.jsx`

## 🚀 Uso

### Ver Detalles de un Carrito
1. Ir a `/carrito`
2. Buscar el carrito deseado
3. Click en **"Ver Detalles"**
4. Se abre la página de detalles del carrito

### Agregar Producto al Carrito
1. En la página de detalles
2. Click en **"+ Agregar Producto"**
3. Seleccionar producto del dropdown
4. Ingresar cantidad
5. Click en **"Agregar Producto"**

### Editar Producto del Carrito
1. En la tabla de productos
2. Click en **"Editar"** en el producto deseado
3. Modificar la cantidad
4. Click en **"Actualizar Producto"**

### Confirmar Pedido
1. Verificar que el carrito tenga productos
2. Click en **"✓ Confirmar Pedido y Proceder al Pago"**
3. Se redirige a `/pago` con la información del carrito

## 🔄 APIs Utilizadas

```javascript
// Detalles del Carrito
getDetallesByCarrito(carritoId)  // Obtener productos de un carrito
createDetalleCarrito(data)       // Agregar producto al carrito
updateDetalleCarrito(id, data)   // Actualizar producto del carrito
deleteDetalleCarrito(id)         // Eliminar producto del carrito

// Productos
getProductos()                   // Obtener lista de productos disponibles
```

## 📝 Notas Importantes

- El carrito debe existir antes de agregar detalles
- El precio unitario se toma automáticamente del producto
- El subtotal se calcula automáticamente (cantidad × precio_unitario)
- Se valida que haya productos antes de confirmar el pedido
- Al confirmar, se navega a `/pago` con el total calculado
- El botón "Volver" regresa a la lista de carritos en `/carrito`

## 🐛 Validaciones

- ✓ No se puede confirmar un carrito vacío
- ✓ No se puede confirmar un carrito con total = 0
- ✓ Se valida que el producto seleccionado exista
- ✓ La cantidad debe ser mínimo 1
- ✓ Se muestra información de stock disponible

---

**Última actualización:** Noviembre 2025
