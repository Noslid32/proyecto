import React from 'react';
import Button from './Button';

export default function UploadSection() {
  return (
    <div style={{ 
      border: '2px dashed #ccc', 
      borderRadius: '10px', 
      padding: '50px', 
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h3>Upload your room photo</h3>
      <p>Drag and drop an image here, or click to browse.</p>
      <Button variant="primary">Choose File</Button>
    </div>
  );
}