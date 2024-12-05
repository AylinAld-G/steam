import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { NavLink, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Button, CircularProgress, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography, createTheme } from '@mui/material';
import { PersonAdd, Delete, Edit } from '@mui/icons-material';
import {NumberFormatBase} from 'react-number-format';
import Swal from 'sweetalert2';

import Dot from './Dot'
import Footer from './Footer';
import { useAuthStore } from '../../hooks';
import { useDispatch, useSelector } from 'react-redux';

import useSWR from 'swr'
import Cookies from 'js-cookie';
import steamApi from '../../api/steamApi';



const theme = createTheme();

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
    //const dispatch = useDispatch();

    const fetcher = async ([url, token]) => {
      const response = await steamApi.post(url, { limit: 10, offset: 0 }, {
          headers: { Authorization: `${token}` },
      });
      console.log(response)
      console.log('holi')
      return response.data.users;
  };
  
  
    const { data, error, isLoading } = useSWR(
      accessToken ? ['/users/get-users', accessToken] : null,
      fetcher
  );



  const handleRowHover = (uuid) => {
    setHoveredRow(uuid);
  };

  const [openDialog, setOpenDialog] = useState(false);
  
  const handleDeleteClick = (event, uuid) => {
    event.stopPropagation();
    setOpenDialog(true);
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = (uuid) => {
    deleteUser(uuid)
    setOpenDialog(false);
  };

  const isSelected = (uuid) => selected.indexOf(uuid) !== -1;



  if(isLoading){
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

if (error) {
    return (
      Swal.fire('Error al obtener usuarios')
    )
}

// Si se obtiene la lista de usuarios
const users = data || [];  
console.log(users);

return (
  <Box>
    <div style={{marginTop:'30px', marginBottom:'30px'}}>
      <Typography component='h2' variant='h4' sx={{fontFamily: "Didact Gothic, sans-serif", fontWeight:'bold'}}>
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
  <TableContainer component={Paper} sx={{
        width: '100%',
        overflowX: 'auto',
        position: 'relative',
        display: 'block',
        maxWidth: '100%',
        '& td, & th': { whiteSpace: 'nowrap' },
        [theme.breakpoints.down('sm')]: {
          '& td, & th': { fontSize: '0.875rem' }, 
        },
      }}>
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
                              onClick={(event) => handleDeleteClick(event, user.uuid)}
                            >
                              <Delete />
                            </IconButton>
                            <IconButton
                              aria-label="edit"
                              onClick={(event) => {
                                handleEditClick(event);
                                navigate(`/users/update/${user.uuid}`)
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </TableCell>
                        )}

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