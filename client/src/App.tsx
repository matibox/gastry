import { Route, Routes } from 'react-router-dom';
import { useIsMobile } from './contexts/isMobileContext';

// components
import { MobileMenu } from './components/MobileMenu/MobileMenu';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';

// pages
import { Favourites } from './pages/Favourites';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Menu } from './pages/Menu';
import { Profile } from './pages/Profile';
import { Recipe } from './pages/Recipe';
import { YourRecipes } from './pages/Recipes';
import { Search } from './pages/Search';
import { Signup } from './pages/Signup';

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
        <Route path='/recipes' element={<YourRecipes />} />
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
