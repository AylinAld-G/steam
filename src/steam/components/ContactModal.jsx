import { Box, Button, Container, Modal, TextField, Typography, Stack, Alert, Snackbar } from '@mui/material';
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser'


export const ContactModal = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { t } = useTranslation();

    const form = useRef();
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

    const handleCloseMessage = () => {
        setAlert({ ...alert, show: false });
    };

    const onSubmit = ( event ) => {
    event.preventDefault();
    emailjs.sendForm('service_ooaaktm', 'template_5klfwy8', form.current, '9lM6fnT9X2zl0ZTIN').then((result) => {
        console.log(result.text);
        setAlert({ show: true, type: 'success', message: t("sentMssg") });
      }, (error) => {
          setAlert({ show: true, type: 'error', message: t("errorMssg") });

      });

}


  return (
    <>
    <Button variant="contained" onClick={handleOpen} sx={{fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px" }}>{t("contBtn")}</Button>
    {alert.show && (
        <Snackbar open={alert.show} autoHideDuration={6000} onClose={handleCloseMessage}>
            <Alert variant="filled" onClose={handleCloseMessage} severity={alert.type} sx={{ width: '100%' }}>
            {alert.message}
            </Alert>
      </Snackbar>
    )}
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
    <form ref={form} onSubmit={ onSubmit }>
    <Box 
        sx={{
        '& .MuiTextField-root': { m: 1 },
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "90%",
        maxWidth: 700,
        bgcolor: 'background.paper',
        border: '1px solid grey',
        boxShadow: 24,
        borderRadius: '2%',
        p: 2,
        '@media (max-width: 300px)': {
            maxHeight: '87%', // Cambiar el alto máximo 
          },
        }}
        noValidate
        autoComplete="off"
    >
        <Container>
        <Typography id="modal-modal-title" variant="h4" component="h2" align="center" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
            {t("mssgTxt")}
        </Typography>
        <Typography id="modal-modal-description" align="center" sx={{ mt: 2, fontFamily: 'Didact Gothic, sans-serif'  }}>
            {t("mssgDesc")}
        </Typography>
        </Container>

        <Stack spacing={2} direction="column" >
            <TextField
                id="filled-multiline-flexible"
                label={t("name")}
                name='user_name'
                maxRows={4}
                variant="filled"
                sx={{fontFamily: 'Didact Gothic, sans-serif' }}
            />
            <TextField
                id="filled-textarea"
                label="Correo"
                name='user_email'
                placeholder="nombre@algo.com"
                variant="filled"
                sx={{fontFamily: 'Didact Gothic, sans-serif', maxWidth:"100%" }}
            />
            <TextField
                id="fullWidth"
                label={t("message")}
                name='message'
                multiline
                rows={5}
                variant="filled"
 
                fullWidth
                sx={{maxWidth:"97%", fontFamily: 'Didact Gothic, sans-serif' }}
            />
        
        </Stack>
            <div style={{textAlign:"center"}}>
            <Button variant="contained" type='submit'
            sx={{fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px"}}>
                {t("send")}
            </Button>
            </div>
    </Box>
    </form>
    </Modal>
    </>

  )
}
