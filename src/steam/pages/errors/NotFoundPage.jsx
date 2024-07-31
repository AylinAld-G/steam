import { Container, CssBaseline, GlobalStyles, ThemeProvider, Typography, createTheme, Button, Box } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';

const theme = createTheme();

export const NotFoundPage = () => {
  return (
    <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline/>
        <Container disableGutters maxWidth="lg" component="main" sx={{ pt: 8}}>
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "left",
        }}
        >
        
        <Box>
            <Box
            component="img"
            src="../../../public/images/notFound.jpg"
            sx={{
                marginBottom: 2,
                width: {
                    xs: '100px',  // tamaño para pantallas pequeñas
                    sm: '140px',  //pantallas medianas
                    md: '170px',  //pantallas grandes
                    lg: '180px',  //pantallas muy grandes
                },
                height: 'auto',
            }}
            />
        </Box>

        <Typography
        component="h1"
        variant="h1"
        align="center"
        color="text.primary"
        gutterBottom
        sx={{
            fontFamily: 'Didact Gothic, sans-serif',
            fontWeight: 'bolder',
            fontSize: {
                xs: '2rem',
                sm: '3rem', 
                md: '4rem',
                lg: '5rem',  
            }
        }}
        >
        404
        </Typography>
        <Typography variant="h3" align="center" color="text.primary" component="p" 
        sx={{fontFamily: 'Didact Gothic, sans-serif',
            marginTop: 0,
            mx:3,
            fontSize: {
                xs: '1.5rem',  
                sm: '2rem', 
                md: '2.5rem',  
                lg: '3rem',  
            }
        }}>
        Página no encontrada
        </Typography>

        <Typography variant="h5" align="center" color="text.secondary" component="p" 
        sx={{
            fontFamily: 'Didact Gothic, sans-serif',
            marginTop: 0,
            marginBottom: 4,
            mx:3,
            fontSize: {
                xs: '1rem', 
                sm: '1.5rem', 
                md: '2rem',  
                lg: '2.5rem',  
            }
        }}>
        Lo sentimos, no se ha podido encontrar la página solicitada. 
        Por favor, vuelva a la página de inicio
        </Typography>

        <div style={{textAlign:'center'}}>
        <Link to='/'>
            <Button variant='contained' sx={{fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", top: "10px", bottom: 10}}>
                Volver a Inicio
            </Button>
        </Link>
        </div>

        </Box>

      </Container>
    </ThemeProvider>
  )
}

