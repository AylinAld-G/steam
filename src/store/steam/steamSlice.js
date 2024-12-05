import { createSlice } from '@reduxjs/toolkit';

export const steamSlice = createSlice({
    name: 'steam',
    initialState: {
        isLoadingArticles: true,
        publications: [ ],
        activeArticle: null,
        comments:[ ],
        activeComment: null,
        isLoadingComments: true
    },
    reducers: {
        onSetActiveArticle: ( state, { payload }) => {
            state.activeArticle = payload;
        },
        onAddNewArticle: ( state, { payload }) => {
            state.publications.push( payload );
            //state.activeArticle = null;
        },
        onUpdateArticle: (state, { payload }) => {
            state.publications = state.publications.map((publication) => {
              if (publication.id_publication === payload.id_publication) {
                return payload; 
              }
              return publication;
            });
        },
        onDeleteArticle: (state) => {
            if (state.activeArticle) {
                state.publications = state.publications.filter(
                    publication => publication.id_publication !== state.activeArticle.id_publication);}
            state.activeArticle = null;
        },
        onLoadArticles: ( state, {payload} ) => {
            state.isLoadingArticles = false;
            state.publications = payload;
        },
        onSetActiveComment: ( state, { payload }) => {
            state.activeComment = payload;
            console.log(payload);
        },
        onLoadComments: ( state, {payload} ) => {
            state.isLoadingComments = false;
            state.comments = payload;
        },
        onAddNewComment: ( state, { payload }) => {
            state.comments.push( payload );
            //state.activeComment = null;
        },
        onUpdateComment: ( state, { payload } ) => {
            state.comments = state.comments.map( comment => {
                if ( comment.id_comment === payload.id_comment ) {
                    return payload;
                }

                return comment;
            });
        },
        onDeleteComment: ( state ) => {
            if ( state.activeComment ) {
                state.comments = state.comments.filter( comment => comment.comment_uuid !== state.activeComment.comment_uuid );  //voy a regresar todos los comentarios cuyo ID sea diferente al del comment activo
            }
            state.activeComment = null;
        },
        
    }
});


// Action creators are generated for each case reducer function
export const { 
    onSetActiveArticle, 
    onAddNewArticle, 
    onUpdateArticle, 
    onDeleteArticle, 
    onLoadArticles,
    onSetActiveComment, 
    onAddNewComment, 
    onUpdateComment, 
    onDeleteComment, 
    onLoadComments,

} = steamSlice.actions;
