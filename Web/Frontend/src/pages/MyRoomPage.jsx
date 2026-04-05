export default function MyRoomPage() {
  
  // 1. Mock Data: This simulates the data we will eventually get from your backend database!
  const myRooms = [
    {
      id: 1,
      title: "Habitación luminosa en el centro",
      status: "Publicado",
      views: 124,
    },
    {
      id: 2,
      title: "Estudio moderno con balcón",
      status: "En revisión",
      views: 0,
    }
  ];

  return (
    <div style={{ 
      backgroundColor: '#1e88e5', // Signature RoomIA Blue
      minHeight: '100vh', 
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      <h2 style={{ fontWeight: 'bold', fontSize: '32px', color: 'black', marginBottom: '30px' }}>
        Mis Habitaciones
      </h2>

      {/* The Container for all the room cards */}
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '25px' 
      }}>
        
        {/* 2. The Map Function: Loops through our mock data and builds a card for each room */}
        {myRooms.map((room) => (
          <div key={room.id} style={{
            backgroundColor: '#a3a5c3', // Signature RoomIA Purple/Grey
            border: '3px solid black',
            borderRadius: '15px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            boxShadow: '4px 4px 0px black' // Retro shadow
          }}>
            
            {/* Image Placeholder */}
            <div style={{
              backgroundColor: '#ffffff',
              height: '150px',
              border: '3px dashed black',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              color: '#555'
            }}>
              [ Foto de: {room.title} ]
            </div>

            {/* Room Details */}
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 'bold' }}>
                {room.title}
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Dynamic Status Badge: Green if published, Yellow if pending */}
                <span style={{ 
                  backgroundColor: room.status === 'Publicado' ? '#4caf50' : '#ffeb3b',
                  color: 'black',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: '2px solid black'
                }}>
                  {room.status}
                </span>
                
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  👁️ {room.views} vistas
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <button style={{
                flex: 1, backgroundColor: '#00e5ff', color: 'black', border: '2px solid black',
                borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer',
                transition: 'transform 0.1s'
              }}>
                Editar
              </button>
              <button style={{
                flex: 1, backgroundColor: '#ff5252', color: 'black', border: '2px solid black',
                borderRadius: '8px', padding: '10px', fontWeight: 'bold', cursor: 'pointer'
              }}>
                Eliminar
              </button>
            </div>

          </div>
        ))}
        
      </div>
    </div>
  );
}