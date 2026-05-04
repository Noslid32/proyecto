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

  const colors = {
    blue: '#2c5caa',
    mint: '#20dca3',
    background: '#eef1f6',
    cardBg: '#ffffff',
    textDark: '#2c3e50',
    textLight: '#64748b',
    border: '#e2e8f0'
  };

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

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ text: "Guardando cambios...", type: "info" });
    try {
      let photoURL = user.photoURL;

      if (imageFile) {
        const imageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(imageRef, imageFile);
        photoURL = await getDownloadURL(imageRef);
      }

      await updateProfile(user, { displayName: name, photoURL: photoURL });

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      setMessage({ text: "¡Perfil actualizado con éxito!", type: "success" });
      setTimeout(() => navigate('/perfil'), 2000);
    } catch (error) {
      console.error(error);
      setMessage({ text: "Error: No se pudo actualizar el perfil. Si cambiaste la contraseña, tal vez debas iniciar sesión nuevamente.", type: "error" });
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', fontSize: '15px', border: `1px solid ${colors.border}`, 
    borderRadius: '10px', backgroundColor: '#f8f9fb', outline: 'none', boxSizing: 'border-box', color: colors.textDark
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      
      <div style={{ backgroundColor: colors.cardBg, padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: `1px solid ${colors.border}` }}>
        
        <h2 style={{ fontWeight: '800', fontSize: '26px', color: colors.blue, margin: '0 0 25px 0', textAlign: 'center' }}>Editar Perfil</h2>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Avatar Edit */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: `3px solid ${colors.mint}`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', color: colors.blue, overflow: 'hidden', backgroundColor: '#f8f9fb' }}>
              {previewUrl ? <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <VscAccount />}
            </div>
            
            <label style={{ backgroundColor: '#f1f5f9', color: colors.textDark, padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: `1px solid ${colors.border}` }}>
              Cambiar Foto
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Name Field if want to modify */}
          <div>
            <label style={{ fontWeight: '600', fontSize: '13px', color: colors.textDark, display: 'block', marginBottom: '6px' }}>Nombre a mostrar</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
          </div>

          {/* Hide the new password field if the user logged in with Google */}
          {user?.providerData[0]?.providerId === 'password' && (
            <div>
              <label style={{ fontWeight: '600', fontSize: '13px', color: colors.textDark, display: 'block', marginBottom: '6px' }}>Nueva Contraseña</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Dejar en blanco para no cambiar" style={inputStyle} />
            </div>
          )}

          {message.text && (
            <div style={{ padding: '12px', backgroundColor: message.type === 'error' ? '#fef2f2' : message.type === 'info' ? '#eff6ff' : '#ecfdf5', color: message.type === 'error' ? '#ef4444' : message.type === 'info' ? '#3b82f6' : '#059669', borderRadius: '8px', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
            <button type="button" onClick={() => navigate('/perfil')} style={{ flex: 1, backgroundColor: 'transparent', color: colors.textLight, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px', fontWeight: '600', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" style={{ flex: 1, backgroundColor: colors.mint, color: colors.textDark, border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(32, 220, 163, 0.3)' }}>
              Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}