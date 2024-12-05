import { Navigate, Route, Routes } from 'react-router-dom';
import { SteamPage } from '../pages';
import {Article} from '../components/Article';
import { EditArticle } from '../pages/EditArticle';
import { Articles } from '../pages/Articles';
import { DeleteDialog } from '../views/DeleteDialog';
import { AddArticle } from '../pages/AddArticle';
import AdminDashboard from '../pages/AdminDashboard';
import { UpdateUser } from '../pages/UpdateUser';
import { UnauthorizedPage, NotFoundPage } from '../pages/errors/';
import { PostsList } from '../components/PostsList';
import Comments from '../components/Comments';


export const SteamRoutes = () => {

  const AdminRoute = ({ element }) => {

    const user = localStorage.getItem('user')
    const userObject = JSON.parse(user);
    const rolName = userObject.role_name
    const isAdmin = rolName === 'Admin';

    return isAdmin ? element : <Navigate to="/unauthorized" replace />;
  };

  const CreatorRoute = ({ element }) => {
    const user = localStorage.getItem('user')
    const userObject = JSON.parse(user);
    const rolName = userObject.role_name
    
    const isCreator = rolName === 'Creator';


    return isCreator ? element : <Navigate to="/unauthorized" replace />;
  };

  return (
    <Routes>
        <Route path="/" element={<SteamPage/>}/>

        <Route path="/:category/publications/:id" element={<Article />} />
        <Route path="/publications/:id" element={<Article />} />
        <Route path="/publications" element={<PostsList />} />

        <Route path='/dashboard' element={<CreatorRoute element={<Articles/>}/>}/>
        <Route path='/publications/update/:id' element={<CreatorRoute element={<EditArticle/>}/>}/>
        <Route path='/publications/add' element={<CreatorRoute element={<AddArticle/>}/>}/>

        <Route path='/comments/:id' element={<Comments/>}/>

        <Route path='/admin/dashboard' element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path='/admin/updateUser/' element={<AdminRoute element={<UpdateUser/>} />} />


        <Route path='/unauthorized' element={<UnauthorizedPage/>}/>
        <Route path='/not-found' element={<NotFoundPage/>}/>
        {/*<Route path="/*" element={<Navigate to="/"/>}/>*/}
    </Routes>
  )
}
