import { useState, useRef } from 'react';
import { getAuth } from 'firebase/auth'; 
import { storage } from '../lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
 
export default function AdvertisementPage() {
  const [roomName, setRoomName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  
  // Estados para OpenStreetMap
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const typingTimeoutRef = useRef(null); // Usamos useRef para evitar fallos de React con el tiempo
  
  // Estados para la IA y Publicación
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false); 

  const colors = {
    blue: '#2c5caa',
    mint: '#20dca3',
    background: '#eef1f6',
    cardBg: '#ffffff',
    textDark: '#2c3e50',
    textLight: '#64748b',
    border: '#e2e8f0'
  };

  const inputStyle = {
    width: '100%', padding: '14px', fontSize: '15px', border: `1px solid ${colors.border}`, 
    borderRadius: '12px', backgroundColor: '#f8f9fb', outline: 'none', boxSizing: 'border-box', color: colors.textDark,
    transition: 'border-color 0.2s'
  };
  const labelStyle = { fontWeight: '600', fontSize: '14px', color: colors.textDark, display: 'block', marginBottom: '8px' };

  // --- FUNCIONES DE IMÁGENES ---
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- FUNCIONES DE OPENSTREETMAP ---
  const handleLocationSearch = (query) => {
    setLocation(query);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (query.length < 3) {
      setSuggestions([]);
      setIsSearchingLocation(false);
      return;
    }

    setIsSearchingLocation(true);

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        // Agregamos User-Agent para que la API no nos bloquee por ser "anónimos"
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, {
          headers: {
            'User-Agent': 'RoomIA-App/1.0 (proyecto@roomia.com)',
            'Accept-Language': 'es'
          }
        });
        if (!response.ok) throw new Error("Error en la respuesta de la API");
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error buscando ubicación:", error);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 800);
  };

  const handleSelectLocation = (place) => {
    setLocation(place.display_name); 
    setLatitude(place.lat);          
    setLongitude(place.lon);         
    setSuggestions([]);              
  };
 
  // --- FUNCIÓN DE IA ---
  const handleAiAnalysis = async () => {
    if (imageFiles.length === 0) {
      alert("¡Sube al menos una foto de la propiedad para que la IA la vea!");
      return;
    }

    setIsAnalyzing(true);
    try {
      const file = imageFiles[0]; 
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        const base64data = reader.result; 

        const response = await fetch('http://localhost:5000/api/test-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            style: roomName || "Habitación",
            location: location || "Sin especificar",
            area: area || "No especificado",
            imageBase64: base64data 
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al comunicarse con la IA");
        }

        const data = await response.json();
        setAiDescription(data.aiText); 
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error("Detalle del error con la IA:", error);
      alert(`Hubo un problema con la IA: ${error.message}`);
      setIsAnalyzing(false);
    }
  };

  // --- FUNCIÓN DE PUBLICAR ---
  const handlePublish = async () => {
    if (!roomName || !location || !price || imageFiles.length === 0) {
      alert("Por favor llena todos los campos y sube al menos una foto.");
      return;
    }

    setIsPublishing(true);
    const auth = getAuth();
    
    try {
      const uploadedImageUrls = [];
      for (const file of imageFiles) {
        const imageRef = ref(storage, `rooms/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);
        uploadedImageUrls.push(url);
      }

      const roomData = {
        ownerId: auth.currentUser.uid,
        style: roomName,
        location: location,
        price: price,
        area: area,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        aiDescription: aiDescription,
        imageUrls: uploadedImageUrls,
        isPublished: true, // Mandamos explícitamente que SÍ está publicado
      };

      const response = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });

      if (!response.ok) {
         throw new Error("El servidor rechazó los datos (Revisa terminal del backend)");
      }

      alert("¡Propiedad publicada con éxito!");
      window.location.href = "/my-room";
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Hubo un error al publicar el anuncio: " + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '40px 20px', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: colors.cardBg, borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}` }}>
        
        <h2 style={{ fontWeight: '800', fontSize: '28px', color: colors.blue, margin: '0 0 5px 0' }}>Crear Nuevo Anuncio</h2>
        <p style={{ color: colors.textLight, fontSize: '15px', marginBottom: '30px', marginTop: 0 }}>Llena los detalles para atraer a los mejores inquilinos.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Título / Estilo del cuarto</label>
              <input type="text" placeholder="Ej. Habitación Moderna" value={roomName} onChange={(e) => setRoomName(e.target.value)} style={inputStyle} />
            </div>
            
            {/* UBICACIÓN CON AUTOCOMPLETADO ELEGANTE */}
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <label style={labelStyle}>Ubicación</label>
              <input 
                type="text" 
                placeholder="Ej. Zona 1, Ciudad de Guatemala" 
                value={location} 
                onChange={(e) => handleLocationSearch(e.target.value)} 
                style={inputStyle} 
              />
              {isSearchingLocation && (
                <span style={{ fontSize: '12px', color: colors.mint, position: 'absolute', right: '15px', top: '42px', fontWeight: 'bold' }}>Buscando...</span>
              )}
              
              {suggestions.length > 0 && (
                <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: `1px solid ${colors.border}`, borderRadius: '12px', zIndex: 100, listStyle: 'none', padding: '5px', margin: '5px 0 0 0', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxHeight: '220px', overflowY: 'auto' }}>
                  {suggestions.map((place) => (
                    <li 
                      key={place.place_id} 
                      onClick={() => handleSelectLocation(place)}
                      style={{ padding: '12px', cursor: 'pointer', borderRadius: '8px', fontSize: '14px', color: colors.textDark, transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.background}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      📍 <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Latitud</label>
              <input type="text" placeholder="Se llena automático" value={latitude} readOnly style={{ ...inputStyle, backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Longitud</label>
              <input type="text" placeholder="Se llena automático" value={longitude} readOnly style={{ ...inputStyle, backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Precio (Quetzales)</label>
              <input type="number" placeholder="Ej. 1500" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Área (m²)</label>
              <input type="text" placeholder="Ej. 20" value={area} onChange={(e) => setArea(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* FOTOS SECTION */}
          <div style={{ backgroundColor: '#f8f9fb', borderRadius: '16px', border: `2px dashed ${colors.mint}`, padding: '30px', textAlign: 'center', marginTop: '10px' }}>
            <label style={{ fontWeight: 'bold', color: colors.blue, cursor: 'pointer', fontSize: '16px', display: 'block' }}>
              📸 Sube las fotos de la propiedad
              <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>

          {imageFiles.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
              {imageFiles.map((file, index) => (
                <div key={index} style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => removeImage(index)} style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* AI SECTION */}
          <div style={{ backgroundColor: '#eef2ff', padding: '25px', borderRadius: '16px', border: `1px solid #dce4f7`, marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: aiDescription ? '15px' : '0', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ margin: 0, color: colors.blue, fontSize: '16px' }}>🤖 Descripción Inteligente</h4>
              </div>
              <button onClick={handleAiAnalysis} disabled={isAnalyzing} style={{ backgroundColor: isAnalyzing ? '#cbd5e1' : colors.mint, color: colors.textDark, border: 'none', borderRadius: '10px', padding: '10px 16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: isAnalyzing ? 'none' : '0 4px 15px rgba(32, 220, 163, 0.3)', transition: 'background-color 0.2s' }}>
                {isAnalyzing ? "🧠 Pensando..." : "✨ Generar con IA"}
              </button>
            </div>
            {aiDescription && (
              <textarea value={aiDescription} onChange={(e) => setAiDescription(e.target.value)} rows="5" style={{ ...inputStyle, backgroundColor: '#ffffff', border: `1px solid ${colors.blue}`, fontStyle: 'italic', resize: 'vertical' }} />
            )}
          </div>

          <button onClick={handlePublish} disabled={isPublishing} style={{ backgroundColor: isPublishing ? '#94a3b8' : colors.blue, color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', boxShadow: isPublishing ? 'none' : '0 4px 15px rgba(44, 92, 170, 0.3)', transition: 'transform 0.2s' }}>
            {isPublishing ? "Publicando en el servidor..." : "🚀 Publicar Anuncio"}
          </button>

        </div>
      </div>
    </div>
  );
}