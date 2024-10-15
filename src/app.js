import React from 'react';
import { Box } from '@chakra-ui/react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Headers from './components/Header';
import SignUp from './pages/Signup';
import OTP from './pages/OTP';
import ForgotPassword from './pages/ForgotPassword';
import PasswordConfirmation from './pages/PasswordConfirmation';
import SignIn from './pages/Signin';
import RecipeList from './pages/RecipeList';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import ProfilePage from './pages/ProfilePage';
import AddRecipe from './pages/AddRecipe';
import MyRecipes from './pages/MyRecipes';
import ProfileList from './pages/ProfileList';
import EditProfile from './pages/EditProfile';
import ChatSidebar from './pages/ChatSidebar';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Box>
      <Headers />
      <Routes>
        <Route path='/' element={<Navigate to='/signin' />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/otp-verify' element={<OTP />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/forgot-password/:txnId' element={<PasswordConfirmation />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/recipes' element={<RecipeList />} />
        <Route path='/recipe/:id' element={<RecipeDetailsPage />} />
        <Route element={<ProfilePage />}>
          <Route path='/profile/recipe/add' element={<AddRecipe />} />
          <Route path='/profile/recipes' element={<MyRecipes />} />
          <Route path='/profile/favourites' element={<MyRecipes />} />
          <Route path='/profile/following' element={<ProfileList />} />
          <Route path='/profile/follower' element={<ProfileList />} />
          <Route path='/profile/list' element={<ProfileList />} />
          <Route path='/profile/edit' element={<EditProfile />} />
          <Route path='/profile/chat' element={<ChatSidebar />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Box>
  );
};

export default App;
