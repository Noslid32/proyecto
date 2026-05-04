import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [coachAdvice, setCoachAdvice] = useState('');
  const [isAskingCoach, setIsAskingCoach] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const colors = {
    blue: '#2c5caa',
    mint: '#20dca3',
    background: '#eef1f6',
    cardBg: '#f8f9fb',
    textDark: '#2c3e50',
    textLight: '#64748b'  
  };

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
    <div style={{ 
      backgroundColor: colors.cardBg, 
      borderRadius: '16px', 
      padding: '24px', 
      flex: '1', 
      minWidth: '140px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Sombra suave
      border: '1px solid #eaeaea',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <h4 style={{ margin: 0, fontSize: '14px', color: colors.textLight, fontWeight: '500' }}>{title}</h4>
      </div>
      <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: colors.blue }}>
        {number}
      </p>
    </div>
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: colors.background, color: colors.blue, fontSize: '20px' }}>
      Cargando panel de control...
    </div>
  );

  const currentDisplayRoom = stats?.allRooms?.find(room => room.id === selectedRoomId) || stats?.topRoom;

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '40px 20px', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        <h2 style={{ fontWeight: '800', fontSize: '32px', color: colors.blue, margin: '0 0 10px 0' }}>
          Dashboard de Rendimiento
        </h2>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <StatCard title="Vistas Totales" number={stats?.totalViews || 0} icon="👁️" />
          <StatCard title="Contactos" number={stats?.totalContacts || 0} icon="📞" />
          <StatCard title="Compartidos" number={stats?.totalShares || 0} icon="🔗" />
          <StatCard title="Tus Anuncios" number={stats?.totalRooms || 0} icon="🏠" />
        </div>

        {currentDisplayRoom && (
          <div style={{ backgroundColor: colors.cardBg, borderRadius: '20px', padding: '30px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #eaeaea' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '22px', color: colors.textDark, display: 'flex', alignItems: 'center', gap: '10px' }}>
                🌟 Analizar Propiedad
              </h3>
            
              {stats?.allRooms && stats.allRooms.length > 0 && (
                <select 
                  value={selectedRoomId} 
                  onChange={(e) => {
                    setSelectedRoomId(e.target.value);
                    setCoachAdvice(''); 
                  }}
                  style={{ 
                    padding: '10px 15px', 
                    borderRadius: '10px', 
                    border: `1px solid ${colors.blue}`, 
                    color: colors.blue,
                    backgroundColor: '#f9fbfd',
                    fontWeight: '600', 
                    fontSize: '14px', 
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="">🏆 Propiedad Estrella (Por defecto)</option>
                  {stats.allRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.style || "Habitación"} - {room.location || "Sin ubicación"}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ width: '180px', height: '120px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <img 
                  src={currentDisplayRoom.imageUrls?.[0] || currentDisplayRoom.imageUrl} 
                  alt="Propiedad" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '24px', color: colors.textDark }}>{currentDisplayRoom.style || "Habitación"}</h4>
                <p style={{ margin: '0 0 15px 0', color: colors.textLight, fontSize: '15px' }}>📍 {currentDisplayRoom.location}</p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <span style={{ fontWeight: '600', backgroundColor: '#f0f4fb', color: colors.blue, padding: '8px 12px', borderRadius: '8px', fontSize: '14px' }}>👁️ {currentDisplayRoom.viewsCount} vistas</span>
                  <span style={{ fontWeight: '600', backgroundColor: '#eafff8', color: '#0f9a72', padding: '8px 12px', borderRadius: '8px', fontSize: '14px' }}>📞 {currentDisplayRoom.contactsCount} contactos</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: colors.blue, borderRadius: '20px', padding: '30px', boxShadow: '0 8px 30px rgba(44, 92, 170, 0.2)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>🤖 Asesor IA RoomIA</h3>
              <p style={{ margin: 0, fontSize: '15px', opacity: 0.9 }}>Genera estrategias de marketing personalizadas para la propiedad seleccionada.</p>
            </div>
            <button 
              onClick={handleAskCoach}
              disabled={isAskingCoach}
              style={{ 
                backgroundColor: colors.mint, 
                color: colors.textDark, 
                border: 'none', 
                borderRadius: '10px', 
                padding: '14px 24px', 
                fontWeight: 'bold', 
                fontSize: '16px',
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(32, 220, 163, 0.4)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {isAskingCoach ? "🧠 Analizando..." : "💡 Consultar al Asesor"}
            </button>
          </div>

          {coachAdvice && (
            <div style={{ marginTop: '25px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '25px', borderRadius: '15px', borderLeft: `4px solid ${colors.mint}` }}>
              <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.6', letterSpacing: '0.3px' }}>
                {coachAdvice}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}