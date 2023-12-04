import * as React from 'react';
import {Avatar, Button, CssBaseline,TextField,Grid,Box,Typography,Container} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import {Link} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuthStore, useForm } from '../../hooks';

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

const loginFormFields = {
  loginName: '',
  loginPassword: ''
}

export default function LoginPage() {

  const { startLogin, errorMessage} = useAuthStore();

  const { loginName, loginPassword, onInputChange:onLoginInputChange } = useForm(loginFormFields);

  const loginSubmit = (event) => {
    event.preventDefault();
    startLogin({ 
      username: loginName, 
      password: loginPassword});
  };

  useEffect(() => {
    if(errorMessage !== undefined){
      Swal.fire('Error en la autenticación', errorMessage, 'error' );
    }
  
  }, [errorMessage])

  const { t } = useTranslation();

  /*const loginSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
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
            {t("login")}
          </Typography>
          <Box component="form" onSubmit={loginSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={t("userName")}
              name="loginName"
              value={loginName}
              onChange={onLoginInputChange}
              autoComplete="given-name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="loginPassword"
              label={t("psswd")}
              type="password"
              id="password"
              value={loginPassword}
              onChange={onLoginInputChange}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("login")}
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/auth/new">{t("signUp")}</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
