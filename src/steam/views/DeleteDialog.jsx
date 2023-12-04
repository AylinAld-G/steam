import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider, createTheme } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';

const theme = createTheme();

export const DeleteDialog = () => {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
      setOpen(false);
      <Link to={'/dashboard'}></Link>
    };
      
    
    const handleDelete = (event) => {
      event.stopPropagation();
      //startDeletingArticle();
    }

  return (
    <ThemeProvider theme={theme}>
    <Dialog
        open={open}
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
            <Button onClick={handleDelete}>
            Aceptar
            </Button>
        </DialogActions>
    </Dialog>
    </ThemeProvider>
  )
}
