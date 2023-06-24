
import { Routes, Route, useNavigate } from 'react-router-dom';

import Layout from "./components/Layout";

import Shop from './features/shop';
import SignIn from './features/auth/signIn';
import SignUp from './features/auth/signUp';
import Books from './features/books';
import Home from './features/home';

import { useAuthContext } from './hooks/useAuthContext'; // Import AuthContext
import Cart from './features/cart';

function App() {
  const navigate = useNavigate();
  const { session } = useAuthContext; // Access session from AuthContext

  // Function to check if the user is authenticated
  const isAuthenticated = () => {
    return session !== null;
  };

  // Function to handle unauthorized access
  const handleUnauthorizedAccess = () => {
    navigate('/signin'); // Redirect to sign-in page
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
          <Route path="/shop" element={isAuthenticated() ? <Shop /> : handleUnauthorizedAccess} />
          <Route path="/cart" element={isAuthenticated() ? <Cart /> : handleUnauthorizedAccess} />
          <Route path="/books/:id" element={isAuthenticated() ? <Books /> : handleUnauthorizedAccess}
          />
        </Route>
      </Routes >
    </>

  )
}

export default App
