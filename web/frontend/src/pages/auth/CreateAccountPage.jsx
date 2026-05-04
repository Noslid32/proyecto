import { useState } from 'react';
import { auth } from '../../lib/firebase/config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateAccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const colors = {
    blue: '#2c5caa',
    mint: '#20dca3',
    background: '#eef1f6',
    cardBg: '#ffffff',
    textDark: '#2c3e50',
    textLight: '#64748b',
    border: '#e2e8f0'
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatusMessage('Creando cuenta...');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user; 

      await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: "Usuario RoomIA"
        })
      });
      
      navigate('/perfil');
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px', fontSize: '15px', border: `1px solid ${colors.border}`, 
    borderRadius: '12px', backgroundColor: '#f8f9fb', outline: 'none', boxSizing: 'border-box', color: colors.textDark
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      
      <div style={{ backgroundColor: colors.cardBg, padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}` }}>
        
        <h2 style={{ fontWeight: '800', fontSize: '28px', color: colors.blue, margin: '0 0 10px 0' }}>Crea tu cuenta</h2>
        <p style={{ color: colors.textLight, fontSize: '15px', marginBottom: '30px', marginTop: 0 }}>Únete a la mejor plataforma inmobiliaria</p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', fontSize: '14px', color: colors.textDark, display: 'block', marginBottom: '8px' }}>Correo Electrónico</label>
            <input type="email" required placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', fontSize: '14px', color: colors.textDark, display: 'block', marginBottom: '8px' }}>Contraseña</label>
            <input type="password" required placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </div>

          <button type="submit" style={{ backgroundColor: colors.mint, color: colors.textDark, border: 'none', borderRadius: '12px', padding: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s', marginTop: '10px', boxShadow: '0 4px 15px rgba(32, 220, 163, 0.3)' }}>
            Registrarse
          </button>
        </form>

        {statusMessage && (
          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: statusMessage.includes('Error') ? '#fef2f2' : '#ecfdf5', color: statusMessage.includes('Error') ? '#ef4444' : '#059669', borderRadius: '8px', fontWeight: '500', fontSize: '14px' }}>
            {statusMessage}
          </div>
        )}

        <p style={{ marginTop: '30px', fontSize: '15px', color: colors.textLight }}>
          ¿Ya tienes una cuenta? <Link to="/login" style={{ color: colors.blue, fontWeight: 'bold', textDecoration: 'none' }}>Inicia sesión</Link>
        </p>
      </div>

    </div>
  );
}