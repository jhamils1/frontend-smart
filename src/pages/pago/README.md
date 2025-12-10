# Módulo de Pagos con Stripe

## Descripción

Este módulo implementa un sistema de pagos integrado con Stripe para procesar las compras del carrito de compras. Permite a los usuarios confirmar su carrito y proceder al pago de forma segura.

## Archivos Creados

### 1. API - `pagoapi.jsx`
Contiene todas las funciones para interactuar con el backend de pagos:
- `createPaymentIntent()` - Crea una intención de pago con Stripe
- `confirmPayment()` - Confirma el pago
- `getPagos()` - Obtiene todos los pagos
- `getPagoById()` - Obtiene un pago específico
- `createPago()` - Crea un pago manualmente
- `updatePago()` - Actualiza un pago
- `deletePago()` - Elimina un pago

### 2. Páginas

#### `pagoPage.jsx`
Página principal de pago que:
- Recibe la información del carrito desde la navegación
- Muestra un resumen del pedido
- Inicializa el proceso de pago con Stripe
- Contiene el formulario de pago
- Maneja errores y estados de carga
- Redirige al usuario después del pago exitoso

#### `checkoutForm.jsx`
Formulario de checkout que incluye:
- Campos para información de tarjeta (número, expiración, CVC, nombre)
- Validación de datos de tarjeta
- Formato automático de número de tarjeta
- Iconos de tarjetas de crédito
- Información de tarjetas de prueba
- Indicador de procesamiento
- Manejo de errores
- Diseño responsive y accesible

#### `pagoList.jsx`
Lista de historial de pagos con:
- Visualización de todos los pagos realizados
- Búsqueda y filtrado
- Estados de pago (pendiente, completado, fallido, reembolsado)
- Métodos de pago (tarjeta, efectivo, transferencia)
- Información de factura asociada

### 3. Modificaciones en Archivos Existentes

#### `detalleCarritoManager.jsx`
Se agregó:
- Import de `useNavigate` de react-router-dom
- Función `handleConfirmarPedido()` que valida el carrito y redirige al pago
- Botón "Confirmar Pedido y Proceder al Pago"

#### `AppRouter.jsx`
Se agregó:
- Import de `PagoPage`
- Ruta protegida `/pago` para la página de pagos

## Flujo de Trabajo

### 1. Usuario en el Carrito
1. El usuario agrega productos al carrito
2. Revisa los detalles en `DetalleCarritoManager`
3. Verifica el total y cantidad de items

### 2. Confirmación del Pedido
1. Click en "Confirmar Pedido y Proceder al Pago"
2. Se valida que el carrito tenga productos
3. Se valida que el total sea mayor a 0
4. Se redirige a `/pago` con la información del carrito

### 3. Proceso de Pago
1. La `PagoPage` recibe los datos del carrito
2. Se muestra un resumen del pedido
3. Se crea un Payment Intent en Stripe
4. El usuario completa el formulario de pago
5. Se procesa el pago
6. Se redirige al carrito con mensaje de éxito

### 4. Estados del Pago
- **Cargando**: Mientras se inicializa el pago
- **Error**: Si hay problemas al crear el payment intent
- **Formulario**: Listo para que el usuario ingrese datos
- **Procesando**: Mientras se procesa el pago
- **Éxito**: Pago completado exitosamente

## Características de Seguridad

### Validaciones del Formulario
- Número de tarjeta de 16 dígitos
- Fecha de expiración válida y no vencida
- CVC de 3-4 dígitos
- Nombre del titular requerido

### Formateo Automático
- Número de tarjeta con espacios cada 4 dígitos
- Fecha de expiración en formato MM/YY
- Solo números en campos numéricos

### Seguridad
- Encriptación SSL de 256 bits
- Integración con Stripe para procesar pagos
- No se almacenan datos sensibles en el frontend

## Tarjetas de Prueba

Para testing, se pueden usar estas tarjetas:

```
Tarjeta de Éxito:
Número: 4242 4242 4242 4242
Fecha: Cualquier fecha futura (ej: 12/25)
CVC: Cualquier 3 dígitos (ej: 123)

Tarjeta Rechazada:
Número: 4000 0000 0000 0002
Fecha: Cualquier fecha futura
CVC: Cualquier 3 dígitos
```

## Diseño y UX

### Componentes Visuales
- **Badges de estado**: Colores distintivos para cada estado
- **Iconos**: Visuales para métodos de pago y acciones
- **Loading spinners**: Indicadores de carga
- **Alerts**: Mensajes de error y éxito
- **Responsive**: Adaptado a diferentes tamaños de pantalla

### Colores
- **Indigo**: Acciones principales y totales
- **Verde**: Éxito y completado
- **Amarillo**: Advertencias y pendiente
- **Rojo**: Errores y fallidos
- **Azul**: Información y alternativas

## Integración con Backend

El módulo espera los siguientes endpoints en el backend:

```javascript
POST /api/pagos/create-payment-intent/
Body: { carrito_id: number }
Response: { clientSecret: string }

POST /api/pagos/confirm-payment/
Body: { 
  payment_intent_id: string, 
  payment_method_id: string 
}
Response: { success: boolean, pago_id: number }

GET /api/pagos/
Response: Array de objetos Pago

GET /api/pagos/:id/
Response: Objeto Pago

POST /api/pagos/
Body: Objeto Pago
Response: Objeto Pago creado

PUT /api/pagos/:id/
Body: Objeto Pago
Response: Objeto Pago actualizado

DELETE /api/pagos/:id/
Response: { success: boolean }
```

## Instalación de Dependencias

Para que el módulo funcione correctamente, es necesario instalar las siguientes dependencias:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Configuración de Stripe

1. Crear una cuenta en [Stripe](https://stripe.com)
2. Obtener las claves API (Publishable Key y Secret Key)
3. Configurar las claves en el backend
4. Para desarrollo, usar las claves de prueba

## Próximos Pasos

### Mejoras Sugeridas
1. Integrar Stripe Elements real en lugar de formulario simulado
2. Agregar más métodos de pago (PayPal, transferencia bancaria)
3. Implementar webhooks de Stripe para confirmaciones asíncronas
4. Agregar sistema de reembolsos
5. Implementar guardado de métodos de pago
6. Agregar recibos por email
7. Implementar sistema de cupones/descuentos

### Funcionalidades Adicionales
1. Historial detallado de transacciones
2. Exportación de reportes de pagos
3. Gráficos de análisis de ventas
4. Integración con sistema de facturación
5. Notificaciones en tiempo real
6. Multi-moneda

## Notas Técnicas

- El formulario actual es una simulación. En producción, se debe integrar Stripe Elements.
- Los estados de pago se sincronizan con el backend.
- Se utiliza navegación con `state` para pasar datos entre componentes.
- El diseño es responsive y sigue los patrones del resto de la aplicación.
- Se incluyen validaciones tanto en frontend como backend.

## Soporte

Para problemas o dudas sobre el módulo de pagos, revisar:
1. La documentación de Stripe: https://stripe.com/docs
2. Los logs del navegador para errores de frontend
3. Los logs del servidor para errores de backend
4. La consola de Stripe para revisar transacciones

