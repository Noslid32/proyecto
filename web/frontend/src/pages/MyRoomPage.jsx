import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, deleteObject} from 'firebase/storage';
import { storage } from '../lib/firebase/config';
import { Link } from 'react-router-dom'; 

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
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta habitación? Esta acción no se puede deshacer.");
    if (!confirmDelete) return;
    const roomToDelete = myRooms.find((room) => room.id === roomId);

    if (roomToDelete && roomToDelete.imageUrls) {
      for (const imgUrl of roomToDelete.imageUrls) {
        try {
          const imgRef = ref(storage, imgUrl);
          await deleteObject(imgRef);
          console.log(`Imagen eliminada: ${imgUrl}`);
        } catch (error) {
          console.error(`Error al eliminar imagen ${imgUrl} de Firebase:`, error);
        }
      }
    }
    try {
      await fetch(`http://localhost:5000/api/rooms/${roomId}`, { method: 'DELETE' });
      setMyRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error("Error al eliminar la habitación:", error);
      alert("Hubo un error al intentar eliminar la base de datos.");
    }
  };

  const handleSimulateView = async (roomId) => {
    try {
      await fetch(`http://localhost:5000/api/rooms/${roomId}/view`, { method: 'PUT' });
      setMyRooms((prevRooms) => 
        prevRooms.map((room) => 
          room.id === roomId ? { ...room, viewsCount: room.viewsCount + 1 } : room
        )
      );
    } catch (error) {
      console.error("Error incrementando la vista:", error);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '24px' }}>Cargando tus habitaciones...</div>;
  }

  return (
    <div style={{ backgroundColor: '#1e88e5', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1000px', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '32px', color: 'black', margin: 0 }}>
          Mis Habitaciones
        </h2>
        <Link to="/advertisement" style={{ textDecoration: 'none' }}>
          <button style={{ backgroundColor: '#00e5ff', color: 'black', border: '3px solid black', borderRadius: '10px', padding: '10px 20px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '4px 4px 0px black' }}>
            + Nueva Habitación
          </button>
        </Link>
      </div>

      {/* ROOMS GRID SECTION */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '25px' 
      }}>
        
        {myRooms.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', backgroundColor: '#a3a5c3', border: '3px solid black', borderRadius: '15px', boxShadow: '6px 6px 0px black' }}>
            <p style={{ fontSize: '24px', color: 'black', fontWeight: 'bold', marginBottom: '20px' }}>No has publicado ninguna habitación aún. 🏠</p>
            <p style={{ fontSize: '16px', marginBottom: '20px' }}>Añade tu primer diseño para que otros puedan inspirarse.</p>
          </div>
        ) : (
          myRooms.map((room) => (
            <div key={room.id} style={{ backgroundColor: '#a3a5c3', border: '3px solid black', borderRadius: '15px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '4px 4px 0px black' }}>
              <div style={{ position: 'relative' }}>
                
                {room.imageUrls && room.imageUrls.length > 1 && (
                  <button 
                    onClick={() => document.getElementById(`gallery-${room.id}`).scrollBy({ left: -320, behavior: 'smooth' })}
                    style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', zIndex: 10, backgroundColor: 'white', border: '3px solid black', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {"<"}
                  </button>
                )}

                <div id={`gallery-${room.id}`} style={{ 
                  display: 'flex', 
                  overflowX: 'auto', 
                  gap: '10px', 
                  paddingBottom: '5px',
                  scrollSnapType: 'x mandatory'
                }}>
                  {room.imageUrls && room.imageUrls.map((imgUrl, index) => (
                    <div key={index} style={{ minWidth: '100%', height: '220px', borderRadius: '10px', overflow: 'hidden', border: '3px solid black', scrollSnapAlign: 'start' }}>
                      <img src={imgUrl} alt={`Foto ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>

                {room.imageUrls && room.imageUrls.length > 1 && (
                  <button 
                    onClick={() => document.getElementById(`gallery-${room.id}`).scrollBy({ left: 320, behavior: 'smooth' })}
                    style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', zIndex: 10, backgroundColor: 'white', border: '3px solid black', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {">"}
                  </button>
                )}
              </div>

              {/* DETAILS SECTION */}
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold' }}>{room.style || "Sin estilo"}</h3>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>📍 {room.location || "Sin ubicación"}</p>

                {/* PRICE FIELD */}
                <p style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: '900', color: '#333', backgroundColor: 'white', padding: '5px 10px', borderRadius: '8px', border: '2px solid black', display: 'inline-block', alignSelf: 'flex-start' }}>
                  💰 {room.price || "Precio a convenir"}
                </p>

                {/* AREA FIELD */}
                <p style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold', color: '#333', backgroundColor: 'white', padding: '5px 10px', borderRadius: '8px', border: '2px solid black', display: 'inline-block', alignSelf: 'flex-start' }}>
                  📏 {room.area || "Área no especificada"}
                </p>

                {/* THE AI DESCRIPTION BOX */}
                {room.aiDescription && (
                  <div style={{ 
                    backgroundColor: 'white', 
                    border: '2px solid black', 
                    borderRadius: '8px', 
                    padding: '12px', 
                    marginBottom: '15px',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    color: '#444',
                    maxHeight: '120px',
                    overflowY: 'auto'
                  }}>
                    {room.aiDescription}
                  </div>
                )}
                
                {/* STATUS & VIEWS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ backgroundColor: room.isPublished ? '#4caf50' : '#ffeb3b', color: 'black', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', border: '2px solid black' }}>
                    {room.isPublished ? 'Publicado' : 'En revisión'}
                  </span>
                  <span style={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: 'white', padding: '5px 10px', borderRadius: '10px', border: '2px solid black' }}>
                    👁️ {room.viewsCount}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <Link to={`/edit-room/${room.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <button style={{ width: '100%', backgroundColor: '#ffeb3b', color: 'black', border: '2px solid black', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                    ✏️ Editar
                  </button>
                </Link>
                <button onClick={() => handleDeleteRoom(room.id)} style={{ flex: 1, backgroundColor: '#ff5252', color: 'black', border: '2px solid black', borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                  🗑️ Eliminar
                </button>
              </div>

            </div>
          ))
        )}
      </div>
      
      {/* Scrollbar hiding CSS */}
      <style>{`
        /* Hide scrollbar for the image gallery for a cleaner look */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}