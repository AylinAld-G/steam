import React, { useEffect, useState } from 'react'
import { Typography, Grid, Container, ThemeProvider, createTheme, Paper, Box, CardMedia, Input, Button, Stack, FormControl, InputLabel, Select, MenuItem, TextareaAutosize, Alert, Snackbar} from '@mui/material';
import {AddPhotoAlternate} from '@mui/icons-material';
//import TextareaAutosize from '@mui/base/TextareaAutosize';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm, useSteamStore } from '../../hooks';
import Header from '../components/Header';
import Footer from '../components/Footer';


const sections = [
    { title: 'science', url: '/science', icon: '../../../public/images/scienceIcon.png' },
    { title: 'tech', url: '/tech', icon: '../../../public/images/technoIcon.png'  },
    { title: 'eng', url: '/engine', icon: '../../../public/images/engineIcon.png'  },
    { title: 'art', url: '/art', icon: '../../../public/images/artIcon.jpg'  },
    { title: 'math', url: '/math', icon: '../../../public/images/mathIcon.jpg'  }
  ];

const theme = createTheme();
const ariaLabel = { 'aria-label': 'title' };

const AlertM = React.forwardRef(function AlertM(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AddArticle = () => {

  const { startSavingArticle, errorMessage} = useSteamStore();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEmptyFieldsAlert, setShowEmptyFieldsAlert] = useState(false);


  const [formValues, setFormValues] = useState({
    title: " ",
    image: " ",
    content: " ",
    id_author: " ",
    category: " ",
});

const onInputChanged = ({target}) => {
  setFormValues({
    ...formValues,
    [target.name]: target.value
  });
}


  const postSubmit = (event) => {
    event.preventDefault();
    // Verifica si los campos están vacíos
    if (Object.values(formValues).some(value => !value.trim())) {
      setShowEmptyFieldsAlert(true);
      return;
    }

    /*startSavingArticle({ 
      category: postCategory, 
      title: postTitle,
      content: postContent,
      image: postImage
    });*/
    console.log(formValues)
    setShowSuccessAlert(true);
    
  };

  useEffect(() => {
    if(errorMessage !== undefined){
      Swal.fire('Error al guardar', errorMessage, 'error' );
    }
  
  }, [errorMessage])


    const { t } = useTranslation();
    const [currentImage, setCurrentImage] = useState(); // Estado para la imagen actual
  
    const handleImageChange = () => {
      // Abrir el explorador de archivos al hacer clic en el botón
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event) => handleFileSelection(event.target.files);
      input.click();
    };
  
    const handleFileSelection = (files) => {
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCurrentImage(e.target.result);
          setFormValues({
            ...formValues,
            image: e.target.result,
          });
        };
        reader.readAsDataURL(files[0]);
      }
    };

    const onCancel = () =>{
        return <Link to={'/dashboard'}></Link>
    }

 
  return (
    <>
    <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
            <Header title="STEAM" sections={sections.map(section => ({ title: t(section.title), url: section.url, icon: section.icon }))}/>
            <Grid>
                <div>
                    <Container>
                        <form onSubmit={ postSubmit }>
                            <Paper
                            sx={{
                            backgroundColor: 'grey.800',
                            color: '#fff',
                            mb: 4,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundImage: `url(${currentImage})`}}
                            />
                            <Box p={2}>
                                <Typography component="h2" variant="h5" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                                    Título
                                </Typography>
                                <Input fullWidth value={formValues.title}  name='title' inputProps={ariaLabel} onChange={onInputChanged}
                                  sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize: "2rem"}} 
                                />
                                <CardMedia
                                    component="img"
                                    id='image'
                                    height="350px"
                                    onChange={onInputChanged}
                                    src={currentImage}   //formValues.image
                                    sx={{borderRadius:"4px", marginTop:"3%", marginBottom:"2%"}}
                                />
                                {/* Botón flotante para cambiar la imagen */}
                                <Box sx={{textAlign:"right"}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddPhotoAlternate />}
                                        onClick={handleImageChange}
                                    >
                                        Adjuntar imagen
                                    </Button>
                                </Box>

                                <Typography variant="h5" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                                    Autor
                                </Typography>
                                <Input value={formValues.id_author}  name='id_author' inputProps={ariaLabel} onChange={onInputChanged}
                                  sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize: "1.15rem", marginBottom: 3, width:'50%'}} 
                                />

                                <Typography component="h2" variant="h5" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                                    Descripción
                                </Typography>
                                <TextareaAutosize defaultValue={formValues.content} name='content' onChange={onInputChanged} style={{fontFamily:"Didact Gothic, sans-serif", 
                                  width: '100%',
                                  fontSize: '1.15rem',
                                  fontWeight: 400,
                                  lineHeight: 1.5,
                                  padding: '12px',
                                  borderRadius: '4px 4px 0 4px', 
                                  marginBottom: 4,
                                  '&:focus':{
                                    outline: 0,
                                    borderColor: '#A9A9A9'
                                  }}}/>
                                
                                <Typography component="h2" variant="h5" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                                    Categoría
                                </Typography>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"  //category
                                        name='category'
                                        value={formValues.category}
                                        label=" "
                                        sx={{fontFamily: 'Didact Gothic, sans-serif'}}
                                        onChange={onInputChanged}  //onPostInputChange
                                    >
                                        <MenuItem value="Ciencia">Ciencia</MenuItem>
                                        <MenuItem value="Tecnología">Tecnología</MenuItem>
                                        <MenuItem value="Ingeniería">Ingeniería</MenuItem>
                                        <MenuItem value="Arte">Arte</MenuItem>
                                        <MenuItem value="Matemáticas">Matemáticas</MenuItem>
                                    </Select>
                                </FormControl>


                                <Stack spacing={2} direction="row">
                                    <Button variant="contained" type='submit'
                                        sx={{fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", top: "15px", bottom: "15px"}}>
                                        Guardar
                                    </Button>

                                  <Link to='/dashboard' style={{textDecoration: 'none'}}>
                                    <Button variant="contained" color="error" onClick={onCancel}
                                        sx={{fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", top: "15px", bottom: "15px"}}>
                                        Cancelar
                                    </Button>
                                    </Link>
                                </Stack>

                            </Box>
                        </form>

                        {/* Alert de éxito */}
                        {showSuccessAlert && (
                          <Snackbar open={showSuccessAlert} autoHideDuration={6000} onClose={() => setShowSuccessAlert(false)}>
                            <AlertM severity="success" sx={{ width: '100%' }}>
                              Guardado correctamente
                            </AlertM>
                          </Snackbar>
                        )}

                        {/* Alert de campos vacíos */}
                        {showEmptyFieldsAlert && (
                          <Snackbar open={showEmptyFieldsAlert} autoHideDuration={6000} onClose={() => setShowEmptyFieldsAlert(false)}>
                            <Alert variant="filled" severity="error" onClose={() => setShowEmptyFieldsAlert(false)}>
                              Por favor, completa todos los campos
                            </Alert>
                          </Snackbar>
                        )}
                    </Container>

                </div>
            </Grid>
    </Container>
    
    <Footer
        title="STEAM Intercultural"
        description="2023"
      />
    </ThemeProvider>

  </>
  )
}
