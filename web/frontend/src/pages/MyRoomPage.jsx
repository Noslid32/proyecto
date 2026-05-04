import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase/config';
import { Link } from 'react-router-dom'; 

const colors = {
  blue: '#2c5caa',
  mint: '#20dca3',
  background: '#eef1f6',
  cardBg: '#ffffff',
  textDark: '#2c3e50',
  textLight: '#64748b',
  border: '#e2e8f0',
  danger: '#ef4444',
  warning: '#f59e0b'
};

const ImageCarousel = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: colors.textLight, backgroundColor: '#f1f5f9' }}>
        Sin Imagen
      </div>
    );
  }

  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img 
        src={imageUrls[currentIndex]} 
        alt="Habitación" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />

      {imageUrls.length > 1 && (
        <>
          <button 
            onClick={handlePrev} 
            style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.8)', color: colors.textDark, border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'white'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.8)'}
          >
            ❮
          </button>
          
          <button 
            onClick={handleNext} 
            style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.8)', color: colors.textDark, border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'white'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.8)'}
          >
            ❯
          </button>

          <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
            {imageUrls.map((_, idx) => (
              <div 
                key={idx} 
                style={{ 
                  width: idx === currentIndex ? '8px' : '6px', 
                  height: idx === currentIndex ? '8px' : '6px', 
                  borderRadius: '50%', 
                  backgroundColor: idx === currentIndex ? colors.mint : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s'
                }} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function MyRoomPage() {
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5000/api/rooms/user/${user.uid}`);
          const data = await response.json();
          setMyRooms(data);
        } catch (error) {
          console.error("Error al cargar habitaciones:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.");
    if (!confirmDelete) return;
    
    const roomToDelete = myRooms.find((room) => room.id === roomId);

    if (roomToDelete && roomToDelete.imageUrls) {
       for (const url of roomToDelete.imageUrls) {
          try {
             const imageRef = ref(storage, url);
             await deleteObject(imageRef);
          } catch (error) {
             console.error("Error borrando imagen de storage:", error);
          }
       }
    }

    try {
      await fetch(`http://localhost:5000/api/rooms/${roomId}`, { method: 'DELETE' });
      setMyRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error("Error eliminando cuarto:", error);
      alert("Hubo un error al eliminar la propiedad.");
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', backgroundColor: colors.background, color: colors.blue, fontSize: '18px', fontWeight: '500' }}>
      Cargando tus propiedades...
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '40px 20px', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ fontWeight: '800', fontSize: '30px', color: colors.blue, margin: 0 }}>Mis Propiedades</h2>
          <Link to="/advertisement" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: colors.mint, color: colors.textDark, border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(32, 220, 163, 0.3)', transition: 'transform 0.2s' }}>
              + Crear Nuevo Anuncio
            </button>
          </Link>
        </div>

        {myRooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: colors.cardBg, borderRadius: '20px', border: `1px solid ${colors.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <p style={{ fontSize: '18px', color: colors.textLight, marginBottom: '20px' }}>Aún no tienes propiedades publicadas.</p>
            <Link to="/advertisement" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: colors.blue, color: 'white', border: 'none', borderRadius: '12px', padding: '14px 28px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(44, 92, 170, 0.2)' }}>
                Empieza a publicar ahora
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {myRooms.map((room) => (
              <div key={room.id} style={{ backgroundColor: colors.cardBg, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${colors.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                
                <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                  <ImageCarousel imageUrls={room.imageUrls} />
                  
                  <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: colors.textDark, display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    👁️ {room.viewsCount || 0}
                  </div>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', color: colors.textDark, fontWeight: '700' }}>{room.style || "Propiedad"}</h3>
                    <span style={{ fontWeight: '600', fontSize: '12px', backgroundColor: room.isPublished ? '#ecfdf5' : '#fffbeb', color: room.isPublished ? '#059669' : '#d97706', padding: '6px 10px', borderRadius: '8px' }}>
                      {room.isPublished ? 'Publicado' : 'Revisión'}
                    </span>
                  </div>
                  
                  <p style={{ margin: '0 0 15px 0', color: colors.textLight, fontSize: '14px', flex: 1 }}>📍 {room.location}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${colors.border}`, paddingTop: '15px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: colors.blue }}>Q {room.price}</span>
                    <span style={{ fontSize: '14px', color: colors.textLight, fontWeight: '500' }}>{room.area} m²</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/edit-room/${room.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <button style={{ width: '100%', backgroundColor: '#f1f5f9', color: colors.textDark, border: 'none', borderRadius: '10px', padding: '10px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#e2e8f0'} onMouseOut={(e) => e.target.style.backgroundColor = '#f1f5f9'}>
                        ✏️ Editar
                      </button>
                    </Link>
                    <button onClick={() => handleDeleteRoom(room.id)} style={{ flex: 1, backgroundColor: '#fef2f2', color: colors.danger, border: 'none', borderRadius: '10px', padding: '10px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'} onMouseOut={(e) => e.target.style.backgroundColor = '#fef2f2'}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}