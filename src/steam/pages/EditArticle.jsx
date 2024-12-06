import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Typography, Grid, Container, ThemeProvider, createTheme, Paper, Box, CardMedia, Input, Button, Stack, Snackbar, Alert, FormControl, Select, MenuItem, InputLabel, CircularProgress} from '@mui/material';
import {AddPhotoAlternate} from '@mui/icons-material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSteamStore } from '../../hooks';
import { onLoadArticles, onSetActiveArticle } from '../../store/steam/steamSlice';


const theme = createTheme();
const ariaLabel = { 'aria-label': 'title' };

const AlertM = React.forwardRef(function AlertM(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const EditArticle = () => {
  const { id } = useParams();

  const { t } = useTranslation();

    const { publications, startSavingArticle, startLoadingArticles, isLoadingArticles } = useSteamStore();
    const navigate = useNavigate();


    const onInputChanged = ({target}) => {
      setFormValues({
        ...formValues,
        [target.name]: target.value
      });
    }

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showEmptyFieldsAlert, setShowEmptyFieldsAlert] = useState(false);
    
    const [formValues, setFormValues] = useState({
      title: '',
      id_publication: '',
      content: '',
      category: '',
      image: '',
      id_author: ''
    });

    const handleCategoryChange = (event) => {
      setFormValues({
        ...formValues,
        category: event.target.value
      });
    }

    //Cargar publicaciones
    useEffect(()=>{
      startLoadingArticles();
    },[])

    const post = publications.find((article) => article[0] === id);

    useEffect(() => {

      if (post) {
        const imageData = post[5]; 
        const prefixedImage = imageData.startsWith('data:image') 
          ? imageData 
          : `data:image/jpeg;base64,${imageData}`; 
    
        setFormValues({
          title: post[4],
          id_publication: post[0],
          content: post[6],
          category: post[2],
          id_author: post[1],
          image: prefixedImage, 
        });
    
        setCurrentImage(prefixedImage); 
      }
    }, [post]);


  const [currentImage, setCurrentImage] = useState(); // Estado para la imagen actual

  const handleImageChange = () => {
    // Abrir el explorador de archivos
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



    const onSubmit = async(event) => {
      event.preventDefault();
      if (Object.values(formValues).some(value => !value.trim())) {
        setShowEmptyFieldsAlert(true);
        return;
      }
        await startSavingArticle(formValues);
        console.log(formValues)
        setShowSuccessAlert(true);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
    }

    if (isLoadingArticles) {
      return (
        <Container maxWidth="lg">
          <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />
        </Container>
      );
    }


  return (
    <>
      <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
      {/*<Header title="STEAM" sections={sections.map(section => ({ title: t(section.title), url: section.url, category: section.category, icon: section.icon }))}/>*/}
      <Grid>
        <Container>
            <form onSubmit={ onSubmit }>
            <Paper
            sx={{
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(${currentImage})`,}}
            />
            <Box p={2}>
                <Input fullWidth name="title" value={formValues.title} inputProps={ariaLabel} onChange={onInputChanged} sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize: "2rem"}} />
                
                <Typography variant="h5" sx={{fontFamily: 'Didact Gothic, sans-serif', marginTop: '30px', color: 'dark-gray'}}>
                  ID publicación
                </Typography>
                <Input value={formValues.id_publication}  name='id_publication' inputProps={ariaLabel} onChange={onInputChanged}
                  sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize: "1.15rem", marginBottom: 4, width:'70%', color: 'gray'}} 
                />

                <CardMedia
                    component="img"
                    onChange={onInputChanged}
                    height="350px"
                    src={currentImage}
                    sx={{borderRadius:"4px", marginTop:"3%", marginBottom:"1%"}}
                />
                {/* Botón flotante para cambiar la imagen */}
                <Box sx={{textAlign:"right",  marginBottom: '20px'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddPhotoAlternate />}
                        onClick={handleImageChange}
                    >
                        Adjuntar otra imagen
                    </Button>
                </Box>

                
                <Typography variant="h5" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                  Autor ID
                </Typography>
                <Input value={formValues.id_author}  name='id_author' inputProps={ariaLabel} onChange={onInputChanged}
                  sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize: "1.15rem", marginBottom: 4, width:'70%'}} 
                />


                <Typography component="h2" variant="h5" sx={{fontFamily: 'Didact Gothic, sans-serif', marginTop: '20px' }}>
                  Descripción
                </Typography>
                <TextareaAutosize defaultValue={formValues.content} name='content' onChange={onInputChanged} style={{fontFamily:"Didact Gothic, sans-serif", 
                width: '100%',
                fontSize: '1.15rem',
                fontWeight: 400,
                lineHeight: 1.5,
                padding: '12px',
                marginBottom: '20px',
                borderRadius: '4px 4px 0 4px', 
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
                        id="demo-simple-select"  
                        name='category'
                        value={formValues.category}   //formValues.category
                        label=" "
                        sx={{fontFamily: 'Didact Gothic, sans-serif'}}
                        onChange={handleCategoryChange}  //onInputChanged
                    >
                        <MenuItem value="ciencia">ciencia</MenuItem>
                        <MenuItem value="tecnología">tecnología</MenuItem>
                        <MenuItem value="ingeniería">ingeniería</MenuItem>
                        <MenuItem value="arte">arte</MenuItem>
                        <MenuItem value="matemáticas">matemáticas</MenuItem>
                    </Select>
                </FormControl>
                
                <Stack spacing={2} direction="row" sx={{marginTop: '15px', marginBottom: '20px'}}>
                <Button variant="contained" type='submit'
                    sx={{fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", top: "15px", bottom: "15px"}}>
                    Guardar
                </Button>

                <Link to='/dashboard' style={{textDecoration: 'none'}}>
                  <Button variant="contained" color="error"
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
                  Actualizado correctamente
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
