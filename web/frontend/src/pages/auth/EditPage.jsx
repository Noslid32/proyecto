import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage } from "../../lib/firebase/config";
import { onAuthStateChanged, updatePassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { VscAccount } from "react-icons/vsc";

export default function EditPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.displayName) setName(currentUser.displayName);
        if (currentUser.photoURL) setPreviewUrl(currentUser.photoURL);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setMessage({ text: "Guardando cambios (esto puede tardar unos segundos)...", type: "info" });
    
    try {
      let currentPhotoURL = user.photoURL;

      if (imageFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, imageFile);
        currentPhotoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { 
        displayName: name,
        photoURL: currentPhotoURL
      });

      if (newPassword.length > 0) {
        if (newPassword.length < 6) {
          setMessage({ text: "La contraseña debe tener al menos 6 caracteres.", type: "error" });
          return;
        }
        await updatePassword(user, newPassword);
      }

      setMessage({ text: "¡Perfil actualizado con éxito!", type: "success" });
      
      setTimeout(() => navigate('/perfil'), 2000);

    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ text: "Por seguridad, cierra sesión y vuelve a entrar para cambiar tu contraseña.", type: "error" });
      } else {
        setMessage({ text: "Error: " + error.message, type: "error" });
      }
    }
  };

  const isGoogleUser = user?.providerData.some(p => p.providerId === 'google.com');

  return (
    <div style={{ backgroundColor: '#1e88e5', minHeight: '80vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#a3a5c3', border: '3px solid black', borderRadius: '15px', padding: '40px', width: '100%', maxWidth: '450px', boxShadow: '6px 6px 0px black' }}>
        
        <h2 style={{ fontWeight: 'bold', fontSize: '28px', color: 'black', marginBottom: '5px', textAlign: 'center' }}>
          Editar Perfil
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '25px' }}>Actualiza tu información y foto</p>

        <form onSubmit={handleSaveChanges} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Change Profile Picture Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ 
              width: '100px', height: '100px', backgroundColor: '#1e88e5', border: '3px solid black', 
              borderRadius: '50%', marginBottom: '10px', display: 'flex', justifyContent: 'center', 
              alignItems: 'center', fontSize: '60px', color: 'black', overflow: 'hidden' 
            }}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <VscAccount />
              )}
            </div>
            
            <label style={{ cursor: 'pointer', backgroundColor: 'white', padding: '8px 15px', border: '2px solid black', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              Subir Foto
              {/* This input is hidden, the label acts as the button */}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Change Name */}
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nombre de Usuario:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              style={{ width: '90%', padding: '10px', border: '3px solid black', borderRadius: '8px', fontSize: '16px' }}
            />
          </div>

          {/* Change Password (Only for Email/Password users) */}
          {!isGoogleUser && (
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nueva Contraseña:</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Dejar en blanco para no cambiar"
                style={{ width: '90%', padding: '10px', border: '3px solid black', borderRadius: '8px', fontSize: '16px' }}
              />
            </div>
          )}

          {/* Status Message */}
          {message.text && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: message.type === 'error' ? '#ff5252' : '#4caf50', 
              color: 'white', 
              border: '2px solid black', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              textAlign: 'center' 
            }}>
              {message.text}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, backgroundColor: '#00e5ff', color: 'black', border: '3px solid black', borderRadius: '10px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px black' }}>
              Guardar
            </button>
            <button type="button" onClick={() => navigate('/perfil')} style={{ flex: 1, backgroundColor: '#9e9e9e', color: 'black', border: '3px solid black', borderRadius: '10px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '2px 2px 0px black' }}>
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}