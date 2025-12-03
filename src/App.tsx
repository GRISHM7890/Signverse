import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Interpreter from './pages/Interpreter';
import AvatarSpeak from './pages/AvatarSpeak';
import Academy from './pages/Academy';
import SOS from './pages/SOS';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="interpreter" element={<Interpreter />} />
          <Route path="avatar" element={<AvatarSpeak />} />
          <Route path="learn" element={<Academy />} />
          <Route path="sos" element={<SOS />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
