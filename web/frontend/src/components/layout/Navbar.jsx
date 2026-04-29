import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { VscAccount } from "react-icons/vsc";
import { TfiAlignJustify } from "react-icons/tfi";
import { auth } from "../../lib/firebase/config"; 
import { onAuthStateChanged } from "firebase/auth";
import myLogo from "../../../cache/logo.png"; 

export default function Navbar() {
  const [isOpenMenu, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });

    return () => unsubscribe();
  }, []);

  const linkStyle = {
    color: 'black',
    textDecoration: 'none',
    padding: '15px 30px',
    fontWeight: 'bold',
    display: 'block',
    borderBottom: '1px solid black',
    textAlign: 'center'
  };

  return (
    <div style={{ position: 'relative' }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '15px 30px', 
        backgroundColor: '#a3a5c3', 
        borderBottom: '3px solid black'
      }}>

        
        <div style={{ flex: 1 }}></div> 
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src={myLogo} 
            alt="Logo de RoomIA" 
            style={{ 
              height: '50px',
              objectFit: 'contain',
              cursor: 'pointer'
            }} 
          />
        </Link>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>RoomIA</h1>
          </Link>
        </div>
        
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '15px', fontSize: '30px', alignItems: 'center' }}>

          {/* User-Icon Button */}
          <button 
            onClick={() => navigate(user ? '/perfil' : '/login')} 
            style={{ 
              color: 'black', 
              display: 'flex',
              background: 'none', 
              border: 'none',     
              padding: 0,
              cursor: 'pointer'
            }}
          >
            {/* THE MAGIC HAPPENS HERE: */}
            {user && user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Perfil del usuario" 
                style={{ 
                  width: '35px', 
                  height: '35px', 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  border: '2px solid black' 
                }} 
              />
            ) : (
              <VscAccount style={{ borderRadius: '50%', padding: '0 5px' }}/>
            )}
          </button>

          <span onClick={() => setIsMenuOpen(!isOpenMenu)} style={{ cursor: 'pointer', display: 'flex'}}> 
            <TfiAlignJustify/>
          </span>
        </div>
      </nav>

      {isOpenMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          backgroundColor: '#a3a5c3',
          border: '3px solid black',
          borderTop: 'none',
          width: '250px',
          zIndex: 1000
        }}>
          <Link to="/my-room" style={linkStyle} onClick={() => setIsMenuOpen(false)}> Mis Cuartos</Link>
          <Link to="/advertisement" style={linkStyle} onClick={() => setIsMenuOpen(false)}> Crear Anuncio </Link>
          <Link to="/statistics" style={linkStyle} onClick={() => setIsMenuOpen(false)}> Estadisticas </Link>
        </div>
      )}
    </div>
  );
}