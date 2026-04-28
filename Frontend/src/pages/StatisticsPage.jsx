import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [coachAdvice, setCoachAdvice] = useState('');
  const [isAskingCoach, setIsAskingCoach] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  // FETCH REAL STATS FROM BACKEND
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5000/api/users/${user.uid}/stats`);
          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error("Error al cargar estadísticas:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAskCoach = async () => {
    setIsAskingCoach(true);
    const auth = getAuth();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${auth.currentUser.uid}/coach?roomId=${selectedRoomId}`);
      const data = await response.json();
      setCoachAdvice(data.advice);
    } catch (error) {
      console.error("Error al consultar al coach:", error);
      alert("El Coach IA está descansando ahora mismo.");
    } finally {
      setIsAskingCoach(false);
    }
  };

  const StatCard = ({ title, number, icon }) => (
    <div style={{ backgroundColor: '#a3a5c3', border: '3px solid black', borderRadius: '10px', padding: '20px', flex: '1', minWidth: '130px', textAlign: 'center', boxShadow: '3px 3px 0px black' }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>{title}</h4>
      <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#1e88e5', textShadow: '1px 1px 0px black' }}>
        {icon} {number}
      </p>
    </div>
  );

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '24px' }}>Cargando tu dashboard...</div>;
  const contactGoal = 10;
  const currentContacts = stats?.totalContacts || 0;
  const progressPercentage = Math.min((currentContacts / contactGoal) * 100, 100);
  const currentDisplayRoom = stats?.allRooms?.find(room => room.id === selectedRoomId) || stats?.topRoom;

  return (
    <div style={{ backgroundColor: '#1e88e5', minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <h2 style={{ fontWeight: 'bold', fontSize: '32px', color: 'black', marginBottom: '30px' }}>
        Dashboard del Propietario
      </h2>

      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Real Quick Stats */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <StatCard title="Vistas Totales" number={stats?.totalViews || 0} icon="👁️" />
          <StatCard title="Contactos" number={stats?.totalContacts || 0} icon="📞" />
          <StatCard title="Compartidos" number={stats?.totalShares || 0} icon="🔗" />
          <StatCard title="Tus Anuncios" number={stats?.totalRooms || 0} icon="🏠" />
        </div>

        {/* TOP ROOM */}
        {stats?.topRoom && (
          <div style={{ backgroundColor: 'white', border: '3px solid black', borderRadius: '15px', padding: '25px', boxShadow: '5px 5px 0px black' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '22px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
              🌟 Tu Propiedad Estrella
            </h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '2px solid black' }}>
                <img 
                  src={stats.topRoom.imageUrls?.[0] || stats.topRoom.imageUrl} 
                  alt="Propiedad Estrella" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{stats.topRoom.style || "Habitación"}</h4>
                <p style={{ margin: '0 0 10px 0', color: '#555' }}>📍 {stats.topRoom.location}</p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <span style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '5px' }}>👁️ {stats.topRoom.viewsCount} vistas</span>
                  <span style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '5px' }}>📞 {stats.topRoom.contactsCount} contactos</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coach Inmobiliario IA */}
        <div style={{ backgroundColor: '#a3a5c3', border: '3px solid black', borderRadius: '15px', padding: '25px', boxShadow: '5px 5px 0px black' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '22px' }}>🤖 Coach Inmobiliario IA</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Obtén consejos personalizados basados en tu rendimiento.</p>
            </div>
            <button 
              onClick={handleAskCoach}
              disabled={isAskingCoach}
              style={{ backgroundColor: '#00e5ff', color: 'black', border: '2px solid black', borderRadius: '8px', padding: '12px 20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px black' }}
            >
              {isAskingCoach ? "Analizando datos..." : "💡 Consultar al Coach"}
            </button>
          </div>

          {/* AI Response Bubble */}
          {coachAdvice && (
            <div style={{ marginTop: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '15px', border: '2px solid black', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10px', left: '30px', width: '20px', height: '20px', backgroundColor: 'white', borderLeft: '2px solid black', borderTop: '2px solid black', transform: 'rotate(45deg)' }}></div>
              <p style={{ margin: 0, fontSize: '16px', fontStyle: 'italic', lineHeight: '1.5' }}>
                {coachAdvice}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}