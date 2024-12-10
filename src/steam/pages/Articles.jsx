import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@emotion/react';
import { Box, Button, Container, CssBaseline, Fab, Grid, IconButton, MobileStepper, Slide, Tooltip, Typography, createTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Add, ArrowBack} from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore, useSteamStore } from '../../hooks';
import ArticleViewEd from '../components/ArticleViewEd';
import Footer from '../components/Footer';


  const theme = createTheme();

  export const Articles = () => {
    const { t } = useTranslation();
    const { publications, startLoadingArticles } = useSteamStore();
    const [authorId, setAuthorId] = useState(null);
    
    // Cargar artículos al montar el componente
    useEffect(() => {
      const user = localStorage.getItem('user')
      const userObject = JSON.parse(user);
      const storedAuthorId = userObject.uid

      setAuthorId(storedAuthorId);
      startLoadingArticles();
  }, []);

  const filteredPublications = publications.filter(post => post[1] === authorId);

    return (
      
      <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: "relative",
            marginTop: "3%",
            marginBottom: "2%",
            textAlign: "center", 
          }}
        >
      <IconButton
        sx={{
          position: "absolute",
          top: 0,
          left: 0, 
        }}
        component={Link}
        to="/" 
      >
        <ArrowBack />
      </IconButton>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{
            fontFamily: 'Didact Gothic, sans-serif',
            marginTop: '3%',
            fontSize: { xs: '2.5rem', md: '3rem' },
          }}
        >
          {t("articles")}
        </Typography>
  
        {/*<Grid container spacing={3}>*/}

        {filteredPublications && filteredPublications.length > 0 ? (
            filteredPublications.map((post) => {
          const id = post[0];
          return (
            <>
            <Grid item xs={12} sm={6} md={4} key={post[0]}>
              <ArticleViewEd id={id} post={post} />
            </Grid>

              <Box sx={{ position: 'fixed', bottom: '60px', right: '98px',
                '@media (max-width: 600px)': {
                  bottom: '10px', 
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
            </>
          );
        }))
      : (
        <>
            <Typography variant="h6" align="center" color="text.secondary" sx={{fontFamily: 'Didact Gothic, sans-serif',}}>
              Aun no hay artículos
            </Typography>

          <Box sx={{ position: 'fixed', bottom: '60px', right: '98px',
            '@media (max-width: 600px)': {
              bottom: '10px', 
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
        </>


          )}
        {/*</Grid>*/}


      </Container>
      </ThemeProvider>
    
        )}
