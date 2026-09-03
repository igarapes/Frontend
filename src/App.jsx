import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/primeiro-acesso" element={<div className="p-8 text-center">Tela de Primeiro Acesso em construção...</div>} />
        <Route path="/dashboard" element={<div className="p-8 text-center">Dashboard Principal</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;