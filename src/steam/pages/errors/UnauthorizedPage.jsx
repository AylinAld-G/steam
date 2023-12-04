import { Container, CssBaseline, GlobalStyles, ThemeProvider, Typography, createTheme } from '@mui/material'
import React from 'react'

const theme = createTheme();

export const UnauthorizedPage = () => {
  return (
    <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline/>
        <Container disableGutters maxWidth="lg" component="main" sx={{ pt: 8}}>
            <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center", 
                textAlign: "left", 
            }}
            >
                <img
                    src="../../../public/images/lock.jpg"
                    style={{ marginRight: 4, maxWidth: "280px", maxHeight: "280px",
                    '@media (maxWidth: 760px)':{
                      maxWidth: "100px",
                      maxHeight: "100px",
                    }
                  }}
                />
                <div>
                    <Typography
                    component="h1"
                    variant="h1"
                    align="center"
                    color="text.primary"
                    gutterBottom
                    sx={{fontFamily: 'Didact Gothic, sans-serif', fontWeight: 'bolder', }}
                    >
                    403
                    </Typography>
                    <Typography variant="h3" align="center" color="text.primary" component="p" sx={{fontFamily: 'Didact Gothic, sans-serif', marginTop:0}}>
                    Acceso denegado
                    </Typography>

                    <Typography variant="h5" align="center" color="text.secondary" component="p" sx={{fontFamily: 'Didact Gothic, sans-serif', marginTop:0}}>
                    No tienes permisos para acceder a esta página
                    </Typography>

                </div>
            </div>

      </Container>
    </ThemeProvider>
  )
}
