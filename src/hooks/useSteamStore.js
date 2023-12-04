import { useDispatch, useSelector } from 'react-redux';
import steamApi  from '../api/steamApi';
import Swal from 'sweetalert2';
import { onAddNewArticle, onAddNewComment, onDeleteArticle, onDeleteComment, onLoadArticles, onLoadComments, onSetActiveArticle, onUpdateArticle, onUpdateComment } from '../store/steam/steamSlice';


export const useSteamStore = () => {
  
    const dispatch = useDispatch();
    const { publications, activeArticle, comments, activeComment } = useSelector( state => state.steam );
    const { user } = useSelector( state => state.auth );

    const setActiveArticle = ( steamArticle ) => {
        dispatch( onSetActiveArticle( steamArticle ) )
    }

    const startSavingArticle = async( steamArticle ) => {
        
        try {
            // Todo bien
            if( steamArticle.publication_uuid ) {
                // Actualizando
                await steamApi.put(`/publications/update/${steamArticle.id_publication}`, steamArticle)
                dispatch( onUpdateArticle({ ...steamArticle, user }) );
                return;

            } 

            // Creando
            const {data} = await steamApi.post('/publications/add', steamArticle);
            dispatch( onAddNewArticle({ ...steamArticle, id: data.id_publication, user }) );
        
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }

    }

    const startDeletingArticle = async() => {
        try {
            await steamApi.delete(`/publications/delete/${activeArticle.id_publication}`)
            dispatch( onDeleteArticle() );

        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }

    }

    const startLoadingArticles = async() => {
        try{
            const {data} = await steamApi.get('/publications');
            dispatch(onLoadArticles(data));
            console.log(data);

        } catch(error){
            console.log('Error cargando artículos');
            console.log(error)
        }
    }


    const setActiveComment = ( steamComment ) => {
        dispatch( onSetActiveArticle( steamComment ) )
    }

    const startSavingComment = async( steamComment ) => {
        
        try {
            // Todo bien
            if( steamComment.comment_uuid ) {
                // Actualizando
                await steamApi.put(`/comments/update/${steamComment.comment_uuid}`, steamComment)
                dispatch( onUpdateComment({ ...steamComment, user }) );
                return;

            } 

            // Creando
            const {data} = await steamApi.post('/comments/add', steamComment);
            dispatch( onAddNewComment({ ...steamComment, id: data.comment_uuid, user }) );
        
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }

    }

    const startDeletingComment = async() => {
        try {
            await steamApi.delete(`/comments/delete/${activeComment.comment_uuid}`)
            dispatch( onDeleteComment() );

        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }

    }


    const startLoadingComments = async(id_publication) => {
        try{
            const {data} = await steamApi.get(`/comments/${id_publication}`);
            dispatch(onLoadComments(data.id_publication));
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

        //* Métodos
        startDeletingArticle,
        setActiveArticle,
        startSavingArticle,
        startLoadingArticles,
        startLoadingComments,
        setActiveComment,
        startSavingComment,
        startDeletingComment
    }
}