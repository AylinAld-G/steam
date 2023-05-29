import { Route, Routes, Navigate } from 'react-router-dom';
import {SteamRoutes} from '../steam/routes/SteamRoutes';
import {AuthRoutes} from '../auth/routes';


export const AppRouter = () => {

  return (
    <Routes>
      
        <Route path="/*" element={<SteamRoutes/>}/>
      
        <Route path="/auth/*" element={<AuthRoutes/>}/>

      {/*Login y Registro */}
      {/*<Route path="/auth/login/" element={<LoginPage/>}/>
      <Route path="auth/login/*" element={<Navigate to="auth/login"/>}/>

      <Route path="auth/new/" element={<SignUp/>}/>
      <Route path="auth/new/*" element={<Navigate to="auth/new"/>}/>*/}

    </Routes>
  )
}