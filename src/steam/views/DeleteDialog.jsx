import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider, createTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useSteamStore } from '../../hooks';
import { onSetActiveArticle } from '../../store/steam/steamSlice';
import { useDispatch } from 'react-redux';

const theme = createTheme();

export const DeleteDialog = ({ onClose }) => {
    const {startDeletingArticle, activeArticle, startLoadingArticles } = useSteamStore();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClose = () => {
      onClose();
      navigate('/dashboard');
    };

    const handleDelete = () => {
      if (activeArticle) {
          startDeletingArticle().then(()=>{
            startLoadingArticles()
          }); 
          dispatch(onSetActiveArticle(null))
      } else {
          console.log("No hay artículo activo");
      }
      onClose(); 
  };

  return (
    <ThemeProvider theme={theme}>
    <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
            {"¿Estás seguro de que quieres eliminar este artículo?"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Si eliminas este artículo ya no podrás recuperarlo
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} href='/dashboard'>Cancelar</Button>
            <Button onClick={handleDelete} >
            Aceptar
            </Button>
        </DialogActions>
    </Dialog>
    </ThemeProvider>
  )
}
