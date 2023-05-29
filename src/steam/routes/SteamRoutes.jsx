import { Route, Routes, Navigate } from 'react-router-dom';
import { SteamPage } from '../pages';


export const SteamRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<SteamPage/>}/>

        <Route path="/*" element={<Navigate to="/"/>}/>
    </Routes>
  )
}