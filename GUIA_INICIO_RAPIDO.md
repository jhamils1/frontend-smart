# 🚀 Guía de Inicio Rápido - Tienda Cliente

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener:
- ✅ Backend Django corriendo en `http://localhost:8000`
- ✅ Base de datos configurada y migraciones aplicadas
- ✅ Node.js instalado (v16 o superior)
- ✅ npm o yarn instalado

---

## 🔧 Instalación

### 1. Backend (si aún no está configurado)

```bash
cd backend-smart

# Activar entorno virtual
.\env\Scripts\Activate.ps1

# Instalar dependencias (si es necesario)
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (si no existe)
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### 2. Frontend

```bash
cd frontend-smart

# Instalar dependencias (si es necesario)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend debería abrirse en `http://localhost:5173`

---

## 👤 Crear Usuario Cliente

Existen dos formas de crear un usuario cliente:

### Opción 1: Desde el Admin de Django

1. Ir a `http://localhost:8000/admin`
2. Login con superusuario
3. Ir a **Perfiles → Clientes**
4. Click en **Agregar Cliente**
5. Llenar los datos:
   - Nombre: Juan
   - Apellido: Pérez
   - Sexo: M
   - Usuario: (Crear nuevo usuario con rol Cliente)

### Opción 2: Desde Django Shell

```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User, Group
from perfiles.models import Cliente

# Crear grupo Cliente si no existe
grupo_cliente, _ = Group.objects.get_or_create(name='Cliente')

# Crear usuario
user = User.objects.create_user(
    username='cliente1',
    email='cliente1@example.com',
    password='password123',
    first_name='Juan',
    last_name='Pérez'
)

# Asignar al grupo Cliente
user.groups.add(grupo_cliente)

# Crear perfil de cliente
cliente = Cliente.objects.create(
    usuario=user,
    nombre='Juan',
    apellido='Pérez',
    ci='12345678',
    sexo='M',
    telefono='70000000',
    direccion='Av. Ejemplo #123',
    estado='activo'
)

print(f"✅ Cliente creado: {cliente.nombre} {cliente.apellido}")
print(f"✅ Usuario: {user.username}")
print(f"✅ Contraseña: password123")
```

### Opción 3: Desde el Registro del Frontend

1. Ir a `http://localhost:5173/register`
2. Llenar el formulario de registro
3. Seleccionar rol "Cliente"
4. Completar registro

---

## 🧪 Probar el Sistema

### 1. Login como Cliente

1. Ir a `http://localhost:5173/login`
2. Ingresar credenciales:
   - **Usuario:** `cliente1`
   - **Contraseña:** `password123`
3. Click en **Iniciar Sesión**

✅ **Deberías ser redirigido a** `/cliente/tienda`

### 2. Explorar la Tienda

- 🔍 **Buscar productos** usando la barra de búsqueda
- 🏷️ **Filtrar por categorías** clickeando en las categorías
- 👁️ **Ver detalles** de cada producto
- ➕ **Añadir al carrito** clickeando "Añadir"

### 3. Gestionar el Carrito

1. Click en el botón **🛒 Carrito** (arriba derecha)
2. Ver productos añadidos
3. Modificar cantidades con **[+]** y **[-]**
4. Eliminar productos con **🗑️**
5. Verificar el **Resumen de Compra**

### 4. Proceder al Checkout

1. Click en **Proceder al Pago**
2. Completar información de envío
3. Confirmar compra

---

## 🛠️ Verificar Productos en el Sistema

Si no hay productos en la tienda, crearlos desde:

### Opción 1: Admin de Django

1. Ir a `http://localhost:8000/admin`
2. **Inventario → Categorías** (crear algunas)
3. **Inventario → Productos** (crear productos)

### Opción 2: Script de importación

Si existe un script de importación:

```bash
python importar_csv_productos.py
```

### Opción 3: Crear manualmente desde el frontend

