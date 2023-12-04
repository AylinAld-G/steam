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
            state.activeArticle = null;
        },
        onUpdateArticle: ( state, { payload } ) => {
            state.publications = state.publications.map( publication => {
                if ( publication.id === payload.id ) {
                    return payload;
                }

                return publication;
            });
        },
        onDeleteArticle: ( state ) => {
            if ( state.activeArticle ) {
                state.publications = state.publications.filter( publication => publication.id !== state.activeArticle.id );  
                state.activeArticle = null;
            }
        },
        onLoadArticles: ( state, {payload = []} ) => {
            state.isLoadingArticles = false;
            //state.publications = payload;
            payload.forEach(publication => {
                const exists = state.publications.some(dbArticle => dbArticle.id === publication.id );
                if(!exists){
                    state.publications.push( publication )
                }
            });
        },
        onSetActiveComment: ( state, { payload }) => {
            state.activeComment = payload;
        },
        onLoadComments: ( state, {payload = []} ) => {
            state.isLoadingComments = false;
            //state.comments = payload;
            payload.forEach(comment => {
                const exists = state.comments.find(dbComment => dbComment.id === comment.id);
                if(!exists){
                    state.comments = [...state.comments, comment];
                }
            });
        },
        onAddNewComment: ( state, { payload }) => {
            state.comments.push( payload );
            state.activeComment = null;
        },
        onUpdateComment: ( state, { payload } ) => {
            state.comments = state.comments.map( comment => {
                if ( comment.id === payload.id ) {
                    return payload;
                }

                return comment;
            });
        },
        onDeleteComment: ( state ) => {
            if ( state.activeComment ) {
                state.comments = state.comments.filter( comment => comment.id !== state.activeComment.id );  //voy a regresar todos los comentarios cuyo ID sea diferente al del comment activo
                state.activeComment = null;
            }
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