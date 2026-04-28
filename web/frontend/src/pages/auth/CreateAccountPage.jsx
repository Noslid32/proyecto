// Assuming your firebase.js is inside the src/ folder:
import { useState } from 'react';
import { auth } from '../../lib/firebase/config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateAccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

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

 return (
    <div style={{ backgroundColor: '#1e88e5', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#a3a5c3', border: '3px solid black', borderRadius: '15px', padding: '40px 30px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '6px 6px 0px black' }}>
        
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Crear Cuenta</h2>
        <p style={{ fontSize: '16px', margin: '0 0 25px 0' }}>Únete a RoomIA y diseña tu espacio ideal.</p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 'bold', fontSize: '16px', display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
            <input type="email" required placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '90%', padding: '10px', fontSize: '16px', border: '3px solid black', borderRadius: '8px' }} />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 'bold', fontSize: '16px', display: 'block', marginBottom: '5px' }}>Contraseña:</label>
            <input type="password" required placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '90%', padding: '10px', fontSize: '16px', border: '3px solid black', borderRadius: '8px' }} />
          </div>

          <button type="submit" style={{ backgroundColor: '#00e5ff', color: 'black', border: '3px solid black', borderRadius: '10px', padding: '12px 20px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop: '10px', boxShadow: '2px 2px 0px black' }}>
            Registrarse
          </button>
        </form>

        {statusMessage && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ff5252', color: 'white', border: '2px solid black', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }}>
            {statusMessage}
          </div>
        )}

        {/* LINK BACK TO LOGIN */}
        <p style={{ marginTop: '25px', fontSize: '15px', fontWeight: 'bold' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={{ color: '#1e88e5', textDecoration: 'underline' }}>
            Inicia sesión aquí
          </Link>
        </p>
        
      </div>
    </div>
  );
}