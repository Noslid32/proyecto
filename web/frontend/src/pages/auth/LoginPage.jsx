import { useState } from 'react';
import { auth, googleProvider } from '../../lib/firebase/config';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

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

  return (
    <div style={{ backgroundColor: '#1e88e5', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#a3a5c3', border: '3px solid black', borderRadius: '15px', padding: '40px 30px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '6px 6px 0px black' }}>
        
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Bienvenido a RoomIA</h2>
        <p style={{ fontSize: '16px', margin: '0 0 30px 0' }}>Inicia sesión para continuar.</p>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          <input 
            type="email" required placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: '90%', padding: '10px', fontSize: '16px', border: '3px solid black', borderRadius: '8px' }}
          />
          <input 
            type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ width: '90%', padding: '10px', fontSize: '16px', border: '3px solid black', borderRadius: '8px' }}
          />
          <button type="submit" style={{ backgroundColor: '#00e5ff', color: 'black', border: '3px solid black', borderRadius: '10px', padding: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px black' }}>
            Entrar
          </button>
        </form>

        {/* Error Message */}
        {errorMessage && (
          <p style={{ color: '#ff5252', fontWeight: 'bold', backgroundColor: 'black', padding: '5px', borderRadius: '5px' }}>{errorMessage}</p>
        )}

        <div style={{ margin: '15px 0', fontWeight: 'bold' }}>--- O ---</div>

        {/* Google Button */}
        <button onClick={handleGoogleLogin} style={{ backgroundColor: 'white', color: 'black', border: '3px solid black', borderRadius: '10px', padding: '12px 20px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '2px 2px 0px black' }}>
          <span style={{ backgroundColor: '#ea4335', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>G</span>
          Continuar con Google
        </button>

        {/* Link to Sign Up */}
        <p style={{ marginTop: '25px', fontSize: '15px', fontWeight: 'bold' }}>
          ¿No tienes una cuenta? <Link to="/signup" style={{ color: '#1e88e5', textDecoration: 'underline' }}>Regístrate aquí</Link>
        </p>
        
      </div>
    </div>
  );
}