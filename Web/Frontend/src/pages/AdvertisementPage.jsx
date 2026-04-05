import React, { useState } from 'react';

export default function AdvertisementPage() {
  // 1. State for the input field and AI generation
  const [roomName, setRoomName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDescription, setAiDescription] = useState('');

  // 2. Fake AI Function: Pretends to analyze an image for 2 seconds
  const handleAiAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setAiDescription("🤖 AI Analysis: Esta es una habitación moderna con excelente iluminación natural, paredes de tono claro que dan sensación de amplitud, y una ventana con vista a la ciudad. Ideal para estudiantes o profesionales.");
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div style={{ 
      backgroundColor: '#1e88e5', 
      minHeight: '100vh', // Changed to 100vh so it fits all the new content
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      <h2 style={{ fontWeight: 'bold', fontSize: '32px', color: 'black', marginBottom: '20px' }}>
        Publicar Habitación
      </h2>

      <div style={{
        backgroundColor: '#a3a5c3', 
        border: '3px solid black',
        borderRadius: '15px',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px', // Adds even spacing between all sections
        boxShadow: '4px 4px 10px rgba(0,0,0,0.3)'
      }}>
        
        {/* FEATURE 1: Label and Name Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Nombre del Anuncio:</label>
          <input 
            type="text" 
            placeholder="Ej. Habitación luminosa en el centro..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '2px solid black',
              borderRadius: '8px',
              width: '95%' // Leaves a little padding on the side
            }}
          />
        </div>

        {/* FEATURE 2: Google Maps Embed (Static Example) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Ubicación en el Mapa:</label>
          <div style={{ border: '3px solid black', borderRadius: '10px', overflow: 'hidden', height: '200px' }}>
            {/* Free Google Maps iframe embed */}
            <iframe 
              title="Google Map"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy" 
              allowFullScreen 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123616.48805213454!2d-90.612543!3d14.6263592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8589a180655c3345%3A0x4a72c7815b867b25!2sGuatemala%20City%2C%20Guatemala!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            ></iframe>
          </div>
        </div>

        {/* FEATURE 3: AI Image Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <label style={{ fontWeight: 'bold', fontSize: '18px' }}>Foto de la Habitación:</label>
          
          {/* Mock Upload Box */}
          <div style={{
            backgroundColor: '#ffffff', height: '150px', border: '3px dashed black', borderRadius: '10px',
            display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#555', fontWeight: 'bold'
          }}>
            [ Sube tu foto aquí ]
          </div>

          {/* Generate AI Button */}
          <button 
            onClick={handleAiAnalysis}
            disabled={isAnalyzing} // Stops them from clicking it multiple times
            style={{
              backgroundColor: isAnalyzing ? '#888' : '#00e5ff', // Changes color when loading
              color: 'black', border: '2px solid black', borderRadius: '8px', padding: '10px',
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px'
            }}
          >
            {isAnalyzing ? "🧠 Analizando imagen..." : "✨ Generar Descripción con IA"}
          </button>

          {/* Displays the AI description if it exists */}
          {aiDescription && (
            <div style={{ 
              backgroundColor: 'white', padding: '15px', border: '2px solid black', 
              borderRadius: '8px', marginTop: '5px', fontStyle: 'italic', fontSize: '14px' 
            }}>
              {aiDescription}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button style={{
          backgroundColor: '#1e88e5', color: 'black', border: '3px solid black', borderRadius: '10px',
          padding: '12px 20px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
          width: '100%', boxShadow: '2px 2px 0px black', marginTop: '10px'
        }}>
          Publicar Anuncio
        </button>
        
      </div>
    </div>
  );
}