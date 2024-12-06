import { ThemeProvider } from '@emotion/react';
import { Box, Button, Container, CssBaseline, Grid, IconButton, MobileStepper, Typography, createTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight} from '@mui/icons-material'
import React, { useEffect } from 'react'
import Header from './Header';
import ArticleView from './ArticleView';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useSteamStore } from '../../hooks';


const sections = [
  { title: 'science', url: '/publications', category: 'ciencia', icon: '../../../public/images/scienceIcon.png' },
  { title: 'tech', url: '/publications', category: 'tecnología', icon: '../../../public/images/technoIcon.png'  },
  { title: 'eng', url: '/publications', category: 'ingeniería', icon: '../../../public/images/engineIcon.png'  },
  { title: 'art', url: '/publications', category: 'arte', icon: '../../../public/images/artIcon.jpg'  },
  { title: 'math', url: '/publications', category: 'matemáticas', icon: '../../../public/images/mathIcon.jpg'  }
];

  const theme = createTheme();


export const PostsList = () => {
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = React.useState(true);

  const { publications, startLoadingArticles } = useSteamStore();  
  const [activeCategory, setActiveCategory] = React.useState(null); 

   //Cargar desde DB
  useEffect(() => {
    startLoadingArticles();
  }, []);

  useEffect(() => {
    const storedCategory = localStorage.getItem('activeCategory'); 
    if (storedCategory) {
      setActiveCategory(storedCategory);
    }
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

  const filteredPublications = activeCategory
  ? publications.filter(post => post[2] === activeCategory)
  : publications;



  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = filteredPublications.length;  //publications
  const itemsPerPage = 2;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + itemsPerPage, maxSteps - 1));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - itemsPerPage, 0));
  };

  const visibleArticles = filteredPublications.slice(activeStep, activeStep + itemsPerPage);  //publications

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
      <Header title="STEAM" sections={
          sections.map(section => ({ title: t(section.title), url: section.url, category: section.category, icon: section.icon }))
        }/>
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


        {isMobile ? (
        <>
          <Grid container justifyContent="center" alignItems="center" sx={{ marginTop: "1%" }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {visibleArticles.length > 0 ? (
                visibleArticles.map((post) => (
                  <Grid item key={post[0]}  >
                    <div style={{ width: '100%', margin: '5px' }}>
                      <ArticleView id={post[0]} post={post} />
                    </div>
                  </Grid>
                ))
              ) : (
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 1,
                    bgcolor: '#F8F8FF',
                  }}
                />
              )}
            </div>
          </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <MobileStepper
            variant="dots"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            sx={{ maxWidth: 400, flexGrow: 1, 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 'auto',
              [theme.breakpoints.up('sm')]: {
                maxWidth: 400, 
              }, }}
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
          </Box>
        </>
      ) : (
        <Grid container sx={{ display: isMobile ? "none" : "flex", justifyContent: "center", marginTop: "1%" }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
            </IconButton>
            {visibleArticles.length > 0 ? (
              visibleArticles.map((post) => (
                <Grid item key={post[0]}>
                  <div style={{ width: '100%', margin: '5px' }}>
                    <ArticleView id={post[0]} post={post} />
                  </div>
                </Grid>
              ))
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
                <Typography variant="h5">No hay artículos disponibles</Typography>
              </Box>
            )}

            <IconButton onClick={handleNext} disabled={activeStep + itemsPerPage >= maxSteps}>
              <KeyboardArrowRight />
            </IconButton>
          </div>
        </Grid>
  )}
      </Container>
    </ThemeProvider>
  )
}
