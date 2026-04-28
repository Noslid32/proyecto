import { useState, useEffect } from "react";
import { VscAccount } from "react-icons/vsc"; 
import { auth } from "../../lib/firebase/config"; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function PerfilPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada");
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#1e88e5', minHeight: '70vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '32px', color: 'black', marginBottom: '30px' }}>Mi Perfil</h2>

      <div style={{ backgroundColor: '#a3a5c3', border: '3px solid black', borderRadius: '15px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '4px 4px 10px rgba(0,0,0,0.3)' }}>
        
        <div style={{ width: '100px', height: '100px', backgroundColor: '#1e88e5', border: '3px solid black', borderRadius: '50%', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '60px', color: 'black', overflow: 'hidden' }}>
          {/* If the user has a Google Profile Picture, show it! Otherwise show the icon */}
          {user?.photoURL ? (
             <img src={user.photoURL} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
             <VscAccount />
          )}
        </div>

        {/* SHOW REAL USER DATA HERE */}
        <h3 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>
          {user?.displayName || "Usuario de RoomIA"}
        </h3>
        <p style={{ margin: '0 0 25px 0', fontSize: '16px' }}>
          {user?.email || "Cargando email..."}
        </p>

        <button onClick={() => navigate('/edit-profile')} style={{ backgroundColor: '#1e88e5', color: 'black', border: '3px solid black', borderRadius: '10px', padding: '12px 20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxShadow: '2px 2px 0px black', marginBottom: '15px' }}>
          Editar Perfil
        </button>

        <button onClick={handleLogout} style={{ backgroundColor: '#ff5252', color: 'white', border: '3px solid black', borderRadius: '10px', padding: '12px 20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxShadow: '2px 2px 0px black' }}>
          Cerrar Sesión
        </button>
        
      </div>
    </div>
  );
}