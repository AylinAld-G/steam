import { useDispatch, useSelector } from 'react-redux';
import steamApi  from '../api/steamApi';
import Swal from 'sweetalert2';
import { onAddNewArticle, onAddNewComment, onDeleteArticle, onDeleteComment, onLoadArticles, onLoadComments, onSetActiveArticle, onUpdateArticle, onUpdateComment } from '../store/steam/steamSlice';
import { useCallback } from 'react';
import Cookies from 'js-cookie';


export const useSteamStore = () => {
  
    const dispatch = useDispatch();
    const { publications, activeArticle, comments, activeComment, isLoadingArticles } = useSelector( state => state.steam );
    const { user } = useSelector( state => state.auth );

    const setActiveArticle = useCallback( (steamArticle ) => {
        dispatch( onSetActiveArticle( steamArticle ) )
    },[dispatch])

    const startSavingArticle = useCallback(async( steamArticle ) => {

        try {
            // Todo bien
            const accessToken = Cookies.get('access_token')
            if( steamArticle.id_publication ) {
                // Actualizando
                await steamApi.put(`/publications/update/${steamArticle.id_publication}`, steamArticle, {headers: {Authorization: `${accessToken}`}})
                dispatch( onUpdateArticle({ ...steamArticle, user }) );
                return;

            } 

            // Creando
            const {data} = await steamApi.post('/publications/add', steamArticle, {headers: {Authorization: `${accessToken}`}});
            dispatch( onAddNewArticle({ ...steamArticle, id: data.id_publication, user }) );
        
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }

    },[dispatch, user])


    const startDeletingArticle = async () => {
        console.log(activeArticle)
        try {
            const accessToken = Cookies.get('access_token');
            await steamApi.delete(`/publications/delete/${activeArticle[0]}`, {headers: { Authorization: `${accessToken}` }});
            dispatch(onDeleteArticle());
            Swal.fire('Éxito', 'El artículo fue eliminado correctamente.', 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error al eliminar', error.msg || 'Error desconocido', 'error');
        }
    };

    const startLoadingArticles = async() => {
        try{
            const {data} = await steamApi.get('/publications');
            
            dispatch(onLoadArticles(data.publications));

        } catch(error){
            console.log('Error cargando artículos');
            console.log(error)
        }
    }


    const setActiveComment = ( steamComment ) => {
        dispatch( onSetActiveArticle( steamComment ) )
    }

    const startSavingComment = async( steamComment ) => {
        const accessToken = Cookies.get('access_token')
        try {

            if( steamComment.id_comment) {
                console.log(steamComment)
                // Actualizando
                await steamApi.put(`/comments/update/${steamComment.id_comment}`, steamComment, {headers:{Authorization: `${accessToken}`}})
                dispatch( onUpdateComment({ ...steamComment, user }) );
                return;

            } 

            // Creando
            const {data} = await steamApi.post('/comments/add', steamComment, {headers:{Authorization: `${accessToken}`}});
            dispatch( onAddNewComment({ ...steamComment, id: data.id_comment, user }) );
        
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }

    }

    const startDeletingComment = async() => {
        try {
            const accessToken = Cookies.get('access_token')
            console.log(activeComment);
            await steamApi.delete(`/comments/delete/${activeComment[0]}`, {headers:{Authorization: `${accessToken}`}})
            dispatch( onDeleteComment() );
            console.log('borrado')

        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.msg, 'error');
        }

    }


    const startLoadingComments = async(id_publication) => {
        try{
            const {data} = await steamApi.get(`/comments/${id_publication}`);
            dispatch(onLoadComments(data.comments));
            console.log("Hello");

        } catch(error){
            console.log('Error cargando comentarios');
            console.log(error)
        }
    }


    return {
        //* Propiedades
        activeArticle,
        publications,
        hasArticleSelected: !!activeArticle,
        activeComment,
        comments,
        isLoadingArticles,

        //* Métodos
        startDeletingArticle,
        setActiveArticle,
        startSavingArticle,
        startLoadingArticles,
        startLoadingComments,
        setActiveComment,
        startSavingComment,
        startDeletingComment,
        
    }
}
