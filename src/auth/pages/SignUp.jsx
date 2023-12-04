import * as React from 'react';
import {Avatar,Button,CssBaseline,TextField,Grid,Box,Typography,Container, OutlinedInput, InputLabel, InputAdornment, IconButton} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, Navigate } from "react-router-dom";
import { useEffect } from 'react';
import { useAuthStore, useForm } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link to="/" color="inherit">
        STEAM Intercultural
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const theme = createTheme();

const registerFormFields = {
  registerName: '',
  registerEmail: '',
  registerPassword: ''
}

export default function SignUp() {

  const { startRegister, errorMessage, } = useAuthStore();
  const { registerName, registerEmail, registerPassword, onInputChange:onRegisterInputChange } = useForm(registerFormFields);
  
  const {t} = useTranslation();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const registerSubmit = (event) => {
    event.preventDefault();
    //console.log({registerName, registerEmail, registerPassword} )
    startRegister({
      username: registerName,
      email: registerEmail, 
      password: registerPassword
    })
}


useEffect(() => {
  if(errorMessage !== undefined){
    Swal.fire('Error en la autenticación', errorMessage, 'error' );
  }

}, [errorMessage])


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
            {t("register")}
          </Typography>
          <Box component="form" noValidate onSubmit={registerSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  autoComplete="given-name"
                  name="registerName"
                  required
                  value={registerName}
                  onChange={onRegisterInputChange}
                  fullWidth
                  id="username"
                  label={t("userName")}
                  autoFocus
                />
              </Grid>

              <Grid item xs={12} >
                <TextField
                  autoComplete="email"
                  name="registerEmail"
                  required
                  value={registerEmail}
                  onChange={onRegisterInputChange}
                  fullWidth
                  id="email"
                  label="Correo"
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="outlined-adornment-password"></InputLabel>
                  <OutlinedInput
                    required
                    id='password'
                    label={t("psswd")}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    value={registerPassword}
                    name='registerPassword'
                    fullWidth
                    autoComplete='new-password'
                    onChange={onRegisterInputChange}
                  />
              </Grid>


            </Grid>
            <Button
              type="submit"
              href='verification'
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("createAcc")}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/auth/login">{t("loginLnk")}</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
