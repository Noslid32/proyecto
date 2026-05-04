import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditRoomPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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
    borderRadius: '12px', backgroundColor: '#f8f9fb', outline: 'none', boxSizing: 'border-box', color: colors.textDark
  };
  const labelStyle = { fontWeight: '600', fontSize: '14px', color: colors.textDark, display: 'block', marginBottom: '8px' };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const data = await response.json();
        
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

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        style: roomName,
        location: location,
        price: price,
        area: area,
        aiDescription: aiDescription
      };

      await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      alert("¡Cambios guardados correctamente!");
      navigate('/my-room');
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al actualizar.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: colors.background, color: colors.blue }}>
      Cargando datos de la propiedad...
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '40px 20px', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: colors.cardBg, borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}` }}>
        
        <h2 style={{ fontWeight: '800', fontSize: '28px', color: colors.blue, margin: '0 0 5px 0' }}>Editar Propiedad</h2>
        <p style={{ color: colors.textLight, fontSize: '15px', marginBottom: '30px', marginTop: 0 }}>Actualiza la información de tu anuncio.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Título / Estilo</label>
              <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Ubicación</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Precio (Quetzales)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Área (m²)</label>
              <input type="text" value={area} onChange={(e) => setArea(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Descripción de la propiedad</label>
            <textarea value={aiDescription} onChange={(e) => setAiDescription(e.target.value)} rows="5" style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button onClick={() => navigate('/my-room')} style={{ flex: 1, backgroundColor: 'transparent', color: colors.textLight, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
              Cancelar
            </button>
            <button onClick={handleSaveChanges} disabled={isSaving} style={{ flex: 1, backgroundColor: colors.mint, color: colors.textDark, border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(32, 220, 163, 0.3)', transition: 'transform 0.2s' }}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}