1. Login como admin: `http://localhost:5173/login`
2. Ir a `/productos/categoria` → Crear categorías
3. Ir a `/productos/producto` → Crear productos

---

## 🔍 Troubleshooting

### Problema: "Usuario sin perfil de cliente asociado"

**Solución:** Asegúrate de que el usuario tenga un perfil de Cliente asociado.

```python
from django.contrib.auth.models import User
from perfiles.models import Cliente

user = User.objects.get(username='cliente1')
if not hasattr(user, 'cliente'):
    Cliente.objects.create(
        usuario=user,
        nombre=user.first_name or 'Cliente',
        apellido=user.last_name or 'Test',
        sexo='M'
    )
```

### Problema: No se redirige a la tienda después del login

**Solución:** Verificar que el rol del usuario sea "Cliente":

```python
from django.contrib.auth.models import User

user = User.objects.get(username='cliente1')
print(f"Grupos: {[g.name for g in user.groups.all()]}")

# Si no está en el grupo Cliente
from django.contrib.auth.models import Group
grupo = Group.objects.get(name='Cliente')
user.groups.add(grupo)
```

### Problema: Error al crear carrito

**Solución:** Verificar que el endpoint `/api/me/` retorna el cliente_id:

```bash
# Obtener token
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"cliente1","password":"password123"}'

# Verificar /me/
curl http://localhost:8000/api/me/ \
  -H "Authorization: Bearer {tu_token_aquí}"
```

Debería retornar algo como:
```json
{
  "id": 1,
  "username": "cliente1",
  "role": "Cliente",
  "cliente": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

---

## 📊 Verificar que Todo Funciona

### Checklist de Funcionalidades

- [ ] Login como cliente redirige a `/cliente/tienda`
- [ ] Se muestran productos con imágenes
- [ ] Búsqueda filtra productos correctamente
- [ ] Categorías filtran productos
- [ ] Botón "Añadir" añade al carrito
- [ ] Notificación aparece al añadir
- [ ] Badge de carrito muestra cantidad correcta
- [ ] Click en carrito lleva a `/cliente/carrito`
- [ ] Se muestran productos en el carrito
- [ ] Botones +/- modifican cantidades
- [ ] Botón eliminar quita productos
- [ ] Subtotales y total calculan correctamente
- [ ] Botón "Proceder al Pago" funciona

---

## 🎨 Personalización

### Cambiar colores principales

Editar `src/pages/tienda/tiendaPage.jsx`:

```jsx
// Buscar clases de Tailwind y cambiar colores:
// bg-blue-600 → bg-purple-600
// text-blue-600 → text-purple-600
```

### Cambiar el logo

1. Agregar tu logo en `src/assets/logo-tienda.png`
2. Importar en `tiendaPage.jsx`:
```jsx
import logoTienda from "../../assets/logo-tienda.png";
```
3. Usar en el componente:
```jsx
<img src={logoTienda} alt="Logo" className="h-10" />
```

---

## 📚 Documentación Adicional

- **[README Principal](./TIENDA_CLIENTE_README.md)** - Documentación completa
- **[Resumen de Implementación](./IMPLEMENTACION_RESUMEN.md)** - Resumen visual

---

## 🆘 Soporte

Si encuentras problemas:

1. Verificar que el backend está corriendo
2. Verificar que el usuario tiene perfil de cliente
3. Revisar la consola del navegador (F12) para errores
4. Revisar la consola del backend para errores de API

---

## 🎉 ¡Listo!

Ahora deberías tener un sistema de tienda completamente funcional para clientes.

**Credenciales de prueba:**
- Usuario: `cliente1`
- Contraseña: `password123`

**URLs importantes:**
- Login: `http://localhost:5173/login`
- Tienda: `http://localhost:5173/cliente/tienda`
- Carrito: `http://localhost:5173/cliente/carrito`
- Admin Backend: `http://localhost:8000/admin`

---

**¡Disfruta tu nueva tienda en línea! 🛒✨**
