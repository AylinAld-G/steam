import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography, createTheme } from '@mui/material';
import { PersonAdd, Delete, Edit } from '@mui/icons-material';
import {NumberFormatBase} from 'react-number-format';
import Swal from 'sweetalert2';

import Dot from '../components/Dot'
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthStore } from '../../hooks';



const sections = [
    { title: 'science', url: '/science', icon: '../../../public/images/scienceIcon.png' },
    { title: 'tech', url: '/tech', icon: '../../../public/images/technoIcon.png'  },
    { title: 'eng', url: '/engine', icon: '../../../public/images/engineIcon.png'  },
    { title: 'art', url: '/art', icon: '../../../public/images/artIcon.jpg'  },
    { title: 'math', url: '/math', icon: '../../../public/images/mathIcon.jpg'  }
  ];


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ==============================|| HEADER CELL ||============================== //

const headCells = [
  {
    id: 'uuid',
    align: 'left',
    disablePadding: false,
    label: 'User ID'
  },
  {
    id: 'username',
    align: 'left',
    disablePadding: true,
    label: 'Nombre de usuario'
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Correo'
  },
  {
    id: 'role',
    align: 'left',
    disablePadding: false,

    label: 'Rol'
  },
  {
    id: 'verified',
    align: 'left',
    disablePadding: false,

    label: 'Verificado'
  },
  {
    id: 'createdAt',
    align: 'right',
    disablePadding: false,
    label: 'Fecha de creación'
  }
];

// ==============================|| TABLE - HEADER ||============================== //

function UserTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{fontFamily: "Didact Gothic, sans-serif", fontWeight:'bold', fontSize:'1rem'}}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

UserTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

// ==============================|| USER STATUS ||============================== //

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
      <Typography>{title}</Typography>
    </Stack>
  );
};

UserStatus.propTypes = {
  status: PropTypes.bool
};

const theme = createTheme();

// ==============================|| USERS TABLE ||============================== //

export default function AdminDashboard() {
    const { t, i18n } = useTranslation();
  const [order] = useState('asc');
  const [orderBy] = useState('uuid');
  const [selected] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10; 
  const { getUsers, deleteUser, getRoles } = useAuthStore(); 

  // Estado local para almacenar los usuarios y los roles
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getUsers({ searchStr: '', limit: rowsPerPage, offset: currentPage * rowsPerPage }).then((response) => {
      setUsers(response.data.users);
      setTotalUsers(response.data.totalUsers);
    }).catch((error) => {
      console.error(error);
      //Swal.fire('Error al obtener usuarios', error.response?.data?.msg || 'Error desconocido', 'error');
    });

    getRoles()
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentPage]); 


  const isSelected = (uuid) => selected.indexOf(uuid) !== -1;

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleUserAdd = () => {
    <NavLink to={'/users/auth'}></NavLink>
  }

  const handleRowHover = (uuid) => {
    setHoveredRow(uuid);
  };

  const [openDialog, setOpenDialog] = useState(false);
  
  const handleDeleteClick = (event, uuid) => {
    event.stopPropagation(); // Evita que el evento de clic llegue a la fila
    setOpenDialog(true);
  };

  const handleEditClick = (event) => {
    // Agrega la lógica para eliminar el usuario con el ID `rowId`
    event.stopPropagation();
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = (uuid) => {
    deleteUser(uuid)
    setOpenDialog(false);
  };

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth="lg">
    <Header title="STEAM" sections={sections.map(
      section => ({ title: t(section.title), url: section.url, icon: section.icon })
    )}/>
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
            onClick={handleUserAdd}
            href='/auth/new'
          >
            Agregar usuario
          </Button>
        </div>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
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
          <UserTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(users, getComparator(order, orderBy)).map((user, uuid) => {
              const isItemSelected = isSelected(user.uuid);
              const labelId = `enhanced-table-checkbox-${index}`;
              const userRole = roles.find((role) => role.id === user.role_id);

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={user.uuid}
                  selected={isItemSelected}
                  onMouseEnter={() => handleRowHover(user.uuid)}
                  onMouseLeave={() => handleRowHover(null)}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left" sx={{fontFamily: "Didact Gothic, sans-serif", fontSize:'1rem' }}>
                      {user.uuid}
                  </TableCell>
                  <TableCell align="left" sx={{fontFamily: "Didact Gothic, sans-serif", fontSize:'1rem' }}>{user.username}</TableCell>
                  <TableCell align="left" sx={{fontFamily: "Didact Gothic, sans-serif", fontSize:'1rem' }}>{user.email}</TableCell>
                  <TableCell align="left" sx={{fontFamily: "Didact Gothic, sans-serif", fontSize:'1rem' }}>{userRole?.name}</TableCell>
                  <TableCell align="right" sx={{fontFamily: "Didact Gothic, sans-serif" }}>
                    <UserStatus status={user.verified} />
                  </TableCell>
                  <TableCell align="right" sx={{fontFamily: "Didact Gothic, sans-serif", fontSize:'1rem' }}>
                    <NumberFormatBase value={user.createdAt} displayType="text" />
                  </TableCell>

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
                        href={`users/update/${user.uuid}`}
                        onClick={(event) => handleEditClick(event, user.uuid)}
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination count={Math.ceil(totalUsers / rowsPerPage)} page={currentPage + 1} onChange={handlePageChange}/>
    </Box>
    </Container>
    <Footer
      title="STEAM Intercultural"
      description="2023"
    />
    </ThemeProvider>
  );
}
