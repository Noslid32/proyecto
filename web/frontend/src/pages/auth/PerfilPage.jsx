import { useState, useEffect } from "react";
import { VscAccount } from "react-icons/vsc"; 
import { auth } from "../../lib/firebase/config"; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function PerfilPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const colors = {
    blue: '#2c5caa',
    mint: '#20dca3',
    background: '#eef1f6',
    cardBg: '#ffffff',
    textDark: '#2c3e50',
    textLight: '#64748b',
    border: '#e2e8f0',
    danger: '#ef4444'
  };

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
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '85vh', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      
      <div style={{ backgroundColor: colors.cardBg, width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}` }}>
        
        <div style={{ width: '110px', height: '110px', margin: '0 auto 25px auto', borderRadius: '50%', border: `4px solid ${colors.mint}`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '50px', color: colors.blue, overflow: 'hidden', backgroundColor: '#f8f9fb', boxShadow: '0 4px 15px rgba(32,220,163,0.2)' }}>
          {user?.photoURL ? (
             <img src={user.photoURL} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
             <VscAccount />
          )}
        </div>

        <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800', color: colors.textDark }}>
          {user?.displayName || "Usuario de RoomIA"}
        </h3>
        <p style={{ margin: '0 0 35px 0', fontSize: '15px', color: colors.textLight }}>
          {user?.email || "Cargando email..."}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => navigate('/edit-profile')} style={{ backgroundColor: colors.blue, color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(44, 92, 170, 0.2)', transition: 'opacity 0.2s' }}>
            Editar Perfil
          </button>

          <button onClick={handleLogout} style={{ backgroundColor: 'transparent', color: colors.danger, border: `1px solid ${colors.danger}`, borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }}>
            Cerrar Sesión
          </button>
        </div>
        
      </div>
    </div>
  );
}