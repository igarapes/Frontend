import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { PrivateRoute } from './components/privateRoutes';
import { Login } from './pages/Login';
import { FirstAccess } from './pages/FirstAccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<PrivateRoute/>}>
          <Route path="/primeiro-acesso" element={<FirstAccess/>} />
          <Route path="/dashboard" element={<div className="p-8 text-center">Dashboard Principal</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;