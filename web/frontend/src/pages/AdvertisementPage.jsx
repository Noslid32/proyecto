import { useState } from 'react';
import { getAuth } from 'firebase/auth'; 
import { storage } from '../lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
 
export default function AdvertisementPage() {
  const [roomName, setRoomName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false); 

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // SEND THE IMAGE TO GEMINI TO SEE
  const handleAiAnalysis = async () => {
    if (imageFiles.length === 0) {
      alert("¡Sube al menos una foto de la habitación para que la IA la vea!");
      return;
    }

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFiles[0]);
      
      reader.onloadend = async () => {
        const base64Image = reader.result;

        const response = await fetch('http://localhost:5000/api/test-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            imageBase64: base64Image,
            style: roomName || "Estilo moderno",
            location: location || "Ubicación ideal",
            area: area || "Espacio optimizado"
          })
        });
        
        const data = await response.json();
        setAiDescription(data.aiText);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error("Error al conectar con la IA:", error);
      alert("Hubo un error al contactar al Chef (Backend).");
      setIsAnalyzing(false);
    }
  };

  const handlePublish = async () => {
    if (imageFiles.length === 0) {
      alert("¡Por favor sube al menos una foto de la habitación primero!");
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser; 

    if (!currentUser){ 
      alert("¡Debes iniciar sesión para poder publicar una habitacion!");
      return;
    }

    setIsPublishing(true);

    try {
      console.log("Subiendo imágenes a Firebase...");
      const uploadPromises = imageFiles.map(async (file) => {
        const storageRef = ref(storage, `rooms/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      });

      const currentPhotoURLs = await Promise.all(uploadPromises);
      console.log("Guardando en la base de datos...");
      const response = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrls: currentPhotoURLs,
          aiDescription: aiDescription,
          style: roomName || "Sin estilo", 
          location: location || "Sin ubicación",
          price: price || "Precio no especificado",
          area: area || "Área no especificada",
          ownerId: currentUser.uid
        })
      });

      if (response.ok) {
        alert("¡Habitación publicada con éxito en tu base de datos!");
        setRoomName('');
        setLocation('');
        setPrice('');
        setArea('');
        setAiDescription('');
        setImageFiles([]);
      } else {
        alert("Error al guardar en la base de datos.");
      }

    } catch (error) {
      console.error("Error publicando:", error);
      alert("Hubo un error en el proceso.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#1e88e5', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '32px', color: 'black', marginBottom: '20px' }}>
        Publicar Habitación
      </h2>

      <div style={{ backgroundColor: '#a3a5c3', border: '3px solid black', borderRadius: '15px', padding: '30px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '4px 4px 10px rgba(0,0,0,0.3)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Nombre del Anuncio:</label>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} style={{ padding: '10px', fontSize: '16px', border: '2px solid black', borderRadius: '8px', width: '95%' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Ubicación:</label>
          <input type="text" placeholder="Ej. Calle X, Zona Y" value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: '10px', fontSize: '16px', border: '2px solid black', borderRadius: '8px', width: '95%' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Precio:</label>
          <input type="text" placeholder="Ej. Q1,500 / mes" value={price} onChange={(e) => setPrice(e.target.value)} style={{ padding: '10px', fontSize: '16px', border: '2px solid black', borderRadius: '8px', width: '95%' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Área:</label>
          <input type="text" placeholder="Ej. 25 metros cuadrados" value={area} onChange={(e) => setArea(e.target.value)} style={{ padding: '10px', fontSize: '16px', border: '2px solid black', borderRadius: '8px', width: '95%' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Fotos de la Habitación:</label>
          
          {/* NOTICE THE 'multiple' ATTRIBUTE HERE */}
          <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ padding: '10px', backgroundColor: 'white', border: '2px solid black', borderRadius: '8px' }} />

          {/* IMAGE PREVIEWS GRID */}
          {imageFiles.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px', padding: '10px', backgroundColor: '#e0e0e0', borderRadius: '8px', border: '2px solid black' }}>
              {imageFiles.map((file, index) => (
                <div key={index} style={{ position: 'relative', width: '70px', height: '70px', border: '2px solid black', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => removeImage(index)} style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', padding: '2px 5px', fontWeight: 'bold' }}>X</button>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleAiAnalysis} disabled={isAnalyzing} style={{ backgroundColor: isAnalyzing ? '#888' : '#00e5ff', color: 'black', border: '2px solid black', borderRadius: '8px', padding: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            {isAnalyzing ? "🧠 Leyendo imagen..." : "✨ Generar Descripción con IA"}
          </button>

          {aiDescription && (
            <textarea value={aiDescription} onChange={(e) => setAiDescription(e.target.value)} rows="4" style={{ backgroundColor: 'white', padding: '15px', border: '2px solid black', borderRadius: '8px', marginTop: '5px', fontStyle: 'italic', fontSize: '14px', width: '100%', resize: 'vertical' }} />
          )}
        </div>

        <button onClick={handlePublish} disabled={isPublishing} style={{ backgroundColor: isPublishing ? '#888' : '#1e88e5', color: 'black', border: '3px solid black', borderRadius: '10px', padding: '12px 20px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxShadow: '2px 2px 0px black', marginTop: '10px' }}>
          {isPublishing ? "Subiendo..." : "Publicar Anuncio"}
        </button>
        
      </div>
    </div>
  );
}