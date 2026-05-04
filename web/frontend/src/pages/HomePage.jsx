import { Link } from "react-router-dom";

export default function HomePage() {
  
  const colors = {
    blue: '#2c5caa',
    mint: '#20dca3',
    background: '#f8f9fb',
    textDark: '#1e293b',
    textLight: '#64748b'
  };

  const roomImages = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&q=80",
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&q=80",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&q=80"
  ];

  const getBoxStyle = (rotation, dropDown, index) => {
    return {
      width: '180px',
      height: '240px',
      borderRadius: '24px',
      transform: `rotate(${rotation}deg) translateY(${dropDown}px)`,
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      backgroundImage: `url(${roomImages[index]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      border: '4px solid white',
      flexShrink: 0
    };
  };

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      minHeight: '100vh', 
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>

      <style>{`
        @keyframes floatSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .gallery-container {
          animation: floatSlow 8s ease-in-out infinite;
        }
        .room-box:hover {
          transform: scale(1.08) translateY(-20px) rotate(0deg) !important;
          z-index: 20;
          box-shadow: 0 30px 60px rgba(44, 92, 170, 0.2) !important;
        }
      `}</style>

      <div style={{ maxWidth: '800px', textAlign: 'center', marginBottom: '60px', zIndex: 10 }}>
        
        <div style={{ display: 'inline-block', backgroundColor: '#eef2ff', color: colors.blue, padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', marginBottom: '20px', letterSpacing: '0.5px' }}>
          ✨ Impulsado por Inteligencia Artificial
        </div>

        <h1 style={{ fontSize: '56px', fontWeight: '900', color: colors.textDark, margin: '0 0 20px 0', lineHeight: '1.1', letterSpacing: '-1px' }}>
          Encuentra tu lugar ideal o <span style={{ color: colors.blue }}>alquila tu espacio</span>
        </h1>
        
        <p style={{ fontSize: '20px', color: colors.textLight, margin: '0 auto 40px auto', maxWidth: '600px', lineHeight: '1.6' }}>
          RoomIA conecta a propietarios con los mejores inquilinos. Diseña anuncios atractivos en segundos con la ayuda de nuestro Coach IA.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/advertisement" style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: colors.mint, 
              color: colors.textDark, 
              border: 'none', 
              borderRadius: '16px',
              padding: '16px 32px', 
              fontSize: '18px', 
              fontWeight: '800', 
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(32, 220, 163, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(32, 220, 163, 0.4)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(32, 220, 163, 0.3)'; }}
            >
              🚀 Publicar un Cuarto
            </button>
          </Link>

          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: 'white', 
              color: colors.blue, 
              border: `2px solid #e2e8f0`, 
              borderRadius: '16px',
              padding: '16px 32px', 
              fontSize: '18px', 
              fontWeight: '700', 
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              transition: 'background-color 0.2s, border-color 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = colors.blue; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = 'white'; }}
            >
              Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>

      <div className="gallery-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '20px', 
        marginTop: '20px',
        padding: '20px',
        flexWrap: 'nowrap',
        width: '100%',
        maxWidth: '1200px'
      }}>

        <div className="room-box" style={getBoxStyle(-12, 40, 0)}></div>
        <div className="room-box" style={getBoxStyle(-6, 10, 1)}></div>
        <div className="room-box" style={{...getBoxStyle(0, -10, 2), zIndex: 5, transform: 'scale(1.05)'}}></div>
        <div className="room-box" style={getBoxStyle(6, 10, 3)}></div>
        <div className="room-box" style={getBoxStyle(12, 40, 4)}></div>
      </div>
      
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(44,92,170,0.05) 0%, rgba(248,249,251,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

    </div>
  );
}