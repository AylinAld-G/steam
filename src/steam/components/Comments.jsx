import * as React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Paper, Stack, TextareaAutosize, Box, Button, Typography, CssBaseline, IconButton, Snackbar, Alert, useMediaQuery, Drawer, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, useTheme  } from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import { useAuthStore, useForm, useSteamStore } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onSetActiveComment } from '../../store/steam/steamSlice';


const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const AlertM = React.forwardRef(function AlertM(props, ref) {
    return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function Comments(props) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);
  const {startSavingComment, startLoadingComments, startDeletingComment, comments, activeComment} = useSteamStore();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [role, setRole] = useState(null)
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  
  const theme = useTheme();

  const [state, setState] = React.useState({ bottom: false });
    const toggleDrawerDesk = (anchor, open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const authUser = localStorage.getItem('user')
  const userObject = JSON.parse(authUser);
  const idAuthor = userObject.uid


  const [formValues, setFormValues] = React.useState({
    content: '',
    id_author: idAuthor,
    id_publication: id
  })

  const [formValuesUp, setFormValuesUp] = React.useState({
    content: '',
    id_author: idAuthor,
    id_publication: id
  })

  const onInputChangedUp = ({ target }) => {
    setFormValuesUp(prev => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const [isLoading, setIsLoading] = useState(true);


  const onInputChanged = ({ target }) => {
    setFormValues(prev => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const getUserRol = async () => {
    const user = localStorage.getItem('user')
    if(user){
      const userObject = JSON.parse(user);
      const rolName = userObject.role_name

     return rolName || null
    }else{
      console.error("No se encontró el objeto user")
      return null;
    }
  } 

  useEffect(() => {
    const fetchUserRole = async () => {
      const rol = await getUserRol();
      setRole(rol)
    }

    fetchUserRole()
  }, []);


  useEffect(() => {
    setIsLoading(true);
    startLoadingComments(id);
    setIsLoading(false)
    console.log(comments)
  }, []);

 // const comment = comments.find((comment) => comment[2] === id);

  const toggleDrawer = (newOpen) => async() => {
    setOpen(newOpen);
  };


  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEmptyFieldsAlert, setShowEmptyFieldsAlert] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);


  const addComment = (event) => {
    event.preventDefault();
    if (Object.values(formValues).some(value => !value.trim())) {
      setShowEmptyFieldsAlert(true);
      return;
    }
    console.log(formValues)
    startSavingComment({ ...formValues }).then(() => {
      startLoadingComments(id);
    });;

    setFormValues({
      ...formValues,
      id_author: idAuthor,
      content: '',
    });
    console.log(formValues.content)
    setShowSuccessAlert(true);

  }

  const handleDeleteCommentSelection = (event, comment) => {
    event.stopPropagation();
    setIsDeleteModalOpen(true);
    dispatch(onSetActiveComment(comment));
  }

  const confirmDeleteComment = () => {
    if (activeComment) {
      startDeletingComment(activeComment[0]).then(() => {
      startLoadingComments(id);
    }); 
      dispatch(onSetActiveComment(null));
      setIsDeleteModalOpen(false); 
    }
  };

  const handleUpdateCommentSelection = (event, comment) => {
    event.stopPropagation();
    setIsUpdateModalOpen(true);

    setFormValuesUp(prev => ({
      ...prev,
      id_comment: comment[0],
      content: comment[3],  
      id_author: comment[1],  
      id_publication: id  
    }));
    dispatch(onSetActiveComment(comment))
  }

  const confirmUpdateComment = () =>{
    if(activeComment){
      startSavingComment({...formValuesUp}).then(()=>{
        startLoadingComments(id)
      });
      dispatch(onSetActiveComment(null))
      setIsUpdateModalOpen(false);
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleCloseUpdateModal = () =>{
    setIsUpdateModalOpen(false);
  }

  const container = window !== undefined ? () => window().document.body : undefined;
  // useMediaQuery hook to detect screen width
  const isMobile = useMediaQuery('(max-width:420px)');

  if (isLoading) {
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
    );
  }

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(100% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      <Box sx={{ textAlign: 'center', pt: 1, marginBottom: '60px'}}>
        <Button onClick={isMobile ? toggleDrawer(true) : toggleDrawerDesk('bottom', true)}
        sx={{fontFamily: 'Didact Gothic, sans-serif', marginTop:'20px', fontSize: '2rem' }}>
          {t("comments")}
        </Button>
      </Box>

      {/*Agregar el Swipeable Drawer solo para celulares*/}
      {/*En compu y en tablet view dejar los comentarios en la misma pantalla que el artículo */}

      {isMobile ? (
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
          
        >
        <Puller />
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
            <Box sx={{ width: '100%' }}>
                  <Stack spacing={2} marginBottom='30px' marginTop='30px'>
                    <Item>
                      <form onSubmit={addComment}>
                        <Typography variant='h6' sx={{textAlign:'left', fontFamily:"Didact Gothic, sans-serif"}}>Agrega un nuevo comentario</Typography>
                        <TextareaAutosize value={formValues.content} name='content' readOnly={false}  onChange={onInputChanged}
                        style={{fontFamily:"Didact Gothic, sans-serif", width: '100%',
                        fontSize: '1.15rem',
                        padding: '12px',
                        borderRadius: '4px 4px 0 4px'}}
                        />
                        <div style={{textAlign:'right'}}>
                            <Button variant='contained' type='submit'
                            sx={{fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", top: "15px", bottom: "15px"}}>
                            Enviar comentario
                            </Button>
                        </div>
                      </form>
                      {/* Alert de éxito */}
                      {showSuccessAlert && (
                        <Snackbar open={showSuccessAlert} autoHideDuration={6000} onClose={() => setShowSuccessAlert(false)}>
                          <AlertM severity="success" sx={{ width: '100%' }}>
                            Comentario agregado
                          </AlertM>
                        </Snackbar>
                      )}

                      {/* Alert de campos vacíos */}
                      {showEmptyFieldsAlert && (
                        <Snackbar open={showEmptyFieldsAlert} autoHideDuration={6000} onClose={() => setShowEmptyFieldsAlert(false)}>
                          <Alert variant="filled" severity="error" onClose={() => setShowEmptyFieldsAlert(false)}>
                            El comentario está vacío
                          </Alert>
                        </Snackbar>
                      )}
                    </Item>
  
                    {comments.map((comment) => (
                      <Item key={comment[0]}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      sx={{ position: 'relative', padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '8px' }}
                      >
                      {role === 'Admin' && isHovered && (
                        <Box sx={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '2px' }}>
                          <IconButton
                            aria-label="delete"
                            onClick={(event) => handleDeleteCommentSelection(event, comment)}
                          >
                            <Delete />
                          </IconButton>

                            <IconButton
                            aria-label="edit"
                            onClick={(event) => handleUpdateCommentSelection(event, comment)}
                          >
                            <Edit />
                          </IconButton>
                          </Box>
                      )}


                      {/* Modal para editar*/}
                        <Dialog
                          open={isUpdateModalOpen}
                          onClose={handleCloseUpdateModal}
                          fullWidth
                          maxWidth="sm" 
                          sx={{
                            '& .MuiDialog-paper': {
                              padding: theme.spacing(5), 
                              borderRadius: '15px', 
                            },
                          }}
                        >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: theme.spacing(4), 
                          }}
                        >
                        <TextareaAutosize value={formValuesUp.content} name='content' readOnly={false}  onChange={onInputChangedUp}
                          style={{
                            fontFamily: 'Didact Gothic, sans-serif',
                            width: '100%',
                            fontSize: '1.15rem',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box',
                            resize: 'none', 
                          }}
                          />
                      
                            <DialogActions sx={{ justifyContent: 'space-between' }}>
                            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} 
                              sx={{
                                width: '100%',
                                alignItems: { xs: 'stretch', sm: 'center' },
                              }}>
                              <Button variant="contained" onClick={confirmUpdateComment}
                                sx={{
                                  fontFamily: 'Didact Gothic, sans-serif',
                                  borderRadius: '20px',
                                  padding: theme.spacing(1.5, 4),
                                  fontSize: '1rem',
                                  width: { xs: '100%', sm: 'auto' }, 
                                }}>
                                  Actualizar comentario
                              </Button>

                                <Button variant="contained" color="error" onClick={handleCloseUpdateModal}
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
                          </Box>
                        </Dialog>

                        
                        {/* Modal para eliminar*/}
                        <Dialog
                          open={isDeleteModalOpen}
                          onClose={handleCloseDeleteModal}
                          aria-labelledby="delete-dialog-title"
                          aria-describedby="delete-dialog-description"
                        >
                          <DialogTitle id="delete-dialog-title">{"¿Eliminar comentario?"}</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="delete-dialog-description">
                              ¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseDeleteModal} color="primary">Cancelar</Button>
                            <Button onClick={confirmDeleteComment} color="secondary" autoFocus>
                              Eliminar
                            </Button>
                          </DialogActions>
                        </Dialog>
   
                            
                      <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'left', fontFamily: "Didact Gothic, sans-serif" }}>{comment[1]}</Typography>
                      <div style={{ textAlign: 'left' }}>
                        <Typography variant='h6' sx={{ fontFamily: "Didact Gothic, sans-serif" }}>{comment[3]}</Typography>
                      </div>
                    </Item>
                    ))}


                  </Stack>
                </Box>
        </StyledBox>
      </SwipeableDrawer>
      ) : (
        <Box sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}>
          <>
          <Drawer anchor="bottom" open={state.bottom} onClose={toggleDrawerDesk('bottom', false)}>
            <Box
              sx={{
                width: '100%',
                padding: '20px',
                height: '90vh',
                overflowY: 'auto',
                backgroundColor: '#f9f9f9',
              }}
              role="presentation"
            >
              <Stack spacing={2} marginBottom="30px" marginTop="30px">
                <form onSubmit={addComment}>
                  <Typography variant="h6" sx={{ textAlign: 'left', fontFamily: 'Didact Gothic, sans-serif' }}>
                    Agrega un nuevo comentario
                  </Typography>
                  <TextareaAutosize
                    value={formValues.content}
                    name="content"
                    onChange={onInputChanged}
                    style={{
                      fontFamily: 'Didact Gothic, sans-serif',
                      width: '100%',
                      fontSize: '1.15rem',
                      padding: '12px',
                      borderRadius: '4px 4px 0 4px',
                    }}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{ fontFamily: 'Didact Gothic, sans-serif', borderRadius: '20px', marginTop: '15px' }}
                    >
                      Enviar comentario
                    </Button>
                  </div>
                </form>
                {showSuccessAlert && (
                  <Snackbar open={showSuccessAlert} autoHideDuration={6000} onClose={() => setShowSuccessAlert(false)}>
                    <AlertM severity="success" sx={{ width: '100%' }}>
                      Comentario agregado
                    </AlertM>
                  </Snackbar>
                )}
                {showEmptyFieldsAlert && (
                  <Snackbar open={showEmptyFieldsAlert} autoHideDuration={6000} onClose={() => setShowEmptyFieldsAlert(false)}>
                    <AlertM severity="error" sx={{ width: '100%' }}>
                      El comentario está vacío
                    </AlertM>
                  </Snackbar>
                )}

                {comments.map((comment) => (
                  <Box
                  key={comment[0]}
                
                  sx={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    position: 'relative',
                    backgroundColor: '#fff',
                  }}
                >
                  {role  === 'Admin' && (
                    <Box sx={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                      <IconButton
                        aria-label="delete"
                        onClick={(event) => handleDeleteCommentSelection(event, comment)}
                        
                      >
                        <Delete />
                      </IconButton>

                      <IconButton
                        aria-label="edit"
                        onClick={(event) => handleUpdateCommentSelection(event, comment)}
                      >
                        <Edit />
                      </IconButton>
                      </Box>
                  )}

                  {/* Modal para editar*/}
                  <Dialog
                          open={isUpdateModalOpen}
                          onClose={handleCloseUpdateModal}
                          fullWidth
                          maxWidth="sm" 
                          sx={{
                            '& .MuiDialog-paper': {
                              padding: theme.spacing(5), 
                              borderRadius: '15px', 
                            },
                          }}
                        >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: theme.spacing(4), 
                          }}
                        >
                        <TextareaAutosize value={formValuesUp.content} name='content' readOnly={false}  onChange={onInputChangedUp}
                          style={{
                            fontFamily: 'Didact Gothic, sans-serif',
                            width: '100%',
                            fontSize: '1.15rem',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box',
                            resize: 'none', 
                          }}
                          />
                      
                            <DialogActions sx={{ justifyContent: 'space-between' }}>
                            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} 
                              sx={{
                                width: '100%',
                                alignItems: { xs: 'stretch', sm: 'center' },
                              }}>
                              <Button variant="contained" onClick={confirmUpdateComment}
                                sx={{
                                  fontFamily: 'Didact Gothic, sans-serif',
                                  borderRadius: '20px',
                                  padding: theme.spacing(1.5, 4),
                                  fontSize: '1rem',
                                  width: { xs: '100%', sm: 'auto' }, 
                                }}>
                                  Actualizar comentario
                              </Button>

                                <Button variant="contained" color="error" onClick={handleCloseUpdateModal}
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
                          </Box>
                        </Dialog>


                {/*Modal para eliminar */}
                      <Dialog
                        open={isDeleteModalOpen}
                        onClose={handleCloseDeleteModal}
                        aria-labelledby="delete-dialog-title"
                        aria-describedby="delete-dialog-description"
                      >
                        <DialogTitle id="delete-dialog-title">{"¿Eliminar comentario?"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText id="delete-dialog-description">
                            ¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseDeleteModal} color="primary">Cancelar</Button>
                          <Button onClick={confirmDeleteComment} color="secondary" autoFocus>
                            Eliminar
                          </Button>
                        </DialogActions>
                      </Dialog>


                  <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'left', fontFamily: "Didact Gothic, sans-serif" }}>
                    {comment[1]} 
                  </Typography>

                    <Typography sx={{ textAlign: 'left', fontFamily: 'Didact Gothic, sans-serif' }}>
                      {comment[3]}
                    </Typography>

                </Box>
                ))}

              </Stack>
            </Box>
          </Drawer>
        </>
      </Box>
      )}
    </Root>
  );



}

Comments.propTypes = {
  window: PropTypes.func,
};

export default Comments;
