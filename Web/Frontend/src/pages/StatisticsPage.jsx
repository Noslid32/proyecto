import React from 'react';

export default function StatisticsPage() {
  
  // A helper component to create our quick stat cards
  const StatCard = ({ title, number }) => (
    <div style={{
      backgroundColor: '#a3a5c3',
      border: '3px solid black',
      borderRadius: '10px',
      padding: '20px',
      flex: '1',
      minWidth: '120px',
      textAlign: 'center',
      boxShadow: '3px 3px 0px black'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>{title}</h4>
      <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#1e88e5', textShadow: '1px 1px 0px black' }}>
        {number}
      </p>
    </div>
  );

  // A helper component to build a single bar in our CSS chart
  const ChartBar = ({ height, day }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1 }}>
      <div style={{ 
        height: '150px', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'flex-end', 
        borderBottom: '2px solid black' 
      }}>
        <div style={{ 
          width: '100%', 
          height: height, 
          backgroundColor: '#00e5ff', 
          border: '2px solid black',
          borderBottom: 'none',
          borderRadius: '5px 5px 0 0',
          transition: 'height 0.5s ease'
        }}></div>
      </div>
      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{day}</span>
    </div>
  );

  return (
    <div style={{ 
      backgroundColor: '#1e88e5', 
      minHeight: '100vh', 
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      <h2 style={{ fontWeight: 'bold', fontSize: '32px', color: 'black', marginBottom: '30px' }}>
        Estadísticas
      </h2>

      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* ROW 1: Quick Stats Grid */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <StatCard title="Vistas Totales" number="1,248" />
          <StatCard title="Generadas (IA)" number="14" />
          <StatCard title="Mensajes" number="32" />
        </div>

        {/* ROW 2: The CSS Bar Chart */}
        <div style={{
          backgroundColor: '#a3a5c3',
          border: '3px solid black',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '5px 5px 10px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', textAlign: 'center' }}>Vistas de los últimos 7 días</h3>
          
          <div style={{ display: 'flex', gap: '10px', height: '180px' }}>
            <ChartBar height="40%" day="Lun" />
            <ChartBar height="70%" day="Mar" />
            <ChartBar height="50%" day="Mié" />
            <ChartBar height="90%" day="Jue" />
            <ChartBar height="30%" day="Vie" />
            <ChartBar height="80%" day="Sáb" />
            <ChartBar height="100%" day="Dom" />
          </div>
        </div>

      </div>
    </div>
  );
}