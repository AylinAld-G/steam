import { Navigate, Route, Routes } from 'react-router-dom';
import { SteamPage } from '../pages';
import {Article} from '../components/Article';
import { Maths } from '../views/Maths';
import { Art } from '../views/Art';
import { Techno } from '../views/Techno';
import { Science } from '../views/Science';
import { Enginee } from '../views/Enginee';
import { EditArticle } from '../pages/EditArticle';
import { Articles } from '../pages/Articles';
import { DeleteDialog } from '../views/DeleteDialog';
import { AddArticle } from '../pages/AddArticle';
import AdminDashboard from '../pages/AdminDashboard';
import { UpdateUser } from '../pages/UpdateUser';
import { useAuthStore } from '../../hooks';
import { UnauthorizedPage, NotFoundPage } from '../pages/errors/';


export const SteamRoutes = () => {

  const {getRoles} = useAuthStore();

  const AdminRoute = ({ element }) => {
    const roles = getRoles();
    const isAdmin = Array.isArray(roles) && roles.includes('Admin');

    return isAdmin ? element : <Navigate to="/unauthorized" replace />;
  };

  const CreatorRoute = ({ element }) => {
    const roles = getRoles();
    const isCreator = Array.isArray(roles) && roles.includes('Creator');

    return isCreator ? element : <Navigate to="/unauthorized" replace />;
  };

  return (
    <Routes>
        <Route path="/" element={<SteamPage/>}/>

        <Route path="/math" element={<Maths />} />
        <Route path='/art' element={<Art/>}/>
        <Route path='/tech' element={<Techno/>}/>
        <Route path='/science' element={<Science/>}/>
        <Route path='/engine' element={<Enginee/>}/>

        <Route path=":category/publications/:id" element={<Article />} />
        <Route path="publications/:id" element={<Article />} />

        <Route path='/dashboard' element={<CreatorRoute element={<Articles/>}/>}/>
        <Route path='publications/update/:id' element={<CreatorRoute element={<EditArticle/>}/>}/>
        <Route path='publications/delete/:id' element={<CreatorRoute element={<DeleteDialog/>}/>}/>
        <Route path='publications/add' element={<CreatorRoute element={<AddArticle/>}/>}/>

        <Route path='/admin/dashboard' element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path='/admin/updateUser/' element={<AdminRoute element={<UpdateUser/>} />} />

        <Route path='/unauthorized' element={<UnauthorizedPage/>}/>
        <Route path='/not-found' element={<NotFoundPage/>}/>
        {/*<Route path="/*" element={<Navigate to="/"/>}/>*/}
    </Routes>
  )
}
