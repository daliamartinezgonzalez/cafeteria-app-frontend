
# Cafeteria App - Frontend

Aplicación web para consultar el menú de una cafetería de especialidad y administrar la información de sus bebidas y categorías.

El proyecto está desarrollado con React y JavaScript. Cuenta con una sección pública para visualizar el catálogo y una sección administrativa para los usuarios que inicien sesión y tengan acceso autorizado.

## Tecnologías utilizadas

- React: desarrollo de interfaces mediante componentes.
- JavaScript: lógica y funcionamiento de la aplicación.
- Vite: herramienta para configurar y ejecutar el entorno de desarrollo.
- CSS: estilos y diseño adaptable.
- React Router: navegación entre páginas.
- Axios: comunicación con la API del backend.
- Zustand: manejo del estado de autenticación.
- TanStack React Query: gestión de consultas y operaciones con la API.
- Zod y React Hook Form: validación y manejo de formularios.
- Lucide React: iconos de la interfaz.

## Características

### Sección pública

- Visualización del menú de bebidas.
- Organización del catálogo por categorías.
- Consulta de información de las bebidas.

### Sección administrativa

- Inicio de sesión de usuarios.
- Navegación entre las secciones administrativas.
- Acceso a las páginas protegidas mediante autenticación.
- Preparación del control de acceso según los permisos del usuario.
- Gestión del catálogo de bebidas y categorías en desarrollo.

La estructura está organizada por funcionalidades para mantener separados los componentes, páginas, servicios y lógica de cada sección. También se cuenta con componentes compartidos para reutilizar elementos de la interfaz.

## Requisitos previos

- Node.js.
- pnpm.
- Git.
- Backend de Cafeteria App en funcionamiento.

## Instalación y ejecución

### 1. Clonar el repositorio

### 2. Ingresar a la carpeta del proyecto

### 3. Instalar las dependencias

### 4. Configurar las variables de entorno

### 5. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

## Comunicación con el backend

El frontend utiliza Axios para realizar solicitudes HTTP a la API desarrollada con FastAPI.

La dirección del backend se configura mediante la variable de entorno `VITE_API_URL`.

Para las solicitudes que requieren autenticación se utiliza el token JWT obtenido al iniciar sesión, el cual se envía en el encabezado de autorización.

## Navegación y autenticación

Se utiliza React Router para organizar las rutas de la aplicación y separar las secciones públicas de las administrativas.

Las rutas protegidas verifican que el usuario haya iniciado sesión antes de permitir el acceso.

El estado de autenticación se gestiona mediante Zustand y se utiliza almacenamiento persistente para conservar la sesión.

## Diseño de interfaz

Se estableció una paleta de colores basada en la temática de una cafetería de especialidad:

- Café: `#8B4F2A`
- Durazno: `#FFDCC5`
- Salvia: `#D5E8C6`
- Azul hielo: `#C9E6F2`
- Espresso: `#211A15`

Se busca mantener una interfaz sencilla, organizada y adaptable a diferentes tamaños de pantalla.

## Control de versiones

El desarrollo se administra mediante Git y GitHub, utilizando commits descriptivos para identificar las funcionalidades implementadas y los cambios realizados.

## Autor

Dalia Eunice Martínez González
