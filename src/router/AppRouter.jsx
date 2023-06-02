import { Route, Routes } from 'react-router-dom';
import {SteamRoutes} from '../steam/routes/SteamRoutes';
import {AuthRoutes} from '../auth/routes';
import { useAuthStore } from '../hooks';


export const AppRouter = () => {

  const {status} = useAuthStore();

  return (
    <Routes>
      

      {
        (status==='authenticated')
        ? <Route path="/*" element={<SteamRoutes/>}/>
        : <Route path="/auth/*" element={<AuthRoutes/>}/>
      }

      <Route path='/*' element={<SteamRoutes/>}/>

    </Routes>
  )
}