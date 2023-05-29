import * as React from 'react';
import {CssBaseline, Grid, Container, Button, Typography, Box, Stack, ToggleButtonGroup, ToggleButton} from '@mui/material';
import {Instagram, Facebook, Twitter} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from "react";
import { useEffect } from "react";

import FeaturedPost from '../components/FeaturedPost';
import Header from '../components/Header';
import MainFeaturedPost from '../components/MainFeaturedPost';
import Footer from '../components/Footer';
import PersonCard from '../components/PersonCard';
import Carousel from '../components/Carousel';
import { areas } from "../components/Data";


const sections = [
  { title: 'Ciencia', url: '#' },
  { title: 'Tecnología', url: '#' },
  { title: 'Ingeniería', url: '#' },
  { title: 'Arte', url: '#' },
  { title: 'Matemáticas', url: '#' }
];

const mainFeaturedPost = {
  title: 'STEAM Intercultural',
  description:
    "Página web responsiva educativa basada en el modelo STEAM dirigida a hablantes del náhuatl de 10 a 15 años, permitiéndoles aprender con actividades interactivas en su lengua materna.",
  image: 'https://source.unsplash.com/random',
  imageText: 'main image description',
  linkText: 'Crear una cuenta gratis',
};

const featuredPosts = {
    title: 'STEAM',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageLabel: 'Image Text',
};

const cards = [
  {
    title: "Aylín Aldana y Athziri Rodríguez",
    subtitle: "Desarrollo",
    description: "mmmmmmmmmmmmmmmmmmm",
    image: "https://source.unsplash.com/random",
    imageLabel: "Image Text"
  },
  {
    title: "María Obdulia González Fernández",
    subtitle: "Mentoría",
    description: "mmmmmmmmmmmmmmmmm",
    image: "https://source.unsplash.com/random",
    imageLabel: "Image Text"
  },
  {
    title: "Nombre",
    subtitle: "Contenido y traducción",
    description: "mmmmmmmmmmmmmmmmm",
    image: "https://source.unsplash.com/random",
    imageLabel: "Image Text"
  }
];


const footerInfo = {
  social: [
    { name: 'Instagram', icon: Instagram },
    { name: 'Twitter', icon: Twitter },
    { name: 'Facebook', icon: Facebook },
  ]
};


const theme = createTheme();

export const SteamPage = () => {
  
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true); // Nuevo estado
  let timeOut = null;

  const handleGroupChange = (index) => {
    setCurrent(index);
    setAutoPlay(true); // Habilita el autoplay al cambiar de grupo
    clearTimeout(timeOut); // Limpiar el timeout actual
  };

  useEffect(() => {
    if (autoPlay) {
      timeOut = setTimeout(() => {
        setCurrent((current) => (current === areas.length - 1 ? 0 : current + 1));
      }, 6000);
    }
  }, [current, autoPlay]);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="STEAM" sections={sections} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />

          <Grid container spacing={5} sx={{ mt: 3 }}>


          <Container maxWidth="lg">

            <Typography
                component="h2"
                variant="h3"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Steam Intercultural Page
            </Typography>


          <Grid container spacing={4} sx={{ mt: 2 }}>
            {/* Carousel */}

            <Grid container justifyContent="center">
              <ToggleButtonGroup
                value={current}
                color="primary"
                exclusive
                onChange={handleGroupChange}
                aria-label="Platform"
                sx={{
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <ToggleButton value={0}>STEAM</ToggleButton>
                <ToggleButton value={1}>Ciencia</ToggleButton>
                <ToggleButton value={2}>Tecnología</ToggleButton>
                <ToggleButton value={3}>Ingeniería</ToggleButton>
                <ToggleButton value={4}>Arte</ToggleButton>
                <ToggleButton value={5}>Matemáticas</ToggleButton>
              </ToggleButtonGroup>

            </Grid>

            <Grid item xs={12} justifyContent={"center"}>
              <Carousel images={areas} actual={current} handleGroupChange={handleGroupChange} autoPlay={autoPlay}
                sx={{
                  maxWidth: "100%",
                  justifyContent: "center",
                }}
              />
            </Grid>
          </Grid>

          </Container>
          </Grid>

          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
          <Container maxWidth="sm">
            <Typography
                component="h2"
                variant="h3"
                align="center"
                color="text.primary"
            >
                Personas implicadas
            </Typography>
          </Container>
          </Box>

          <Grid container spacing={4}>
          {cards.map((post) => (
            <Grid item key={post.title} xs={12} sm={6} md={4}>
            <PersonCard post={post} />
          </Grid>
          ))}
          </Grid>

          <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h2"
              variant="h3"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Contacto
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Manda tu feedback estamos constantemente escuchando y mejorando la página
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Contactar</Button>
            </Stack>
          </Container>
        </Box>
          
        </main>
      </Container>

      <Footer
        title="STEAM Intercultural"
        description="2023"
        social={footerInfo.social}
      />
    </ThemeProvider>
  );
}