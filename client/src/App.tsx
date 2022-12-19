import { Navigate, Route, Routes } from 'react-router-dom';
import { useIsMobile } from './contexts/isMobileContext';
import { useAuth } from './contexts/authContext';

// components
import { MobileMenu } from './components/MobileMenu/MobileMenu';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';

// pages
import { Favourites } from './pages/Favourites';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Menu } from './pages/Menu';
import { Recipe } from './pages/Recipe';
import { YourRecipes } from './pages/Recipes';
import { Search } from './pages/Search';
import { Signup } from './pages/Signup';
import { ProfileContent } from './features/Profile/ProfileContent';

function App() {
  const { isMobile } = useIsMobile();
  const authContext = useAuth();
  if (!authContext) return null;
  const { user } = authContext;

  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={
            <>
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path='/login'
          element={<>{user ? <Navigate to='/' /> : <Login />}</>}
        />
        <Route
          path='/signup'
          element={<>{user ? <Navigate to='/' /> : <Signup />}</>}
        />
        <Route path='/search' element={<Search />} />
        <Route path='/favourites' element={<Favourites />} />
        <Route path='/recipes' element={<YourRecipes />} />
        <Route path='/recipes/:id' element={<Recipe />} />
        <Route path='/profile' element={<ProfileContent />} />
        <Route path='/menu' element={<Menu />} />
      </Routes>
      {isMobile && <MobileMenu />}
    </div>
  );
}

export default App;
