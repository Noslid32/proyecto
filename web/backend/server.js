const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 
const app = express();
const { generateRoomDescription, generateCoachAdvice, semanticSearchRooms } = require('./services/GeminiService');
const { parse } = require('dotenv');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.send('¡Hola! El servidor de RoomIA está funcionando perfectamente. 🚀');
});

// Get Methods
app.get('/api/test', (req, res) => {
  res.json({ message: "Mensaje secreto desde el backend de RoomIA!" });
});

app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(rooms);
  } catch (error) {
    console.error("Error obteniendo habitaciones:", error);
    res.status(500).json({ error: "No se pudieron obtener las habitaciones" });
  }
});

app.get('/api/rooms/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const rooms = await prisma.room.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(rooms);
  } catch (error) {
    console.error("Error buscando habitaciones:", error);
    res.status(500).json({ error: "No se pudieron cargar las habitaciones" });
  }
});

app.get('/api/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ error: "No encontrada" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar habitación" });
  }
});

app.get('/api/users/:userId/stats', async (req, res) => {
  const { userId } = req.params;
  try {
    const rooms = await prisma.room.findMany({
      where: { ownerId: userId },
      orderBy: { viewsCount: 'desc' } 
    });

    const totalViews = rooms.reduce((sum, room) => sum + room.viewsCount, 0);
    const totalContacts = rooms.reduce((sum, room) => sum + room.contactsCount, 0);
    const totalShares = rooms.reduce((sum, room) => sum + room.sharesCount, 0);
    const topRoom = rooms.length > 0 ? rooms[0] : null;

    res.json({
      totalRooms: rooms.length,
      totalViews,
      totalContacts,
      totalShares,
      topRoom,
      allRooms: rooms
    });
  } catch (error) {
    console.error("Error cargando estadísticas:", error);
    res.status(500).json({ error: "Error al calcular las estadísticas" });
  }
});

app.get('/api/users/:userId/coach', async (req, res) => {
  const { userId } = req.params;
  const { roomId } = req.query;

  try {
    const rooms = await prisma.room.findMany({
      where: { ownerId: userId },
      orderBy: { viewsCount: 'desc' }
    });

    const totalViews = rooms.reduce((sum, room) => sum + room.viewsCount, 0);
    const totalContacts = rooms.reduce((sum, room) => sum + room.contactsCount, 0);
    const totalShares = rooms.reduce((sum, room) => sum + room.sharesCount, 0);

    let topRoom = rooms.length > 0 ? rooms[0] : null;
    if (roomId) {
      topRoom = rooms.find(r => r.id === roomId) || topRoom;
    }
    
    const topRoomName = topRoom ? topRoom.style || "Habitación" : "Ninguna";
    const topRoomLocation = topRoom ? topRoom.location || "Desconocida" : "N/A";
    const topRoomPrice = topRoom ? topRoom.price || "No especificado" : "N/A";

    const advice = await generateCoachAdvice(
      totalViews, 
      totalContacts, 
      totalShares, 
      topRoomName, 
      topRoomLocation, 
      topRoomPrice
    );

    res.json({ advice });
  } catch (error) {
    console.error("Error consultando al Coach:", error);
    res.status(500).json({ error: "No se pudo obtener el consejo" });
  }
});

// Post Methods
app.post('/api/rooms', async (req, res) => {
  const { imageUrls, aiDescription, style, location, price, latitude, longitude, area, ownerId, isPublished } = req.body;
  try {

    if (!imageUrls || !ownerId) {
      return res.status(400).json({ error: "Falta la imagen o el ID del dueño" });
    }

    const newRoom = await prisma.room.create({
      data: {
        imageUrls: imageUrls,
        aiDescription: aiDescription,
        style: style,
        location: location,
        price: price || 0,
        area: area || 0,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        ownerId: ownerId, 
        isPublished: isPublished !== undefined ? isPublished : true
      }
    });
    
    res.json({ message: "¡Habitación guardada con éxito en la base de datos!", room: newRoom });
    
  } catch (error) {
    console.error("Error guardando la habitación:", error);
    res.status(500).json({ error: "Hubo un error al guardar la habitación" });
  }
});

app.post('/api/test-ai', async (req, res) => {
  try {
    const { imageBase64, style, location, area } = req.body; 
    const description = await generateRoomDescription(style, area, location, imageBase64);
    
    res.json({ 
      message: "¡Gemini funcionó!", 
      aiText: description 
    });
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ error: "Falló la IA al leer la imagen" });
  }
});

app.post('/api/users', async (req, res) => {
  const { uid, email, name } = req.body;

  try {
    const user = await prisma.user.upsert({
      where: { id: uid },
      update: {}, 
      create: {
        id: uid,
        email: email,
        name: name || "Usuario RoomIA"
      }
    });

    res.status(200).json({ message: "Usuario sincronizado con éxito", user });
  } catch (error) {
    console.error("Error guardando usuario:", error);
    res.status(500).json({ error: "No se pudo guardar el usuario en la base de datos" });
  }
});

app.post('/api/rooms/:roomId/interact', async (req, res) => {
  const { shares, contacts, viewsCount} = req.body;
  const { roomId } = req.params;

  try {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ error: "Habitación no encontrada" });
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: { sharesCount: room.sharesCount + shares, contactsCount: room.contactsCount + contacts, viewsCount: room.viewsCount + viewsCount }
    });

    res.json(updatedRoom);
  } catch (error) {
    console.error("Error al interactuar con la habitación:", error);
    res.status(500).json({ error: "Error al actualizar la habitación" });
  }
});

app.post('/api/rooms/search', async (req, res) => {
  const { userQuery } = req.body;

  try {
    // 1. Traemos los cuartos de la base de datos
    const rooms = await prisma.room.findMany({ where: { isPublished: true } });

    // 2. Preparamos los datos resumidos para la IA
    const roomsData = rooms.map(r => ({
      id: r.id,
      style: r.style,
      description: r.aiDescription,
      price: r.price
    }));

    // 3. ¡Llamamos a tu servicio experto! (Todo el prompt está oculto y limpio)
    const matchedIds = await semanticSearchRooms(userQuery, roomsData);

    // 4. Filtramos y devolvemos la respuesta
    const matchedRooms = rooms.filter(room => matchedIds.includes(room.id));
    res.json(matchedRooms);

  } catch (error) {
    console.error("Error en la ruta de búsqueda IA:", error);
    res.status(500).json({ error: "Error realizando la búsqueda semántica" });
  }
});

// Delete Methods
app.delete('/api/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;  
  try {
    await prisma.room.delete({
      where: { id: roomId }
    });
    res.json({ message: "¡Habitación eliminada correctamente!" });
  } catch (error) {
    console.error("Error al eliminar la habitación:", error);
    res.status(500).json({ error: "No se pudo eliminar la habitación" });
  }
});

// Put Methods
app.put('/api/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const { imageUrls, aiDescription, style, location, price, latitude, longitude, area } = req.body;
  try {
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: { imageUrls, aiDescription, style, location, price, latitude, longitude, area }
    });
    res.json(updatedRoom);
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ error: "Error al actualizar la habitación" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listo en el puerto ${PORT}`);
});