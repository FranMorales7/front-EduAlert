# 🧠 EduAlert Frontend

Este es el **frontend** de la aplicación EduAlert, desarrollado en **Next.js** con un enfoque modular para facilitar el mantenimiento y la escalabilidad. El sistema permite gestionar y visualizar notificaciones educativas en tiempo real.

---

## 🛠️ Tecnologías utilizadas

- [Next.js](https://nextjs.org/) — React Framework
- [TailwindCSS](https://tailwindcss.com/) — Estilos CSS utilitarios
- [React Hot Toast](https://react-hot-toast.com/) — Notificaciones
- [Laravel Echo](https://laravel.com/docs/broadcasting) + [Pusher](https://pusher.com/) — Comunicación en tiempo real
- [Axios](https://axios-http.com/) — Cliente HTTP para la API backend
- [ESLint](https://eslint.org/) — Linter para código limpio y coherente

---

## 📁 Estructura del proyecto

```bash
FRONT-EDU/
├── .next/                   # Archivos generados por Next.js (build)
├── node_modules/            # Dependencias del proyecto
├── public/images/           # Recursos públicos como imágenes
├── src/
│   ├── api/                 # Endpoints de la API
│   ├── app/                 # Rutas y vistas de la aplicación
│   │   ├── logged/          # Vistas privadas (usuarios autenticados)
│   │   │   ├── manager/     # Panel de administrador
│   │   │   ├── teacher/     # Panel de profesor
│   │   ├── not_logged/      # Vistas públicas (login, recuperación)
│   │   │   ├── login/
│   │   │   ├── recovery_password/
│   │   ├── layout.js        # Layout general de la app
│   │   ├── loading.js       # Pantalla de carga
│   │   └── page.js          # Página principal
│   ├── components/          # Componentes reutilizables
│   │   ├── cards/           # Tarjetas visuales
│   │   ├── forms/           # Formularios
│   │   ├── graphics/        # Gráficos y visualizaciones
│   │   ├── lists/           # Listados
│   │   ├── notification/    # Notificaciones en tiempo real
│   │   ├── tables/          # Tablas de datos
│   │   └── ui/              # Elementos de interfaz (botones, inputs, etc.)
│   ├── hooks/               # Custom React Hooks
│   ├── lib/                 # Librerías internas (Echo, utils)
│   ├── requests/            # Funciones para llamadas HTTP
│   └── services/            # Lógica de negocio (ej: auth, usuarios)
├── .env.local               # Variables de entorno
├── .gitignore
├── components.json          # Configuración de componentes
├── eslint.config.mjs        # Configuración de ESLint
├── globals.css              # Estilos globales
├── jsconfig.json            # Alias de rutas y configuración JS
├── next.config.mjs          # Configuración de Next.js
├── package.json             # Dependencias y scripts
└── package-lock.json
```
---

## ⚙️ Instalación y uso

    # Clonar el repositorio
    git clone https://github.com/tu-usuario/front-edu.git
    cd front-edu

    # Instalar dependencias
    npm install

    # Ejecutar en entorno de desarrollo
    npm run dev
---

## 🌐 Variables de entorno
El archivo .env.local debe incluir
    **NEXT_PUBLIC_BACKEND_URL** =http://[back-end]/api
    **NEXT_PUBLIC_IMAGE_URL**=http://[back-end]/
    **NEXTAUTH_URL**=http://localhost:3000/
    **BROADCAST_CONNECTION**=pusher

---

## 👨‍💻 Autor
Nombre: Francisco Morales

Correo: lopezmoralesfrancisco18@gmail.com

Repositorio Backend: [Back-End/EduAlert](https://github.com/FranMorales7/api_EduAlert)

