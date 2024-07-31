import * as React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Paper, Stack, TextareaAutosize, Box, Button, Typography, CssBaseline, IconButton, Snackbar, Alert, useMediaQuery } from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import { useAuthStore, useForm, useSteamStore } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';


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
  const { window, postId } = props;
  const [open, setOpen] = React.useState(false);
  const {startSavingComment, startLoadingComments, startDeletingComment, activeComment, comments} = useSteamStore();
  const {user} = useAuthStore();
  const {t} = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [formValues, setFormValues] = React.useState({
    content: " ",
  })

  const onInputChanged = ({target}) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    });
  }

  //const {id} = useParams();


  const toggleDrawer = (newOpen) => async() => {
    await startLoadingComments(postId);
    setOpen(newOpen);
  };


  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEmptyFieldsAlert, setShowEmptyFieldsAlert] = useState(false);

  const addComment = (event) => {
    event.preventDefault();
    if (Object.values(formValues).some(value => !value.trim())) {
      setShowEmptyFieldsAlert(true);
      return;
    }
    console.log(formValues)
    //startSavingComment();
    setFormValues({
      ...formValues,
      author: user.username,
      content: " ",
    });
    setShowSuccessAlert(true);
  }

  const handleDeleteComment = (event) => {
    event.preventDefault();
    startDeletingComment(activeComment.id)
  }

  const handleUpdateComment = (event) => {
    event.preventDefault();
    startSavingComment()
  }


  const container = window !== undefined ? () => window().document.body : undefined;
  // useMediaQuery hook to detect screen width
  const isMobile = useMediaQuery('(max-width:290px)');

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      <Box sx={{ textAlign: 'center', pt: 1, marginBottom: '60px'}}>
        <Button onClick={toggleDrawer(true)}
        sx={{fontFamily: 'Didact Gothic, sans-serif', marginTop:'20px', fontSize: '2rem' }}>
          {t("comments")}
        </Button>
      </Box>

      {/*Agregar el Swipeable Drawer solo para celulares (sección condicional para pantallas de 290px)*/}
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
          <Typography sx={{ p: 2, color: 'text.secondary' }}>Comentarios</Typography>
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
                      <Item key={comment.id}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>
                        {user.user_rol === 'Admin' && isHovered && (
                          <>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDeleteComment(comment.id)}
                              sx={{ position: 'absolute', top: 1, right: 1 }}
                            >
                              <Delete />
                            </IconButton>
                              <IconButton
                              aria-label="edit"
                              onClick={() => handleUpdateComment(comment.id)}
                              sx={{ position: 'absolute', top: 1, right: 1 }}
                            >
                              <Edit />
                            </IconButton>
                          </>
                        )}
                        <Typography variant='h6' sx={{ fontWeight: 'bolder', textAlign: 'left', fontFamily: "Didact Gothic, sans-serif" }}>{comment.author}</Typography>
                        <div style={{ textAlign: 'left' }}>
                          <Typography variant='p' sx={{ fontFamily: "Didact Gothic, sans-serif" }}>{comment.content}</Typography>
                        </div>
                      </Item>
                    ))}
                  </Stack>
                </Box>
        </StyledBox>
      </SwipeableDrawer>
      ) : (
        <Box sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}>
          {/* Inline content for larger screens */}
          {renderCommentsSection()}
        </Box>
      )}
    </Root>
  );


  function renderCommentsSection(){
    return(
      <Typography variant='h6' sx={{ fontWeight: 'bolder', textAlign: 'center', fontFamily: "Didact Gothic, sans-serif" }}>Comentarios</Typography>
    )
  }


}

Comments.propTypes = {
  window: PropTypes.func,
};

export default Comments;
