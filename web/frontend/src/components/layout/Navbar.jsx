import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { VscAccount } from "react-icons/vsc";
import { TfiAlignJustify } from "react-icons/tfi";
import { auth } from "../../lib/firebase/config"; 
import { onAuthStateChanged } from "firebase/auth"; 

export default function Navbar() {
  const [isOpenMenu, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate(); 

  const colors = {
    blue: '#1a2235',
    mint: '#20dca3',
    cardBg: '#ffffff',
    textDark: '#2c3e50',
    textLight: '#64748b'
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });
    return () => unsubscribe();
  }, []);

  const linkStyle = {
    color: colors.textDark,
    textDecoration: 'none',
    padding: '12px 20px',
    fontWeight: '500',
    display: 'block',
    fontSize: '15px',
    transition: 'background-color 0.2s ease',
    borderBottom: '1px solid #f1f5f9'
  };

  return (
    <div style={{ position: 'relative' }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '15px 30px', 
        backgroundColor: colors.blue, 
        borderBottom: '1px solid #e2e8f0', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        
        <div style={{ flex: 1 }}></div> 
        
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: colors.cardBg, letterSpacing: '-0.5px' }}>
              RoomIA
            </h1>
          </Link>
        </div>
        
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '20px', fontSize: '24px', alignItems: 'center' }}>

          {/* User-Icon Button */}
          <button 
            onClick={() => navigate(user ? '/perfil' : '/login')} 
            style={{ 
              color: colors.textDark, 
              display: 'flex',
              background: 'none', 
              border: 'none',     
              padding: 0,
              cursor: 'pointer'
            }}
          >
            {user && user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Perfil del usuario" 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  border: `2px solid ${colors.mint}`
                }} 
              />
            ) : (
              <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '50%', display: 'flex', color: colors.blue }}>
                <VscAccount size={22} />
              </div>
            )}
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isOpenMenu)} 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              background: 'none', 
              border: 'none', 
              color: colors.cardBg,
              padding: '5px'
            }}
          > 
            <TfiAlignJustify size={24} />
          </button>
        </div>
      </nav>

      {/* EL NUEVO MENÚ FLOTANTE */}
      {isOpenMenu && (
        <div style={{
          position: 'absolute',
          top: '70px', 
          right: '25px',
          backgroundColor: colors.cardBg,
          borderRadius: '16px',
          width: '220px',
          zIndex: 1000,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <Link to="/my-room" style={linkStyle} onClick={() => setIsMenuOpen(false)}>Mis Cuartos</Link>
          <Link to="/advertisement" style={linkStyle} onClick={() => setIsMenuOpen(false)}>Crear Anuncio</Link>
          <Link to="/statistics" style={{...linkStyle, borderBottom: 'none'}} onClick={() => setIsMenuOpen(false)}>Estadísticas</Link>
        </div>
      )}
    </div>
  );
}