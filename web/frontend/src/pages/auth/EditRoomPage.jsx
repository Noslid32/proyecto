import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditRoomPage() {
  const { id } = useParams(); // Gets the Room ID from the URL
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // FETCH THE EXISTING DATA WHEN THE PAGE LOADS
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const data = await response.json();
        
        // Fill the inputs with the database data!
        setRoomName(data.style || '');
        setLocation(data.location || '');
        setPrice(data.price || '');
        setArea(data.area || '');
        setAiDescription(data.aiDescription || '');
        setImageUrls(data.imageUrls || []);
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [id]);

  // SAVE THE MODIFIED DATA
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: roomName,
          location: location,
          price: price,
          area: area,
          aiDescription: aiDescription,
          imageUrls: imageUrls
        })
      });

      if (response.ok) {
        alert("¡Anuncio actualizado con éxito!");
        navigate('/my-room');
      } else {
        alert("Error al guardar los cambios.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando datos del anuncio...</div>;

  return (
    <div style={{ backgroundColor: '#1e88e5', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '32px', color: 'black', marginBottom: '20px' }}>Editar Anuncio</h2>

      <div style={{ backgroundColor: '#a3a5c3', border: '3px solid black', borderRadius: '15px', padding: '30px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '4px 4px 10px rgba(0,0,0,0.3)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>Nombre del Anuncio:</label>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} style={{ padding: '10px', fontSize: '16px', border: '2px solid black', borderRadius: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>Ubicación:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: '10px', fontSize: '16px', border: '2px solid black', borderRadius: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>Precio:</label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} style={{ padding: '10px', fontSize: '16px', border: '2px solid black', borderRadius: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>Área:</label>
          <input type="text" value={area} onChange={(e) => setArea(e.target.value)} style={{ padding: '10px', fontSize: '16px', border: '2px solid black', borderRadius: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>Descripción (IA):</label>
          <textarea value={aiDescription} onChange={(e) => setAiDescription(e.target.value)} rows="5" style={{ padding: '10px', fontSize: '14px', border: '2px solid black', borderRadius: '8px', resize: 'vertical' }} />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={() => navigate('/my-room')} style={{ flex: 1, backgroundColor: 'white', color: 'black', border: '2px solid black', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button onClick={handleSaveChanges} disabled={isSaving} style={{ flex: 1, backgroundColor: '#4caf50', color: 'black', border: '2px solid black', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

      </div>
    </div>
  );
}