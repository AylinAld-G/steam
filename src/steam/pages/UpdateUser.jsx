import React from 'react'
import {Button, CssBaseline,TextField, Box,Typography,Container, Avatar, Paper, createTheme, ThemeProvider, InputLabel, OutlinedInput, InputAdornment, IconButton, Grid, styled, Select, MenuItem, Stack, Alert, Snackbar, Collapse} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useAuthStore } from '../../hooks';
import Dot from '../components/Dot';
import { useState } from 'react';

const sections = [
  { title: 'science', url: '/science', icon: '../../../public/images/scienceIcon.png' },
  { title: 'tech', url: '/tech', icon: '../../../public/images/technoIcon.png'  },
  { title: 'eng', url: '/engine', icon: '../../../public/images/engineIcon.png'  },
  { title: 'art', url: '/art', icon: '../../../public/images/artIcon.jpg'  },
  { title: 'math', url: '/math', icon: '../../../public/images/mathIcon.jpg'  }
];

const theme = createTheme();

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const AlertM = React.forwardRef(function AlertM(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});


const UserStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 'true':
      color = 'success';
      title = 'Verificado';
      break;
    case 'false':
      color = 'error';
      title = 'No verificado';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography variant='h6' color='#000' sx={{fontFamily:'Didact Gothic, sans-serif'}}>{title}</Typography>
    </Stack>
  );
};

UserStatus.propTypes = {
  status: PropTypes.bool
};

export const UpdateUser = () => {
  // Obtener el parámetro userId de la URL
  const { user_uuid } = useParams();
  const {user, updateUser} = useAuthStore();
  const {t} = useTranslation();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showPassAlert, setPassAlert] = useState(false);

  const [formValues, setFormValues] = useState({
    user_uuid: user.user_uuid,
    username: user.username,
    email: user.email,
    password: user.password,
    role_id: user.role_id,
});

const onInputChanged = ({target}) => {
  if (target.name === 'password') {
    if (target.value.length < 8 && target.value.length > 0) {
      setPassAlert(true)
    }else{
      setPassAlert(false)
    }
  }
  setFormValues({
    ...formValues,
    [target.name]: target.value
  });
}

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = (event) => {
    event.preventDefault();
    //updateUser(user_uuid, user);
    console.log(formValues);
    setShowSuccessAlert(true);
    
  }

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Detecta si la pantalla es de 840px o menos
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 840);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Container maxWidth="lg">
      <Header title="STEAM" sections={sections.map(
        section => ({ title: t(section.title), url: section.url, icon: section.icon })
        )}/>
        <Container component="main" maxWidth="md">
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }}}>
          <Typography variant='h3' sx={{fontFamily:'Didact Gothic, sans-serif', marginBottom: 4,
            '@media (max-width: 380px)': {
              fontSize: '2rem'}}}>
                Información de usuario
            </Typography>
          {/*<Avatar sx={{ m: 1, width: 110, height: 110, marginTop:0, marginRight:0 }}></Avatar>*/}
          <form onSubmit={onSubmit}>
            <div key={user_uuid}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={isMobile ? 12 : 6}>
                  <Item>
                    <Container maxWidth="xs">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        '& .MuiTextField-root': { m: 1, },
                      }}
                    >
                      <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left'}}>ID de usuario</Typography>
                      <TextField
                      required
                      fullWidth
                      value={user.user_uuid}
                      name='user_uuid'
                      onChange={onInputChanged}
                      />
                      <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left'}}>Nombre de usuario</Typography>
                      <TextField
                      required
                      id="outlined-required"
                      fullWidth
                      value={user.username}
                      name='username'
                      onChange={onInputChanged}
                      />
                      <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left'}}>Email</Typography>
                      <TextField
                      autoComplete="email"
                      required
                      id="outlined-required"
                      fullWidth
                      value={user.email}
                      name='email'
                      onChange={onInputChanged}
                      />
                      <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left'}}>Contraseña</Typography>
                      <InputLabel htmlFor="outlined-adornment-password"></InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        required
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
                        value={user.password}
                        name='password'
                        fullWidth
                        autoComplete='current-password'
                        onChange={onInputChanged}
                        sx={{m:1}}
                      />
                      {showPassAlert &&(
                          <Alert severity="error" sx={{ mb: 2 }}>
                          La contraseña es muy corta
                          </Alert>
                      )}
                      {isMobile ?(
                        <>
                        <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left'}}>Rol de usuario</Typography>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          required
                          value={user.role_id}
                          fullWidth
                          onChange={onInputChanged}
                          sx={{border:"none", fontFamily: 'Didact Gothic, sans-serif',
                          display: 'inline-flex',
                          padding: 0,
                          '&.MuiSelect-select.MuiSelect-select': { 
                            fontFamily: 'Didact Gothic, sans-serif'
                          }, 
                          '&.MuiMenu-list': { fontFamily: 'Didact Gothic, sans-serif'}
                          }}
                        >
                          <MenuItem value="Admin">Administrador</MenuItem>
                          <MenuItem value="Creator">Creador de contenido</MenuItem>
                        </Select>
                        <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left'}}>Status</Typography>
                        <UserStatus status={user.verified} />
                        </>
                      ):null}
                      </Box>
                    </Container>
                  </Item>
                </Grid>

              {!isMobile ?(
                <Grid item xs={6}>
                <Item>
                  <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left'}}>Rol de usuario</Typography>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={user.role_id}
                    fullWidth
                    required
                    onChange={onInputChanged}
                    sx={{border:"none", fontFamily: 'Didact Gothic, sans-serif',
                    display: 'inline-flex',
                    padding: 0,
                    '&.MuiSelect-select.MuiSelect-select': { 
                      fontFamily: 'Didact Gothic, sans-serif'
                    }, 
                    '&.MuiMenu-list': { fontFamily: 'Didact Gothic, sans-serif'}
                    }}
                  >
                    <MenuItem value="Admin">Administrador</MenuItem>
                    <MenuItem value="Creator">Creador de contenido</MenuItem>
                  </Select>
                  <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', marginTop: 2, textAlign:'left'}}>Status</Typography>
                  <UserStatus status={user.verified} />
                </Item>
              </Grid>
              ): null}
              </Grid>

                <Stack spacing={2} direction="row" justifyContent="flex-end">
                  <Button variant="contained" type='submit'
                  sx={{fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", top: "15px", bottom: "18px"}}
                  >Guardar
                  </Button>
                  
                  <Link to='/admin/dashboard' style={{textDecoration: 'none'}}>
                    <Button variant="contained" color="error" 
                    sx={{fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", top: "15px", bottom: "18px"}}
                    >Cancelar
                    </Button>
                  </Link>
                </Stack>

              </div>
            </form>

            {/* Alert de éxito */}
            {showSuccessAlert && (
              <Snackbar open={showSuccessAlert} autoHideDuration={6000} onClose={() => setShowSuccessAlert(false)}>
                <AlertM severity="success" sx={{ width: '100%' }}>
                  Usuario actualizado correctamente
                </AlertM>
              </Snackbar>
            )}

          </Paper>
        </Container>
      </Container>
  </ThemeProvider>
  )
}
