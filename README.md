# Sistema de Gestión de Viajes de Camiones Cisterna

Un sistema completo de gestión para el despacho y seguimiento de viajes de camiones cisterna para distribución de combustibles.

## 🚀 Características

### Autenticación
- Sistema de login con JWT
- Protección de rutas frontend y backend
- Sesiones persistentes con cookies

### Backend API
- CRUD completo para viajes
- Validaciones de negocio (máximo 30,000 litros, fechas futuras)
- Filtros y ordenamiento
- Paginación
- Estadísticas para dashboard

### Frontend Dashboard
- Tabla interactiva con filtros y ordenamiento
- Modal para crear/editar viajes
- Estadísticas en tiempo real
- Diseño responsive con Tailwind CSS
- Notificaciones toast

## 🛠️ Stack Tecnológico

- **Frontend**: React 18, Tailwind CSS, React Router, React Hook Form
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Infraestructura**: Docker, Docker Compose
- **Validación**: Express Validator
- **UI/UX**: Lucide React Icons, React Hot Toast

## 📋 Requisitos Previos

- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- Git

## 🚀 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd truck-management-system
```

2. **Ejecutar con Docker Compose**
```bash
docker-compose up --build
```

3. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- MongoDB: localhost:27017

### Opción 2: Desarrollo Local

1. **Backend**
```bash
cd backend
npm install
npm run dev
```

2. **Frontend**
```bash
cd frontend
npm install
npm start
```

3. **MongoDB**
```bash
# Instalar y ejecutar MongoDB localmente
# O usar MongoDB Atlas (cloud)
```

## 🔐 Credenciales de Prueba

Para probar el sistema, puedes crear un usuario o usar estas credenciales de demostración:

- **Email**: admin@demo.com
- **Contraseña**: 123456

## 📊 Estructura del Proyecto

```
truck-management-system/
├── backend/
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middleware de autenticación
│   └── server.js        # Servidor principal
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── contexts/    # Context API (Auth)
│   │   └── App.js       # Componente principal
│   └── public/
├── docker-compose.yml   # Configuración Docker
└── README.md
```

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Obtener usuario actual

### Viajes
- `GET /api/viajes` - Listar viajes (con filtros y paginación)
- `POST /api/viajes` - Crear nuevo viaje
- `PUT /api/viajes/:id` - Actualizar viaje
- `DELETE /api/viajes/:id` - Cancelar viaje (eliminación lógica)
- `GET /api/viajes/stats/dashboard` - Estadísticas

### Parámetros de Consulta (GET /api/viajes)
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10, max: 100)
- `estado`: Filtrar por estado
- `combustible`: Filtrar por tipo de combustible
- `conductor`: Buscar por nombre de conductor
- `sortBy`: Campo para ordenar (fecha_salida, conductor, etc.)
- `sortOrder`: Orden (asc/desc)

## 📝 Modelo de Datos

### Viaje
```json
{
  "id": "UUID",
  "camion": "ABC123",
  "conductor": "Juan Pérez",
  "origen": "Planta X",
  "destino": "Estación Y",
  "combustible": "Diésel",
  "cantidad_litros": 15000,
  "fecha_salida": "2025-05-10T14:30:00Z",
  "estado": "En tránsito",
  "observaciones": "Texto opcional",
  "creado_por": "ObjectId del usuario",
  "createdAt": "2025-01-26T...",
  "updatedAt": "2025-01-26T..."
}
```

### Estados Válidos
- `Programado`: Viaje planificado
- `En tránsito`: Viaje en curso
- `Entregado`: Viaje completado
- `Cancelado`: Viaje cancelado

### Tipos de Combustible
- Diésel
- Nafta Super
- Nafta Premium
- GNC (Gas Natural Comprimido)
- GLP (Gas Licuado de Petróleo)

## 🔒 Validaciones de Negocio

### Backend
- Máximo 30,000 litros por viaje
- Fecha de salida no puede ser en el pasado
- Patente de camión formato alfanumérico (6-8 caracteres)
- Campos requeridos validados
- Tipos de combustible y estados restringidos

### Frontend
- Validación en tiempo real con React Hook Form
- Feedback visual de errores
- Confirmación para acciones destructivas

## 🎨 Características de UI/UX

- **Responsive Design**: Funciona en desktop, tablet y móvil
- **Filtros Avanzados**: Por estado, combustible, conductor
- **Ordenamiento**: Por fecha, conductor, cantidad, etc.
- **Paginación**: Navegación eficiente de grandes datasets
- **Notificaciones**: Feedback inmediato de acciones
- **Estados Visuales**: Badges de colores para estados
- **Loading States**: Indicadores de carga
- **Confirmaciones**: Para acciones críticas

## 🔧 Variables de Entorno

### Backend (.env)
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://admin:password123@mongodb:27017/truck_management?authSource=admin
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Mejoras Futuras

- [ ] Implementación de Typescript
- [ ] Mejoras mobile
- [ ] Reportes y analytics avanzados
- [ ] Gestión de usuarios
- [ ] Add tanstack react-router and react-query
- [ ] Sistema de roles más granular
- [ ] Logs de auditoría

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🙏 Agradecimientos

- React Team por el excelente framework
- Tailwind CSS por el sistema de diseño
- MongoDB por la base de datos flexible
- Docker por la containerización

---

**Desarrollado con ❤️ para la gestión eficiente de flotas de camiones cisterna**
