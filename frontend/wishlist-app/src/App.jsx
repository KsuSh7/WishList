import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BackgroundLogo from './components/BackgroundLogo';
import Home from './pages/Home';
import Auth from './pages/Auth';
import UserPage from './pages/UserPage';
import WishlistPage from './pages/WishlistPage';

function App() {
  return (
    <Router>
      <div className="appContainer">
        <BackgroundLogo />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/wishlist/:id" element={<WishlistPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
