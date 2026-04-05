// Let's reuse the account icon for the profile picture!
import { VscAccount } from "react-icons/vsc"; 

export default function PerfilPage() {
  return (
    <div style={{ 
      backgroundColor: '#1e88e5',
      minHeight: '70vh',          
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
        
      <h2 style={{ 
        fontWeight: 'bold', 
        fontSize: '32px',
        color: 'black',
        marginBottom: '30px'
      }}>
        Mi Perfil
      </h2>

      {/* The Profile Card */}
      <div style={{
        backgroundColor: '#a3a5c3', // The purple/grey theme color
        border: '3px solid black',  // Thick borders like the carousel
        borderRadius: '15px',       // Rounded corners
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '4px 4px 10px rgba(0,0,0,0.3)'
      }}>
        
        {/* Profile Avatar Circle */}
        <div style={{
          width: '100px',
          height: '100px',
          backgroundColor: '#1e88e5',
          border: '3px solid black',
          borderRadius: '50%',
          margin: '0 auto 20px auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '60px',
          color: 'black'
        }}>
          <VscAccount />
        </div>

        {/* User Details */}
        <h3 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>Usuario RoomIA</h3>
        <p style={{ margin: '0 0 25px 0', fontSize: '16px' }}>usuario@roomia.com</p>

        {/* Action Button */}
        <button style={{
          backgroundColor: '#1e88e5',
          color: 'black',
          border: '3px solid black',
          borderRadius: '10px',
          padding: '12px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          boxShadow: '2px 2px 0px black' // A fun retro shadow effect
        }}>
          Editar Perfil
        </button>
        
      </div>
      
    </div>
  );
}