import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Button, CircularProgress, Container, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, createTheme, MenuItem, InputAdornment, Grid, styled, Select, useMediaQuery } from '@mui/material';
import { PersonAdd, Delete, Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';

import Dot from './Dot'
import Footer from './Footer';
import { useDispatch } from 'react-redux';

import { mutate } from 'swr'
import Cookies from 'js-cookie';
import steamApi from '../../api/steamApi';
import { onDeleteUser, onForceVerification, onUpdatePassword, onUpdateUser } from '../../store/auth/authSlice';
import { useRoles } from '../../hooks/useRoles';
import { useUsers } from '../../hooks/useUsers';



const theme = createTheme();

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const UserStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case true:
      color = 'success';
      title = 'Verificado';
      break;
    case false:
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
      <Typography>{title}</Typography>
    </Stack>
  );
};

UserStatus.propTypes = {
  status: PropTypes.bool
};


export const Users = () => {
    const accessToken = Cookies.get('access_token');

    const [selected] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery('(max-width: 840px)')
    const [formErrors, setFormErrors] = useState({});

  //inicializar valores de form
    const [formValues, setFormValues] = useState({
      uuid: '',
      username: '',
      email: '',
      password: '',
      new_password: '',
      role_id: '',
      verified: null
    });


  const {users=[], error, isLoading} = useUsers();

  const isSelected = (uuid) => selected.indexOf(uuid) !== -1;   //controlar selección de user por uid


  const handleRowHover = (uuid) => {
    if(uuid){
      setHoveredRow(uuid);
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);  //estado para ver/ocultar contraseña
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const [openDialog, setOpenDialog] = useState(false); //estado local, modal de eliminación
  const [openEditDialog, setOpenEditDialog] = useState(false);   //estado local, modal de edición de user
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);   //estado local, modal para cambiar contraseña


{/*==========ELIMINAR USER========= */}
  //abrir modal para eliminar user
  const handleDeleteClick = useCallback((uuid) => {
    //event.stopPropagation();
    setOpenDialog(true);
    setFormValues((prevState) => ({ ...prevState, uuid }));
  },[]);


  //cerrar modal para eliminar user
  const handleClose = () => {
    setOpenDialog(false);
  };


  //Request para eliminar usuario
  const deleteUser = async(uid) => {
    try {
      const {data} = await steamApi.delete(`/users/delete/${uid}`, {headers: {Authorization: `${accessToken}`}});
      console.log(data)
      if (response.status === 200) {
        await mutate('/users/get-users');   //actualizar lista de usuarios
        dispatch(onDeleteUser(uid));
        Swal.fire('Usuario eliminado', 'El usuario ha sido eliminado exitosamente', 'success');
    }

  } catch (error) {
      console.log(error);
      Swal.fire('Error al eliminar', error.response.data.msg, 'error');
  }

  }


   //confirmar eliminación del user
   const handleDelete = () => {
    deleteUser(formValues.uuid)
    setOpenDialog(false);
  };


  {/*==========EDITAR USER========= */}
  //Abrir modal de edición de user; cargar el form con los datos del usuario seleccionado
  const handleEditClick = (event, user) => {
    event.stopPropagation();
    setOpenEditDialog(true);
    setFormValues({
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      password: user.password,
      role_id: user.role_id,
      verified: user.verified
    })
  }

  //cerrar modal de Editar user
  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  //detectar cambio en la entrada del form
  const onInputChanged = ({target}) => {
    const { name, value } = target;
    setFormValues((prev) => ({
        ...prev,
        [name]: value, 
    }));
  }

  //Request editar usuario
  const updateUser = async (uid, userData) => {
    try {
        const { data } = await steamApi.put(`/users/update/${uid}`, userData, {
            headers: { Authorization: ` ${accessToken}` },
        });

        mutate('/users/get-users', (currentData) => {  //actualizar lista de usuarios
            return currentData.map(user => 
                user.uuid === uid ? { ...user, ...userData } : user
            );
        });

        dispatch(onUpdateUser({ ...userData, uid }));
        Swal.fire('Usuario actualizado', 'El usuario ha sido actualizado', 'success');
    } catch (error) {
        console.error(error);
        Swal.fire('Error al actualizar', error.response?.data?.msg || 'Error desconocido', 'error');
    }
};

  
  //Confirmar actualización del usuario
 const confirmUserUpdate = () =>{
  updateUser(formValues.uuid, formValues);
  navigate('/admin/dashboard')
  //agregar alerta de actualizado con éxito
  setOpenEditDialog(false);
 }


 {/*=======ROLES======= */}
 const { roles, rolesError, rolesLoading } = useRoles();


 {/*------------Force account verification---------- */}
 const forceVerification = async(uid) => {
  try{
      const response = await steamApi.put(`/users/${uid}/force-verify`, {}, {headers: {Authorization: `${accessToken}`}});
      if(response.status === 200) {
          dispatch(onForceVerification(response.data.user))
      }else{
          console.error('Error al forzar la verificación', response.data)
      }

  }catch(error){
      console.error('Error en la solicitud', error)
  }
}


 const handleStatusChange = (event) => {
  const selectedValue = event.target.value;
  onInputChanged(event);

  if (selectedValue === true) {
    forceVerification(formValues.uuid);
  }
}

{/*------------Update password--------------- */}
const updatePassword = async (uid) => {
  try {
      const response = await steamApi.put(`/users/update-password/${uid}`,
          { password: formValues.password }, 
          { headers: { Authorization: ` ${accessToken}` } }
      );

      console.log(response);
      if (response.status === 200) {
          dispatch(onUpdatePassword(response.data.password));
      } else {
          console.error('Error al actualizar la contraseña', response.data);
      }
  } catch (error) {
      console.error('Error en la solicitud', error);
  }
};

//Actualizar contraseña
const confirmPasswordUpdate = async() =>{
  const errors = {};

  const {password, new_password} = formValues;
    if(password !== new_password){
      errors.new_password = 'Las contraseñas no coinciden';
    }

    if(password.length < 8){
      errors.password = 'La contraseña debe tener al menos 8 caracteres'
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

  try{
    const uid = formValues.uuid;
  
    await updatePassword(uid);

    setFormValues((prevValues) => ({
      ...prevValues,
      password: new_password
    }));

    setFormErrors({});
    setOpenPasswordDialog(false);
  }catch(error){
    console.error('Error al actualizar contraseña')
  }

}

const handleChangePassClick = () =>{
  setOpenPasswordDialog(true);
}

const handleClosePass = () =>{
  setOpenPasswordDialog(false);
}

 //cargando usuarios
 if(isLoading || !users){
  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
  )
}


return (
  <Box>
    <div style={{marginTop:'30px', marginBottom:'30px'}}>
      <Typography component='h2' variant='h4' sx={{fontFamily: "Didact Gothic, sans-serif", fontWeight:'bold', margin:'20px'}}>
          Usuarios
      </Typography>
    </div>

    <div style={{textAlign:'right'}}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PersonAdd />}
        href='/auth/new'
      >
        Agregar usuario
      </Button>
    </div>
  <TableContainer component={Paper}   
    sx={{
        width: '100%',
        overflowX: 'auto',
        position: 'relative',
        display: 'block',
        maxWidth: '100%',
        margin: '10px 10px',
        '& td, & th': {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        [theme.breakpoints.down('md')]: {
          display: 'block', // Cambiar a formato de tarjeta en pantallas pequeñas
          '& td, & th': {
            fontSize: '1rem',
            padding: '6px',
          },
          '& .MuiTableRow-root': {
            display: 'block',  
            borderBottom: '5px solid #ccc',
            marginBottom: '15px', // Espaciado entre tarjetas
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          },
          '& .MuiTableCell-root': {
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'flex-start',
            textAlign: 'left',
            padding: '8px 16px',
            '&:before': {
              content: '" "', 
              fontWeight: 'bold', 
              marginRight: '10px', 
            },
          },
          '& .MuiTableHead-root': {
            display: 'none',
            fontWeight: 'bold',
            padding: '10px 0',
          },
          '& .MuiTableRow-root': {
            display: 'block', 
            flexDirection: 'column',  // Colocar los datos de la tarjeta verticalmente
            marginBottom: '10px',
          },
        },
      }}
      >
      <Table
        aria-labelledby="tableTitle"
        sx={{
          '& .MuiTableCell-root:first-of-type': {
            pl: 2
          },
          '& .MuiTableCell-root:last-of-type': {
            pr: 3
          }
        }}
      >
          {/* Encabezado de la tabla */}
          <TableHead >
              <TableRow>
                  <TableCell sx={{fontFamily: "Didact Gothic, sans-serif", fontWeight:'bolder', fontSize:'1rem'}}>ID</TableCell>
                  <TableCell sx={{fontFamily: "Didact Gothic, sans-serif", fontWeight:'bolder', fontSize:'1rem'}}>Nombre de usuario</TableCell>
                  <TableCell sx={{fontFamily: "Didact Gothic, sans-serif", fontWeight:'bolder', fontSize:'1rem'}}>Email</TableCell>
                  <TableCell sx={{fontFamily: "Didact Gothic, sans-serif", fontWeight:'bolder', fontSize:'1rem'}}>Rol ID</TableCell>
                  <TableCell sx={{fontFamily: "Didact Gothic, sans-serif", fontWeight:'bolder', fontSize:'1rem'}}>Verificado</TableCell>
              </TableRow>
          </TableHead>
          {/* Cuerpo de la tabla */}
          <TableBody>
              {users.length > 0 ? (
                  users.map((user) => (
                      <TableRow key={user.uuid} 
                      hover
                      role="checkbox"
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                      aria-checked={isSelected}
                      tabIndex={-1}
                      selected={isSelected}
                      onMouseEnter={() => handleRowHover(user.uuid)}
                      onMouseLeave={() => handleRowHover(null)}
                      >
                          <TableCell sx={{fontFamily: "Didact Gothic, sans-serif", fontSize:'1rem'}}>{user.uuid}</TableCell>
                          <TableCell sx={{fontFamily: "Didact Gothic, sans-serif", fontSize:'1rem'}}>{user.username}</TableCell>
                          <TableCell sx={{fontFamily: "Didact Gothic, sans-serif", fontSize:'1rem'}}>{user.email}</TableCell>
                          <TableCell sx={{fontFamily: "Didact Gothic, sans-serif", fontSize:'1rem'}}>{user.role_id}</TableCell>
                          <TableCell><UserStatus status={user.verified} /></TableCell>

                          
                        {hoveredRow === user.uuid && (
                          <TableCell align="right">
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDeleteClick(user.uuid)}
                            >
                              <Delete />
                            </IconButton>
                            <IconButton
                              aria-label="edit"
                              onClick={(event) => {
                                handleEditClick(event, user);
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </TableCell>
                        )}


                        {/* Modal para editar usuario */}
                        {<Dialog
                          open={openEditDialog}
                          onClose={handleEditClose}
                          fullWidth
                          maxWidth="md" 
                          sx={{
                            '& .MuiDialog-paper': {
                              padding: theme.spacing(3), 
                              borderRadius: '10px', 
                              height: '100%',
                              width: '100%'
                            },
                          }}
                        >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: theme.spacing(2), 
                          }}
                        >
                        <Typography variant='h3' sx={{fontFamily:'Didact Gothic, sans-serif',
                        '@media (max-width: 620px)': {
                          fontSize: '1.75rem'}}}>
                            Información de usuario
                        </Typography>
                        <form style={{flex: 1}} onSubmit={confirmUserUpdate}>
                          <div key={user.uuid} style={{width: '100%'}}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                              <Grid item xs={12}>
                                <Item>
                                  <Container maxWidth='md'>
                                    <Box sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      '& .MuiTextField-root': { m: 1, 
                                        padding: theme.spacing(1), 
                                        '@media (max-width: 620px)': {
                                          padding: theme.spacing(0.5) }
                                      },
                                      '& input': {
                                          fontSize: '0.875rem', 
                                      },
                                      
                                      }}>
                                      <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left',
                                        '@media (max-width: 620px)': {
                                          fontSize: '1rem'
                                        },
                                      }}>
                                        Id de usuario</Typography>
                                      <TextField
                                        required
                                        id="outlined-required"
                                        fullWidth
                                        value={formValues.uuid}
                                        name='uuid'
                                        onChange={onInputChanged}
                                        />
                                      <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left',
                                        '@media (max-width: 620px)': {
                                          fontSize: '1rem'
                                        },
                                      }}>
                                          Nombre de usuario</Typography>
                                          <TextField
                                          required
                                          id="outlined-required"
                                          fullWidth
                                          value={formValues.username}
                                          name='username'
                                          onChange={onInputChanged}
                                          />
                                       <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left',
                                            '@media (max-width: 620px)': {
                                              fontSize: '1rem'
                                            },
                                        }}>
                                            Email</Typography>
                                          <TextField
                                          autoComplete="email"
                                          required
                                          id="outlined-required"
                                          fullWidth
                                          value={formValues.email}
                                          name='email'
                                          onChange={onInputChanged}
                                          />
                                        <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left',
                                          '@media (max-width: 620px)': {
                                            fontSize: '1rem'
                                          },
                                        }}>
                                          Contraseña</Typography>
                                        <Button onClick={handleChangePassClick}>Cambiar contraseña</Button>

                                        {/*Modal para cambiar contraseña */}
                                        {
                                          openPasswordDialog && (
                                            <Dialog
                                            open={openPasswordDialog}
                                            onClose={handleClosePass}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                            >
                                              <DialogTitle id="alert-dialog-title">
                                                {"Cambiar contraseña"}
                                              </DialogTitle>
                                              <DialogContent>
                                                  <Box>
                                                  <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left',
                                                    '@media (max-width: 620px)': {
                                                      fontSize: '1rem'
                                                    },
                                                  }}>
                                                  Nueva contraseña</Typography>
                                                  <TextField
                                                      margin="normal"
                                                      id="outlined-adornment-password"
                                                      name='password'
                                                      required
                                                      fullWidth
                                                      type={showPassword ? 'text' : 'password'}
                                                      InputProps={{
                                                        endAdornment: (
                                                          <InputAdornment position="end">
                                                            <IconButton
                                                              aria-label="toggle password visibility"
                                                              onClick={handleClickShowPassword}
                                                              onMouseDown={handleMouseDownPassword}
                                                              onMouseUp={handleMouseUpPassword}
                                                              edge="end"
                                                            >
                                                              {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                          </InputAdornment>
                                                        )
                                                      }}
                                                      value={formValues.password}
                                                      autoComplete="current-password"
                                                      onChange={onInputChanged}
                                                      error={!!formErrors.password}
                                                      helperText={formErrors.password}
                                                    />

                                                  <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left',
                                                    '@media (max-width: 620px)': {
                                                      fontSize: '1rem'
                                                    },
                                                  }}>
                                                  Repite la contraseña</Typography>
                                                  <TextField
                                                      margin="normal"
                                                      id="outlined-adornment-password"
                                                      name='new_password'
                                                      required
                                                      fullWidth
                                                      type={showPassword ? 'text' : 'password'}
                                                      InputProps={{
                                                        endAdornment: (
                                                          <InputAdornment position="end">
                                                            <IconButton
                                                              aria-label="toggle password visibility"
                                                              onClick={handleClickShowPassword}
                                                              onMouseDown={handleMouseDownPassword}
                                                              onMouseUp={handleMouseUpPassword}
                                                              edge="end"
                                                            >
                                                              {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                          </InputAdornment>
                                                        )
                                                      }}
                                                      value={formValues.new_password}
                                                      autoComplete="current-password"
                                                      onChange={onInputChanged}
                                                      error={!!formErrors.new_password}
                                                      helperText={formErrors.new_password}
                                                    />
                                                  </Box>
                                                  <DialogActions>
                                                    <Button onClick={handleClosePass}>Cancelar</Button>
                                                    <Button onClick={confirmPasswordUpdate}>
                                                    Aceptar
                                                    </Button>
                                                  </DialogActions>
                                              </DialogContent>

                                            </Dialog>
                                        )}

                                        <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left',
                                            '@media (max-width: 620px)': {
                                              fontSize: '1rem'
                                            },
                                          }}>
                                            Rol de usuario</Typography>
                                          <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            name='role_id'
                                            onChange={onInputChanged}
                                            value={formValues.role_id || ''}
                                            required
                                            fullWidth
                                            sx={{border:"none", fontFamily: 'Didact Gothic, sans-serif',
                                            display: 'inline-flex',
                                            padding: 0,
                                            '&.MuiSelect-select.MuiSelect-select': { 
                                              fontFamily: 'Didact Gothic, sans-serif'
                                            }, 
                                            '&.MuiMenu-list': { fontFamily: 'Didact Gothic, sans-serif'}
                                            }}
                                          >
                                          {rolesLoading ? (
                                                <MenuItem disabled>Cargando roles...</MenuItem>
                                              ) : rolesError ? (
                                                <MenuItem disabled>Error al cargar roles</MenuItem>
                                              ) : (
                                                roles?.map((role) => (
                                                  <MenuItem key={role.id} value={role.id}>
                                                    {role.name}
                                                  </MenuItem>
                                                ))
                                            )}

                                          </Select>
                                          <Typography variant='h5' sx={{fontFamily:'Didact Gothic, sans-serif', textAlign:'left',
                                              '@media (max-width: 620px)': {
                                                fontSize: '1rem'
                                              },
                                            }}>
                                            Status</Typography>
                                            <Select
                                              labelId="demo-simple-select-autowidth-label"
                                              id="demo-simple-select-autowidth"
                                              name='verified'
                                              onChange={handleStatusChange}
                                              value={formValues.verified}
                                              required
                                              fullWidth
                                              sx={{border:"none", fontFamily: 'Didact Gothic, sans-serif',
                                              display: 'inline-flex',
                                              padding: 0,
                                              '&.MuiSelect-select.MuiSelect-select': { 
                                                fontFamily: 'Didact Gothic, sans-serif'
                                              }, 
                                              '&.MuiMenu-list': { fontFamily: 'Didact Gothic, sans-serif'}
                                              }}
                                            >
                                              <MenuItem value={true}>
                                                <UserStatus status={true} />
                                              </MenuItem>
                                              <MenuItem value={false}>
                                                <UserStatus status={false} />
                                              </MenuItem>
                                              <MenuItem value="None">
                                                <UserStatus status={null} />
                                              </MenuItem>
 
                                            </Select>
     
                                    </Box>
                                  </Container>
                                </Item>
                              </Grid>
                            </Grid>
                          </div>
              
                            <DialogActions sx={{ justifyContent: 'space-between' }}>
                            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} 
                              sx={{
                                width: '100%',
                                alignItems: { xs: 'stretch', sm: 'center' },
                              }}>
                              <Button variant="contained" type='submit'
                                sx={{
                                  fontFamily: 'Didact Gothic, sans-serif',
                                  borderRadius: '20px',
                                  padding: theme.spacing(1.5, 4),
                                  fontSize: '1rem',
                                  width: { xs: '100%', sm: 'auto' }, 
                                }}>
                                  Actualizar usuario
                              </Button>

                                <Button variant="contained" color="error" onClick={handleEditClose}
                                  sx={{
                                    fontFamily: 'Didact Gothic, sans-serif',
                                    borderRadius: '20px',
                                    padding: theme.spacing(1.5, 4),
                                    fontSize: '1rem',
                                    width: { xs: '100%', sm: 'auto' },
                                  }}>
                                    Cancelar
                                </Button>
                            </Stack>
                            </DialogActions>
                            </form>
                          </Box>
                        </Dialog>
                        }

              {/* Modal para borrar usuario */}
                  {openDialog && (
                    <Dialog
                    open={openDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"¿Estás seguro de que quieres eliminar este usuario?"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        El usuario se eliminará permanentemente
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleDelete}>
                        Aceptar
                        </Button>
                      </DialogActions>
                    </Dialog>
                  )}

                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                      <TableCell colSpan={4} align="center">
                          No hay usuarios disponibles.
                      </TableCell>
                  </TableRow>
              )}
          </TableBody>
      </Table>
  </TableContainer>
  </Box>
);

}
