import React, { useEffect, useState } from 'react'
import { Typography, Grid, Container, ThemeProvider, createTheme, Paper, Box, CardMedia, Input, Button, Stack, FormControl, InputLabel, Select, MenuItem, TextareaAutosize, Alert, Snackbar} from '@mui/material';
import {AddPhotoAlternate} from '@mui/icons-material';
//import TextareaAutosize from '@mui/base/TextareaAutosize';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useSteamStore } from '../../hooks';
import Footer from '../components/Footer';



const theme = createTheme();
const ariaLabel = { 'aria-label': 'title' };

const AlertM = React.forwardRef(function AlertM(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AddArticle = () => {

  const { startSavingArticle, errorMessage} = useSteamStore();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEmptyFieldsAlert, setShowEmptyFieldsAlert] = useState(false);
  const navigate = useNavigate();

  const authUser = localStorage.getItem('user')
  const userObject = JSON.parse(authUser);
  const idAuthor = userObject.uid


  const [formValues, setFormValues] = useState({
    title: "",
    image: "",
    content: "",
    category: "",
    id_author: idAuthor
});

const onInputChanged = ({ target }) => {
  setFormValues((prevValues) => ({
    ...prevValues,
    [target.name]: target.value,
  }));
};


  const postSubmit = async(event) => {
    event.preventDefault();
    // Verifica si los campos están vacíos
    if (Object.values(formValues).some(value => !value.trim())) {
      setShowEmptyFieldsAlert(true);
      return;
    }

    try {
      await startSavingArticle(formValues);
      console.log(formValues)
 
  
      // Limpia los valores del formulario después de guardar
      setFormValues({
        title: "",
        image: "",
        currentImage: null,
        content: "",
        category: "",
      });

      setShowSuccessAlert(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

  
    } catch (error) {
      console.error("Error al guardar el artículo:", error);
      Swal.fire('Error al guardar', error.message || 'Inténtalo nuevamente', 'error');
    }
    
  };

  useEffect(() => {
    if (errorMessage) {
      Swal.fire('Error al guardar', errorMessage, 'error');
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
            image: `data:${files[0].type};base64,${e.target.result.split(',')[1]}`
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
                                  sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize: "2rem", marginBottom: '20px'}} 
                                />
                                <CardMedia
                                    component="img"
                                    id='image'
                                    height="350px"
                                    onChange={onInputChanged}
                                    src={formValues.image}   //formValues.image
                                    sx={{borderRadius:"4px", marginTop:"3%", marginBottom:"2%"}}
                                />
                                {/* Botón flotante para cambiar la imagen */}
                                <Box sx={{textAlign:"right", marginBottom: '20px'}}>
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
                                    Autor ID
                                </Typography>
                                <Input value={formValues.id_author}  name='id_author' inputProps={ariaLabel} onChange={onInputChanged}
                                  sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize: "1.15rem", marginBottom: 3, width:'70%'}} 
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
                                  marginBottom: '10px',
                                  '&:focus':{
                                    outline: 0,
                                    borderColor: '#A9A9A9'
                                  }}}/>
                                
                                <Typography component="h2" variant="h5" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                                    Categoría
                                </Typography>
                                <FormControl fullWidth>
                                    <InputLabel id="category-select-label"></InputLabel>
                                    <Select
                                        labelId="category-select-label"
                                        id="category-select"  //category
                                        name='category'
                                        value={formValues.category}
                                        label=""
                                        sx={{fontFamily: 'Didact Gothic, sans-serif'}}
                                        onChange={onInputChanged}  //onPostInputChange
                                    >
                                        <MenuItem value="ciencia">ciencia</MenuItem>
                                        <MenuItem value="tecnología">tecnología</MenuItem>
                                        <MenuItem value="ingeniería">ingeniería</MenuItem>
                                        <MenuItem value="arte">arte</MenuItem>
                                        <MenuItem value="matemáticas">matemáticas</MenuItem>
                                    </Select>
                                </FormControl>


                                <Stack spacing={2} direction="row" sx={{marginBottom: '20px'}}>
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
