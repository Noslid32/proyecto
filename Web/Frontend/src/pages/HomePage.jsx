export default function HomePage() {
  
  const getBoxStyle = (rotation, dropDown) => {
    return {
      width: '120px',
      height: '120px',
      backgroundColor: '#a3a5c3',
      border: '3px solid black',
      borderRadius: '15px',
      transform: `rotate(${rotation}deg) translateY(${dropDown}px)`,
      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
    };
  };

  return (
    <div style={{ 
      backgroundColor: '#1e88e5', 
      minHeight: '70vh', 
      padding: '40px 0',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* The Arched Carousel */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        marginTop: '60px',
        flexWrap: 'nowrap'
      }}>
        <div style={getBoxStyle(-20, 60)}></div>
        <div style={getBoxStyle(-10, 20)}></div>
        <div style={getBoxStyle(0, 0)}></div>
        <div style={getBoxStyle(10, 20)}></div>
        <div style={getBoxStyle(20, 60)}></div>
      </div>

      <h2 style={{ 
        marginTop: '60px', 
        fontWeight: 'bold', 
        fontSize: '28px',
        color: 'black'
      }}>
        Carrusel de imágenes
      </h2>
      
    </div>
  );
}