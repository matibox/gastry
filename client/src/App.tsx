import { Route, Routes } from 'react-router-dom';
import { useIsMobile } from './hooks/useIsMobile';

// components
import { MobileMenu } from './components/MobileMenu/MobileMenu';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';

// pages
import { Favourites } from './pages/Favourites/Favourites';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Menu } from './pages/Menu/Menu';
import { Profile } from './pages/Profile/Profile';
import { Recipe } from './pages/Recipe/Recipe';
import { Recipes } from './pages/Recipes/Recipes';
import { Search } from './pages/Search/Search';
import { Signup } from './pages/Signup/Signup';

function App() {
  const { isMobile } = useIsMobile();

  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/search' element={<Search />} />
        <Route path='/favourites' element={<Favourites />} />
        <Route path='/recipes' element={<Recipes />} />
        <Route path='/recipes/:id' element={<Recipe />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/menu' element={<Menu />} />
      </Routes>
      <Footer />
      {isMobile && <MobileMenu />}
    </div>
  );
}

export default App;
