import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { StoreProvider } from './store/store';
import Home from './pages/Home';
import Admin from './pages/Admin';

export default function App() {
  return <StoreProvider><HashRouter><Routes>
    <Route path="/admin" element={<Admin />} />
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<Navigate to="/#who-we-are" replace />} />
      <Route path="/our-story" element={<Navigate to="/#where-it-began" replace />} />
      <Route path="/craft/*" element={<Navigate to="/#the-thread" replace />} />
      <Route path="/journal/*" element={<Navigate to="/#what-we-do" replace />} />
      <Route path="/visit" element={<Navigate to="/#the-thread" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes></HashRouter></StoreProvider>;
}
