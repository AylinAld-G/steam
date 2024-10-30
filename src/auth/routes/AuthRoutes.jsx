import { Route, Routes, Navigate } from 'react-router-dom';
import  LoginPage  from '../pages/LoginPage';
import  SignUp  from '../pages/SignUp';
import { VerificationCode } from '../pages/VerificationCode';


export const AuthRoutes = () => {
  return (
    <Routes>
        <Route path="login" element={<LoginPage/>}/>
        <Route path="" element={<SignUp/>}/>
        <Route path=':uid/redeem-code' element={<VerificationCode/>}/>

    </Routes>
  )
}
