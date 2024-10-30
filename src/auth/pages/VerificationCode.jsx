import * as React from 'react';
import {Button, CssBaseline,TextField, Box,Typography,Container, Avatar, Paper, Alert, IconButton, Collapse} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuthStore, useForm } from '../../hooks';
import { Close, VpnKey } from '@mui/icons-material';
import { useState } from 'react';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>
      {'Copyright © '}
      <Link to="/" color="inherit" sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>
        STEAM Intercultural
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();


export const VerificationCode = () => {
    const { checkVerificationCode, errorMessage } = useAuthStore();

    const { uid } = useParams();
    const location= useLocation();


    const [formValues, setFormValues] = useState({
      code: ''
    });

    const [loading, setLoading] = useState(false);

  const onInputChanged = (event) => {
    const inputValue = event.target.value;

    const validNumber = /^\d*$/; // Expresión regular para permitir solo números
    if (validNumber.test(inputValue)) {
      setFormValues({ ...formValues, code: inputValue });
    }
  }

    const {t} = useTranslation();
    const [showWrongAlert, setShowWrongAlert] = useState(false);
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();

    const codeSubmit = async (event) => {
        event.preventDefault();
        if (formValues.code.length < 6) {
          setShowWrongAlert(true)
        } else {
          try {
            setLoading(true); // Mostrar LinearProgress al iniciar la verificación
            await checkVerificationCode({ uid: uid, code: formValues.code });
            navigate(`/users/${uid}/redeem-code`, { replace: true });
            console.log(formValues.code);
          } finally {
            setLoading(false);
          }
        }
    }
    
    useEffect(() => {
      if(errorMessage !== undefined){
        Swal.fire('Error en la autenticación', errorMessage, 'error' );
      }
    
    }, [errorMessage])

  
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        
        {loading && (
          <Box sx={{ width: '100%', marginTop: '30px' }}>
            <LinearProgress />
          </Box>
        )}
        
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <Typography component="h1" variant="h5" sx={{ fontFamily: 'Didact Gothic, sans-serif', textAlign: 'center'}}>Código de verificación</Typography>
        <Avatar sx={{ m: 1, width: 60, height: 60, marginTop: '30px', marginBottom:'30px'}}>
            <VpnKey />
          </Avatar>
          {showWrongAlert &&(
            <Collapse in={open}>
             <Alert severity="error" 
               action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
            >
            El código debe ser de 6 dígitos
            </Alert>
            </Collapse>
          )}
        <Typography variant="h6" align="center" color="text.secondary" sx={{ fontFamily: 'Didact Gothic, sans-serif'}}>
            Se acaba de enviar un código de verificación de 6 dígitos a su correo electrónico
        </Typography>
        <form onSubmit={codeSubmit}>
          <TextField
            label=" "
            required
            name='code'
            value={formValues.code}
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={onInputChanged}
            inputProps={{
              maxLength: 6,       // No más de 6 dígitos
            }}
          />

            <div style={{textAlign:"center"}}>
          <Button variant="contained" color="primary" type='submit' sx={{marginTop:'30px', fontFamily: "Didact Gothic, sans-serif"}}>
            Verificar
          </Button>
          </div>
        </form>

        </Box>
        </Paper>
        </Container>
      </ThemeProvider>
    );
}
