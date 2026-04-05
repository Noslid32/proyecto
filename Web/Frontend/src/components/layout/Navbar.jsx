import { useState } from "react";
import { Link } from "react-router-dom";
import { VscAccount} from "react-icons/vsc";
import { TfiAlignJustify } from "react-icons/tfi";

export default function Navbar() {
  const [isOpenMenu, setIsMenuOpen] = useState(false);
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

        {/* Link Menu */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>RoomIA</h1>
          </Link>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '15px', fontSize: '30px', alignItems: 'center' }}>

          {/* User-Icon */}
          <Link to="/perfil" style={{ color: 'black', display: 'flex' }}>
            <VscAccount style={{ cursor: 'pointer', borderRadius: '50%', padding: '0 5px' }}/>
          </Link>

          {/* Burger bar for navigate */}
          <span onClick={() => setIsMenuOpen(!isOpenMenu)} style={{ cursor: 'pointer', display: 'flex'}}> < TfiAlignJustify/></span>
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

          {/* When a user clicks a link, we close the menu by setting state to false */}
          <Link to="/my-room" style={linkStyle} onClick={() => setIsMenuOpen(false)}> Mis Cuartos</Link>
          <Link to="/advertisement" style={linkStyle} onClick={() => setIsMenuOpen(false)}> Crear Anuncio </Link>
          <Link to="/statistics" style={linkStyle} onClick={() => setIsMenuOpen(false)}> Estadisticas </Link>
        </div>
      )}
    </div>
  );
}