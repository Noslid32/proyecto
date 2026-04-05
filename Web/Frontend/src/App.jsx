import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PerfilPage from './pages/PerfilPage';
import AdvertisementPage from './pages/AdvertisementPage';
import StatisticsPage from './pages/StatisticsPage';
import MyRoomPage from './pages/MyRoomPage';

function App() {
  return ( 
    <BrowserRouter> 
    <div className='app-container' style={{ fontFamily: 'sans-serif' }}>
      <Navbar/>
      <main>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/my-room" element={<MyRoomPage/>}/>
          <Route path="/perfil" element={<PerfilPage/>}/>
          <Route path="/advertisement" element={<AdvertisementPage/>}/>
          <Route path="/statistics" element={<StatisticsPage/>}/>

        </Routes>
      </main>
      <Footer/>

    </div>
    </BrowserRouter>
  );
}

export default App
