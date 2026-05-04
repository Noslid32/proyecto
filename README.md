# 🏠✨ RoomIA - Smart Room Finding

RoomIA es una plataforma integral (Web + Mobile) que revoluciona la forma en que los propietarios anuncian sus habitaciones y los inquilinos encuentran su próximo hogar, potenciada por Inteligencia Artificial y geolocalización precisa.

## 🚀 Características Principales

* **🧠 Descripciones IA:** Integración con Gemini para generar descripciones atractivas automáticamente a partir de datos básicos.
* **🗺️ Mapa Interactivo:** Exploración de habitaciones en tiempo real usando OpenStreetMap (OSMDroid) nativo en Android.
* **📊 Analíticas en Tiempo Real:** Seguimiento atómico de vistas, compartidos y clics de contacto por habitación.
* **☁️ Cloud Storage:** Gestión de imágenes de alta calidad alojadas en Firebase.

## 🛠️ Arquitectura y Tecnologías

### Frontend (Web - Propietarios)
* **React.js** + Vite
* Integración con Firebase Auth & Storage
* Fetch API para comunicación con el backend
* Navegacion con Router para las diferentes paginas

### Mobile (Android - Inquilinos)
* **Kotlin** + **Jetpack Compose** (UI Moderna)
* **OSMDroid** para mapas open-source sin dependencias estrictas de Google.
* **Coil** para carga asíncrona de imágenes de red.
* **OkHttp + Coroutines** para peticiones HTTP eficientes.

### Backend & Base de Datos
* **Node.js + Express**
* **CRUD** usar metodos HTTP para decirle al servidor que se realizara.
* **Prisma ORM** para consultas seguras y operaciones atómicas (manejo de concurrencia en interacciones).
* **Gemini Service** para el procesamiento de IA.
* **Postgres** para el almacenamiento de datos.

## 🔮 Trabajo Futuro
* Implementación de chat en tiempo real entre inquilino y propietario.
* Filtros avanzados en el mapa (rango de precio, distancia, m²).
* Una mejor interracion con la tarjeta de cada habitacion.
* Implementar un croquis para mejor visualizacion de cada habitacion.

## Video Demostracion
[Ver video en Google Drive](https://drive.google.com/drive/folders/1Zva-_8EWNWgqEVCXL9q7QKU7fKHJiMB8?usp=sharing)

