import * as React from 'react';
import {Avatar,Button,CssBaseline,TextField,Grid,Box,Typography,Container} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { useAuthStore, useForm } from '../../hooks';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const theme = createTheme();

const registerFormFields = {
  registerName: '',
  registerPassword: ''
}

export default function SignUp() {

  const { startRegister, errorMessage } = useAuthStore();
  const { registerName, registerPassword, onInputChange:onRegisterInputChange } = useForm(registerFormFields);
  
  const registerSubmit = (event) => {
    event.preventDefault();
    startRegister({
      username: registerName, 
      password: registerPassword
    })
}

useEffect(() => {
  if(errorMessage !== undefined){
    Swal.fire('Error en la autenticación', errorMessage, 'error' );
  }

}, [errorMessage])


/*const registerSubmit = (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({
    name: data.get('name'),
    email: data.get('email'),
    password: data.get('password'),
    password2: data.get('password2')
  });
};*/


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registro
          </Typography>
          <Box component="form" noValidate onSubmit={registerSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="registerName"
                  required
                  value={registerName}
                  onChange={onRegisterInputChange}
                  fullWidth
                  id="username"
                  label="Nombre de usuario"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="registerPassword"
                  label="Contraseña"
                  type="password"
                  id="password"
                  value={registerPassword}
                  onChange={onRegisterInputChange}
                  autoComplete="new-password"
                />
              </Grid>


            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Crear cuenta
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/auth/login">¿Ya tienes una cuenta? Inicia sesión</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}