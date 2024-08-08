import * as React from 'react';
import {CssBaseline, Grid, Container, Typography, Box, Stack, ToggleButtonGroup, ToggleButton, useMediaQuery, IconButton, Paper, MobileStepper} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { KeyboardArrowLeft, KeyboardArrowRight} from '@mui/icons-material'
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ScrollToTop from 'react-scroll-to-top'

import Header from '../components/Header';
import MainFeaturedPost from '../components/MainFeaturedPost';
import Footer from '../components/Footer';
import PersonCard from '../components/PersonCard';
import Carousel from '../components/Carousel';
import { areas } from "../components/Data";
import { ContactModal } from '../components/ContactModal';


const sections = [
  { title: 'science', url: '/publications', category: 'ciencia', icon: '../../../public/images/scienceIcon.png' },
  { title: 'tech', url: '/publications', category: 'tecnología', icon: '../../../public/images/technoIcon.png'  },
  { title: 'eng', url: '/publications', category: 'ingeniería', icon: '../../../public/images/engineIcon.png'  },
  { title: 'art', url: '/publications', category: 'arte', icon: '../../../public/images/artIcon.jpg'  },
  { title: 'math', url: '/publications', category: 'matemáticas', icon: '../../../public/images/mathIcon.jpg'  }
];


const mainFeaturedPost = {
  title: 'STEAM Intercultural',
  description:
    "Página web responsiva educativa basada en el modelo STEAM dirigida a hablantes del náhuatl de 10 a 15 años, permitiéndoles aprender con actividades interactivas en su lengua materna.",
  image: 'https://picsum.photos/800/200?random',
  imageText: 'main image description',
  linkText: 'Crear una cuenta gratis',
};


const cards = [
  {
    title: "Aylín Aldana y Athziri Rodríguez",
    subtitle: "dev",
    image1: "https://picsum.photos/200/200?random",
    image2: "https://picsum.photos/250/250?random",
    imageLabel: "Image Text"
  },
  {
    title: "María Obdulia González Fernández",
    subtitle: "mentor",
    image: "https://picsum.photos/200/200?random",
    imageLabel: "Image Text"
  },
  {
    title: "Nombre",
    subtitle: "trad",
    image: "https://picsum.photos/200/200?random",
    imageLabel: "Image Text"
  }
];


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
      }, 7000);
    }
  }, [current, autoPlay]);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeCard, setActiveCard] = React.useState(0);
  const maxCards = cards.length;

  const handleNext = () => {
    setActiveCard((prevActiveCard) => prevActiveCard + 1);
  };

  const handleBack = () => {
    setActiveCard((prevActiveCard) => prevActiveCard - 1);
  };

  const { t } = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="STEAM" sections={sections.map(section => ({ title: t(section.title), url: section.url, category: section.category, icon: section.icon }))}/> {/* Font family: Comfortaa*/}
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
                sx={{ fontFamily: 'Didact Gothic, sans-serif', fontSize: { xs: '2.5rem', md: '4rem',  }, marginLeft:{xs: "6%"}, 
                '@media (max-width: 350px )': {
                  marginLeft: '12%'
                } }}
              >
                STEAM Intercultural Page
            </Typography>


          <Grid container spacing={4} sx={{ mt: 2 }} justifyContent="center" alignItems="center">
            {/* Carousel */}

            <Grid container justifyContent="center" alignItems="center">
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
                  marginLeft:{xs: "10%"},
                  '@media (max-width: 370px )': {
                    marginLeft: '15%'
                  }
                }}
              >
                <ToggleButton value={0} sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>STEAM</ToggleButton>
                <ToggleButton value={1} sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>{t("science")}</ToggleButton>
                <ToggleButton value={2} sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>{t("tech")}</ToggleButton>
                <ToggleButton value={3} sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>{t("eng")}</ToggleButton>
                <ToggleButton value={4} sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>{t("art")}</ToggleButton>
                <ToggleButton value={5} sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>{t("math")}</ToggleButton>
              </ToggleButtonGroup>

            </Grid>

            <Grid item xs={12} justifyContent={"center"}>
              <Carousel images={areas} actual={current} handleGroupChange={handleGroupChange} autoPlay={autoPlay}
                sx={{
                  maxWidth: "100%",
                  justifyContent: "center",
                  '@media (max-width: 1088px)': {
                    height: '50%'
                  },
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
                marginBottom='0px'
                sx={{ fontFamily: 'Didact Gothic, sans-serif',
                '@media (max-width: 400px)': { // Estilos para pantallas pequeñas
                  fontSize: '2.45rem', // Cambia el tamaño de fuente para pantallas pequeñas
                },
                '@media (max-width: 290px)': { // Estilos para pantallas aún más pequeñas
                  fontSize: '2.10rem', // Cambia el tamaño de fuente para pantallas muy pequeñas
                }, }}
            >
                {t("contributors")}
            </Typography>
          </Container>
          </Box>

          {isSmallScreen ? (
            <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
              <Paper
                square
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 50,
                  pl: 2,
                  bgcolor: 'background.default',
                }}
              >

              </Paper>
              <Box sx={{ height: 255, maxWidth: 400, width: '100%', p: 2, marginBottom: 10}}>
                <PersonCard post={{ ...cards[activeCard] }} isFirstCard={activeCard === 0} />
              </Box>
              <MobileStepper
                variant="dots"
                steps={maxCards}
                position="static"
                activeStep={activeCard}
                nextButton={
                  <IconButton size="small" onClick={handleNext} disabled={activeCard === maxCards - 1}>
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                  </IconButton>
                }
                backButton={
                  <IconButton size="small" onClick={handleBack} disabled={activeCard === 0}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  </IconButton>
                }
              />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {cards.map((post, index) => (
                <Grid item key={post.title} xs={12} sm={6} md={4}>
                  <PersonCard post={{ ...post }} isFirstCard={index === 0} />
                </Grid>
              ))}
            </Grid>
          )}

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
            sx={{ fontFamily: 'Didact Gothic, sans-serif',
            '@media (max-width: 380px)': { // Estilos para pantallas pequeñas
              fontSize: '2rem', // Cambia el tamaño de fuente para pantallas pequeñas
            }, }}
          >
            {t("contact")}
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" 
          sx={{ fontFamily: 'Didact Gothic, sans-serif',
          '@media (max-width: 380px)': { // Estilos para pantallas pequeñas
            fontSize: '1.25rem', // Cambia el tamaño de fuente para pantallas pequeñas
          },
          }} paragraph>
            Si tienes dudas, ideas para mejorar, o simplemente quieres compartir tu experiencia con STEAM Intercultural, no dudes en ponerte en contacto con nosotros haciendo click en el botón inferior.
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <ContactModal/>
          </Stack>
        </Container>
        </Box>

        <Box sx={{ '& > :not(style)': { m: 6 },}}>
          <ScrollToTop smooth color="#FFF" height='22px'
            style={{borderRadius:"30px", width: "50px", height:"50px", backgroundColor:"#2979ff", padding:"5px", 
            bottom: '1px', right: '1px',}}/>
        </Box>
          
        </main>
      </Container>

      <Footer
        title="STEAM Intercultural"
        description="2023"
      />
    </ThemeProvider>
  );
}
