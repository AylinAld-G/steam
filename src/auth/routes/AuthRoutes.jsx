import { Route, Routes, Navigate } from 'react-router-dom';
import  LoginPage  from '../pages/LoginPage';
import  SignUp  from '../pages/SignUp';


export const AuthRoutes = () => {
  return (
    <Routes>
        <Route path="login" element={<LoginPage/>}/>
        <Route path="new" element={<SignUp/>}/>

    </Routes>
  )
}