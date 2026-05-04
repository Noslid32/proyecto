import { useState } from 'react';
import { auth, googleProvider } from '../../lib/firebase/config';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/perfil');
    } catch (error) {
      setErrorMessage("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user; 

      await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName
        })
      });
      
      navigate('/perfil');
    } catch (error) {
      setErrorMessage("Error al iniciar sesión con Google.");
    }
  };

  const inputStyle = {
    width: '100%', 
    padding: '14px', 
    fontSize: '15px', 
    border: `1px solid ${colors.border}`, 
    borderRadius: '12px',
    backgroundColor: '#f8f9fb',
    outline: 'none',
    boxSizing: 'border-box',
    color: colors.textDark
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      
      <div style={{ backgroundColor: colors.cardBg, padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}` }}>
        
        <h2 style={{ fontWeight: '800', fontSize: '28px', color: colors.blue, margin: '0 0 10px 0' }}>Bienvenido de nuevo</h2>
        <p style={{ color: colors.textLight, fontSize: '15px', marginBottom: '30px', marginTop: 0 }}>Inicia sesión en tu cuenta de RoomIA</p>

        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', fontSize: '14px', color: colors.textDark, display: 'block', marginBottom: '8px' }}>Correo Electrónico</label>
            <input type="email" required placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', fontSize: '14px', color: colors.textDark, display: 'block', marginBottom: '8px' }}>Contraseña</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </div>

          <button type="submit" style={{ backgroundColor: colors.blue, color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s', marginTop: '10px', boxShadow: '0 4px 15px rgba(44, 92, 170, 0.2)' }}>
            Iniciar Sesión
          </button>
        </form>

        {errorMessage && (
          <p style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', marginTop: '15px' }}>{errorMessage}</p>
        )}

        <div style={{ margin: '25px 0', display: 'flex', alignItems: 'center', gap: '15px', color: colors.textLight, fontSize: '14px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: colors.border }}></div>
          <span>o continúa con</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: colors.border }}></div>
        </div>

        <button onClick={handleGoogleLogin} style={{ backgroundColor: 'white', color: colors.textDark, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'background-color 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
          Google
        </button>

        <p style={{ marginTop: '30px', fontSize: '15px', color: colors.textLight }}>
          ¿No tienes una cuenta? <Link to="/signup" style={{ color: colors.blue, fontWeight: 'bold', textDecoration: 'none' }}>Regístrate aquí</Link>
        </p>
      </div>

    </div>
  );
}