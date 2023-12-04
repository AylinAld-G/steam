import React, { useEffect } from 'react'
import { ThemeProvider } from '@emotion/react';
import { Box, Button, Container, CssBaseline, Fab, Grid, IconButton, MobileStepper, Slide, Tooltip, Typography, createTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Add} from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuthStore } from '../../hooks';
import ArticleViewEd from '../components/ArticleViewEd';
import Footer from '../components/Footer';


const sections = [
    { title: 'science', url: '/science', icon: '../../../public/images/scienceIcon.png' },
    { title: 'tech', url: '/tech', icon: '../../../public/images/technoIcon.png'  },
    { title: 'eng', url: '/engine', icon: '../../../public/images/engineIcon.png'  },
    { title: 'art', url: '/art', icon: '../../../public/images/artIcon.jpg'  },
    { title: 'math', url: '/math', icon: '../../../public/images/mathIcon.jpg'  }
  ];


  const theme = createTheme();

export const Articles = () => {
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = React.useState(true);
  //const {user} = useAuthStore();
  
  const { publications, startLoadingArticles } = useSteamStore();

  useEffect(() => {
    startLoadingArticles();
  }, []);


  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language');

    // Verifica si hay un idioma guardado en localStorage y establece la traducción
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  React.useEffect(() => {
    // Detecta si la pantalla es de 1000px o menos
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const location = useLocation();

  const activeSection = sections.find((section) => location.pathname.startsWith(section.url));
  const category = activeSection ? activeSection.title : 'defaultCategory';


  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = publications.length;
  const itemsPerPage = 2;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + itemsPerPage, maxSteps - 1));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - itemsPerPage, 0));
  };

  const visibleArticles = publications.slice(activeStep, activeStep + itemsPerPage);

  const handleNextM = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackM = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
      <Header title="STEAM" sections={sections.map(
        section => ({ title: t(section.title), url: section.url, icon: section.icon })
      )}/>
        <Grid>
          <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontFamily: 'Didact Gothic, sans-serif', marginTop: '3%', fontSize: { xs: '2.5rem', md: '3rem',  }, marginLeft:{xs: "6%"} }}
          >
          {t("articles")}
          </Typography>
        </Grid>

        <Grid container sx={{display: isMobile ? "none" : "flex"}}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
            </IconButton>
          {visibleArticles.map((post, index) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <div style={{ width: '100%', margin: '5px'}}>
                <ArticleViewEd key={post.id} post={post} id={activeStep * itemsPerPage + index} category={category}/>
              </div>
            </Grid>
          ))}
          <IconButton onClick={handleNext} disabled={activeStep + itemsPerPage >= maxSteps}>
            <KeyboardArrowRight />
          </IconButton>
          </div>
        </Grid>


        {isMobile ? (
          <Grid container justifyContent="center" alignItems="center" sx={{marginTop:"1%"}}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={12} sm={6} md={4}>
              <div style={{ width: '100%'}}>
                <ArticleViewEd key={visibleArticles[0].id} post={visibleArticles[0]} id={visibleArticles[0].id} category={category}/>
              </div>
            </Grid>
          </div>

          <MobileStepper
            variant="dots"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            sx={{ maxWidth: 400, flexGrow: 1 }}
            nextButton={
              <Button
                size="small"
                onClick={handleNextM}
                disabled={activeStep === maxSteps - 1}
              >
                Siguiente
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBackM} disabled={activeStep === 0}>
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                {t("prev")}
              </Button>
            }
          />
          </Grid>
        ): null}
        
        <Box sx={{ position: 'fixed', bottom: '60px', right: '98px',
        '@media (max-width: 600px)': {
            bottom: '10px', // Ajusta la posición en pantallas pequeñas
            right: '10px',
          }
        }} >
          <Tooltip title="Agregar artículo" placement="top">
            <Link to={'/publications/add'} style={{textDecoration: "none"}}>
              <Fab color="primary" aria-label="add">
                <Add />
              </Fab>
            </Link>
          </Tooltip>
        </Box>

      </Container>
      <Footer
          title="STEAM Intercultural"
          description="2023"
        />
    </ThemeProvider>
  )
}
