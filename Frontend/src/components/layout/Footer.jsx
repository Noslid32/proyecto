import { AiOutlineGithub, AiOutlineGoogle, AiOutlineYoutube, AiOutlineInstagram } from "react-icons/ai";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#a3a5c3',
      borderTop: '3px solid black',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',   
      gap: '15px',            
      color: 'black'
    }}>
      
      {/* 1. Contact Information Section */}
      <div style={{ textAlign: 'center', fontSize: '18px' }}>
        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Contactanos:</p>
        <p style={{ margin: '5px 0' }}>📧 support@roomia.com</p>
        <p style={{ margin: '5px 0' }}>📞 +502 2123-4567</p>
      </div>

      {/* 2. Social Media Icons Section */}
      <div style={{ display: 'flex', gap: '20px', fontSize: '32px' }}>
        
        <a href="https://github.com/Noslid32/proyecto" target="_blank" rel="noreferrer" style={{ color: 'black' }}>
          <AiOutlineGithub />
        </a>
        
        <a href="mailto:support@roomia.com" style={{ color: 'black' }}>
          <AiOutlineGoogle />
        </a>
        
        <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: 'black' }}>
          <AiOutlineYoutube />
        </a>
        
        <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: 'black' }}>
          <AiOutlineInstagram />
        </a>
        
      </div>
      
    </footer>
  );
}