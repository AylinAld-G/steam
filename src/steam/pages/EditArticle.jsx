import React, { useEffect, useState } from 'react'
import { Typography, Grid, Container, ThemeProvider, createTheme, Paper, Box, CardMedia, Input, Button, Stack, Snackbar, Alert, FormControl, Select, MenuItem, InputLabel} from '@mui/material';
import {AddPhotoAlternate} from '@mui/icons-material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSteamStore } from '../../hooks';

const sections = [
    { title: 'science', url: '/science', icon:'../../../public/images/scienceIcon.png' },
    { title: 'tech', url: '/tech', icon:'../../../public/images/technoIcon.png' },
    { title: 'eng', url: '/engine', icon:'../../../public/images/engineIcon.png' },
    { title: 'art', url: '/art', icon:'../../../public/images/artIcon.jpg' },
    { title: 'math', url: '/math', icon:'../../../public/images/mathIcon.jpg' }
];

const articles = [
  {
    index: 1,
    title: 'Featured post',
    author: 'Robert P.',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://picsum.photos/600/100?random',
    imageLabel: 'Image Text',
  },
  {
    index: 2,
    title: 'Post title',
    author: 'Andrew G.',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://picsum.photos/600/100?random',
    imageLabel: 'Image Text',
  },
  {
    index: 3,
    title: 'Article',
    author: 'Jamie D.',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://picsum.photos/600/100?random',
    imageLabel: 'Image Text',
    },
    {
      index: 4,
      title: 'New',
      author: 'Theo J.',
      description:
        'This is a wider card with supporting text below as a natural lead-in to additional content.',
      image: 'https://picsum.photos/600/100?random',
      imageLabel: 'Image Text',
    },
];



const theme = createTheme();
const ariaLabel = { 'aria-label': 'title' };

const AlertM = React.forwardRef(function AlertM(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const EditArticle = () => {
  const { index } = useParams();
  const adjustedIndex = parseInt(index) - 1; // Ajusta el índice para comenzar desde 0

  const { t } = useTranslation();

     //const { articles, activeArticle, startSavingArticle } = useSteamStore();

    // Encuentrar artículo según el Index
    const post = articles[parseInt(adjustedIndex)];


    const [formValues, setFormValues] = useState({
        title: post.title,
        image: post.image,
        content: post.description,
        author: post.author,
    });

    const onInputChanged = ({target}) => {
      setFormValues({
        ...formValues,
        [target.name]: target.value
      });
    }

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showEmptyFieldsAlert, setShowEmptyFieldsAlert] = useState(false);

    /*useEffect(() => {
      if ( activeArticle !== null ) {
          setFormValues({ ...activeEvent });
      }    
      
    }, [ activeArticle ])*/

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
        image: e.target.result,
      });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const [category, setCategory] = useState();


    const onSubmit = async(event) => {
      event.preventDefault();
      if (Object.values(formValues).some(value => !value.trim())) {
        setShowEmptyFieldsAlert(true);
        return;
      }
        //startSavingArticle(formValues);
        console.log(formValues)
        setShowSuccessAlert(true);
    }


  return (
    <>
      <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
      <Header title="STEAM" sections={sections.map(section => ({ title: t(section.title), url: section.url, icon: section.icon }))}/>
      <Grid>
        <div key={post.index}>
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
            backgroundImage: `url(${currentImage || post.image})`,}}
            />
            <Box p={2}>
                <Input fullWidth name="title" value={formValues.title} inputProps={ariaLabel} onChange={onInputChanged} sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize: "2rem"}} />
                <CardMedia
                    component="img"
                    onChange={onInputChanged}
                    alt={post.imageLabel}
                    height="350px"
                    src={currentImage || formValues.image}
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
                        Adjuntar otra imagen
                    </Button>
                </Box>

                <Input value={formValues.author}  name='author' inputProps={ariaLabel} onChange={onInputChanged}
                  sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize: "1.15rem", marginTop: 3, marginBottom: 3, width:'50%', color:'text.secondary'}} 
                />

                <TextareaAutosize defaultValue={formValues.content} name='content' onChange={onInputChanged} style={{fontFamily:"Didact Gothic, sans-serif", 
                width: '100%',
                fontSize: '1.15rem',
                fontWeight: 400,
                lineHeight: 1.5,
                padding: '12px',
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
                        value={category}   //formValues.category
                        label=" "
                        sx={{fontFamily: 'Didact Gothic, sans-serif'}}
                        onChange={(event) => setCategory(event.target.value)}  //onInputChanged
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
