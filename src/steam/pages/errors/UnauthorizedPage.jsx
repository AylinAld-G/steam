import { Box, Container, CssBaseline, GlobalStyles, ThemeProvider, Typography, createTheme } from '@mui/material'
import React from 'react'

const theme = createTheme();

export const UnauthorizedPage = () => {
  return (
    <ThemeProvider theme={theme}>
    <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
    <CssBaseline/>
    <Container disableGutters maxWidth="lg" component="main" sx={{ pt: 8 }}>
      <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
        }}
      >
      
      <Box>
        <Box
            component="img"
            src="../../../public/images/lock.jpg"
            sx={{
                marginBottom: 2,
                width: {
                    xs: '100px',  // tamaño para pantallas pequeñas
                    sm: '150px',  //pantallas medianas
                    md: '200px',  //pantallas grandes
                    lg: '280px',  //pantallas muy grandes
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
      403
      </Typography>

      <Typography 
          variant="h3" 
          align="center" 
          color="text.primary" 
          component="p" 
          sx={{
              fontFamily: 'Didact Gothic, sans-serif',
              marginTop: 0,
              fontSize: {
                  xs: '1.5rem',  
                  sm: '2rem', 
                  md: '2.5rem',  
                  lg: '3rem',  
              }
          }}
      >
      Acceso denegado
      </Typography>

      <Typography 
          variant="h5" 
          align="center" 
          color="text.secondary" 
          component="p" 
          sx={{
              fontFamily: 'Didact Gothic, sans-serif',
              marginTop: 0,
              marginBottom: 10,
              mx:2,
              fontSize: {
                  xs: '1rem', 
                  sm: '1.5rem', 
                  md: '2rem',  
                  lg: '2.5rem',  
              }
          }}
      >
      No tienes permisos para acceder a esta página
      </Typography>
      
      </Box>
    </Container>
    </ThemeProvider>
  )
}
