import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [backendMessage, setBackendMessage] = useState("");

  const testBackendConnection = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/test");
      const data = await response.json();
      setBackendMessage(data.message);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setBackendMessage("¡Error al conectar con el backend!");
    }
  };

  const roomImages = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=300&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=300&q=80",
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=300&q=80",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=300&q=80"
  ];

  const getBoxStyle = (rotation, dropDown, index) => {
    return {
      width: '140px',
      height: '180px',
      backgroundColor: '#a3a5c3',
      border: '4px solid black',
      borderRadius: '15px',
      transform: `rotate(${rotation}deg) translateY(${dropDown}px)`,
      boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      backgroundImage: `url(${roomImages[index]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  };

  return (
    <div style={{ 
      backgroundColor: '#1e88e5', 
      minHeight: '100vh', 
      padding: '60px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>

      <style>{`
        @keyframes circularOrbit {
          0% { transform: rotate(0deg) translateY(0px); }
          25% { transform: rotate(2deg) translateY(-10px); }
          50% { transform: rotate(0deg) translateY(0px); }
          75% { transform: rotate(-2deg) translateY(10px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }
        .carousel-container {
          animation: circularOrbit 6s infinite ease-in-out;
        }
        .room-box:hover {
          transform: scale(1.1) translateY(-20px) !important;
          z-index: 10;
          box-shadow: 10px 10px 0px rgba(0,0,0,0.9) !important;
        }
      `}</style>

      <div style={{ maxWidth: '600px', marginBottom: '40px', color: 'white', textShadow: '2px 2px 0px black' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '1px' }}>
          Bienvenido a RoomIA
        </h1>
        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
          Diseña, descubre y alquila espacios increíbles impulsados por Inteligencia Artificial.
        </p>
      </div>

      <div className="carousel-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '15px', 
        marginTop: '20px',
        marginBottom: '60px',
        flexWrap: 'nowrap'
      }}>
        <div className="room-box" style={getBoxStyle(-20, 60, 0)}></div>
        <div className="room-box" style={getBoxStyle(-10, 20, 1)}></div>
        <div className="room-box" style={getBoxStyle(0, 0, 2)}></div>
        <div className="room-box" style={getBoxStyle(10, 20, 3)}></div>
        <div className="room-box" style={getBoxStyle(20, 60, 4)}></div>
      </div>

      <Link to="/advertisement" style={{ textDecoration: 'none' }}>
        <button style={{
          backgroundColor: '#00e5ff', 
          color: 'black', 
          border: '2px solid black', 
          borderRadius: '8px',
          padding: '15px', 
          fontSize: '20px', 
          fontWeight: '700', 
          cursor: 'pointer',
          boxShadow: '6px 6px 0px black',
          transition: 'transform 0.1s',
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'translate(4px, 4px)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'translate(0px, 0px)'}
        >
          🚀 Publicar un Cuarto
        </button>
      </Link>
      
    </div>
  );
}