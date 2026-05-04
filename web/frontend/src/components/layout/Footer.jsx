import { AiOutlineGithub, AiOutlineGoogle, AiOutlineYoutube, AiOutlineInstagram } from "react-icons/ai";

export default function Footer() {
  const colors = {
    mint: '#20dca3',
    darkBg: '#1a2235',
    textLight: '#94a3b8',
    textWhite: '#ffffff'
  };

  return (
    <footer style={{
      backgroundColor: colors.darkBg,
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',   
      gap: '25px',            
      color: colors.textWhite,
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      
      {/* 1. Contact Information Section */}
      <div style={{ textAlign: 'center', fontSize: '15px', color: colors.textLight }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: colors.textWhite, fontSize: '18px', letterSpacing: '0.5px' }}>
          ¿Necesitas ayuda?
        </p>
        <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          📧 support@roomia.com
        </p>
        <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          📞 +502 2123-4567
        </p>
      </div>

      {/* Separador sutil */}
      <div style={{ width: '60px', height: '2px', backgroundColor: colors.mint, borderRadius: '2px', opacity: 0.8 }}></div>

      {/* 2. Social Media Icons Section */}
      <div style={{ display: 'flex', gap: '25px', fontSize: '28px' }}>
        
        <a href="https://github.com/Noslid32/proyecto" target="_blank" rel="noreferrer" style={{ color: colors.textLight, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = colors.mint} onMouseOut={(e) => e.target.style.color = colors.textLight}>
          <AiOutlineGithub />
        </a>
        
        <a href="mailto:support@roomia.com" style={{ color: colors.textLight, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = colors.mint} onMouseOut={(e) => e.target.style.color = colors.textLight}>
          <AiOutlineGoogle />
        </a>
        
        <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: colors.textLight, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = colors.mint} onMouseOut={(e) => e.target.style.color = colors.textLight}>
          <AiOutlineYoutube />
        </a>
        
        <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: colors.textLight, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = colors.mint} onMouseOut={(e) => e.target.style.color = colors.textLight}>
          <AiOutlineInstagram />
        </a>
        
      </div>

      <div style={{ fontSize: '12px', color: colors.textLight, marginTop: '10px' }}>
        © {new Date().getFullYear()} RoomIA. Todos los derechos reservados.
      </div>
      
    </footer>
  );
}