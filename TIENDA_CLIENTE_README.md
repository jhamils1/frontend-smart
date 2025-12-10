# Vista de Tienda para Clientes - SmartSales365

## 📋 Descripción

Se ha implementado una interfaz completa de tienda en línea para clientes, permitiéndoles navegar productos, añadir al carrito y realizar compras de manera intuitiva.

## 🎯 Funcionalidades Implementadas

### 1. **Página de Tienda (`/cliente/tienda`)**
   - **Catálogo de productos** con tarjetas visuales atractivas
   - **Búsqueda en tiempo real** por nombre o descripción
   - **Filtrado por categorías** con navegación tipo tabs
   - **Información de stock** visible en cada producto
   - **Indicador de carrito** con contador de items en tiempo real
   - **Añadir al carrito** con un solo clic

### 2. **Página de Carrito (`/cliente/carrito`)**
   - **Vista detallada** de todos los productos en el carrito
   - **Modificar cantidades** con validación de stock
   - **Eliminar productos** individualmente
   - **Resumen de compra** con subtotal y total
   - **Información de beneficios** (envío gratis, devoluciones, etc.)
   - **Botón de checkout** para proceder al pago

### 3. **Sistema de Notificaciones**
   - Notificaciones toast para acciones exitosas/fallidas
   - Feedback visual inmediato al añadir productos
   - Alertas de stock insuficiente

### 4. **Redirección Inteligente por Rol**
   - **Clientes**: Redirigen a `/cliente/tienda` al iniciar sesión
   - **Administradores/Empleados**: Redirigen a `/admin/dashboard`

## 🗂️ Archivos Creados

```
frontend-smart/src/pages/tienda/
├── tiendaPage.jsx           # Página principal de la tienda
└── carritoClientePage.jsx   # Página del carrito de compras
```

## 🔄 Archivos Modificados

### Frontend
- `src/routers/AppRouter.jsx` - Agregadas rutas para clientes
- `src/pages/login/loginPage.jsx` - Redirección según rol
- `src/api/detallecarritoApi.jsx` - Función addDetalleCarrito
- `src/index.css` - Animaciones y estilos personalizados

### Backend (No se modificó, funciona con APIs existentes)
- Utiliza las APIs REST ya implementadas:
  - `GET /api/inventario/productos/` - Listar productos
  - `GET /api/inventario/categorias/` - Listar categorías
  - `GET /api/inventario/carritos/` - Obtener carritos del cliente
  - `POST /api/inventario/carritos/` - Crear nuevo carrito
  - `POST /api/inventario/detalles-carrito/` - Añadir producto al carrito
  - `PUT /api/inventario/detalles-carrito/{id}/` - Actualizar cantidad
  - `DELETE /api/inventario/detalles-carrito/{id}/` - Eliminar del carrito

## 🎨 Características de UI/UX

### Header de Tienda
- Logo y título prominente
- Barra de búsqueda centrada y responsive
- Botón de carrito con badge de cantidad
- Información del usuario con opción de cerrar sesión

### Tarjetas de Producto
- Imagen del producto (con placeholder si no existe)
- Nombre y descripción (truncada)
- Precio destacado en grande
- Badge de estado de stock (Disponible/Bajo/Agotado)
- Código del producto
- Información de financiamiento (cuotas)
- Botón "Añadir" con estados disabled para productos agotados

### Vista de Carrito
- Layout de dos columnas (productos + resumen)
- Controles de cantidad con botones +/-
- Validación de stock en tiempo real
- Subtotales por producto
- Resumen con total general
- CTA prominente para checkout

## 🚀 Flujo de Usuario Cliente

1. **Login** → Sistema detecta rol "Cliente"
2. **Redirección automática** a `/cliente/tienda`
3. **Explorar productos** por categorías o búsqueda
4. **Añadir al carrito** productos deseados
5. **Ver carrito** con badge actualizado
6. **Modificar cantidades** o eliminar items
7. **Proceder al pago** cuando esté listo

## 📱 Responsive Design

- **Mobile First**: Diseñado para funcionar en dispositivos móviles
- **Grid adaptativo**: 1 columna (mobile) → 4 columnas (desktop)
- **Navegación táctil**: Botones y áreas de toque optimizadas

## 🔐 Seguridad

- **Rutas protegidas**: Requieren autenticación
- **Validación de stock**: Antes de añadir al carrito
- **Manejo de errores**: Mensajes claros al usuario

## 🎯 Próximos Pasos Sugeridos

1. **Página de Checkout** - Formulario de datos de envío y pago
2. **Historial de pedidos** del cliente
3. **Wishlist/Favoritos**
4. **Detalles del producto** (modal o página dedicada)
5. **Reviews y calificaciones**
6. **Sistema de cupones/descuentos**
7. **Comparador de productos**

## 🧪 Testing

Para probar las nuevas funcionalidades:

1. Crear un usuario con rol "Cliente" en el sistema
2. Iniciar sesión con ese usuario
3. Verificar redirección automática a la tienda
4. Probar añadir productos al carrito
5. Modificar cantidades y eliminar productos
6. Verificar cálculos de precios

## 📞 Soporte

Para más información o reportar problemas, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Fecha**: Diciembre 2025  
**Sistema**: SmartSales365
