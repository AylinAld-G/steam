import { Container, CssBaseline, GlobalStyles, ThemeProvider, Typography, createTheme, Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';

const theme = createTheme();

export const NotFoundPage = () => {
  return (
    <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline/>
        <Container disableGutters maxWidth="lg" component="main" sx={{ pt: 8}}>
            <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", 
                textAlign: "left", 
            }}
            >
                <img
                    src="../../../public/images/notFound.jpg"
                    style={{ marginBottom: 0, maxWidth: "180px", maxHeight: "170px" }}
                />
                <div>
                    <Typography
                    component="h1"
                    variant="h1"
                    align="center"
                    color="text.primary"
                    gutterBottom
                    sx={{fontFamily: 'Didact Gothic, sans-serif', fontWeight: 'bolder'}}
                    >
                    404
                    </Typography>
                    <Typography variant="h3" align="center" color="text.primary" component="p" sx={{fontFamily: 'Didact Gothic, sans-serif', marginTop:0}}>
                    Página no encontrada
                    </Typography>

                    <Typography variant="h5" align="center" color="text.secondary" component="p" sx={{fontFamily: 'Didact Gothic, sans-serif', marginTop:0}}>
                    Lo sentimos, no se ha podido encontrar la página solicitada. 
                    Por favor, vuelva a la página de inicio
                    </Typography>

                    <div style={{textAlign:'center'}}>
                    <Link to='/'>
                        <Button variant='contained' sx={{fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", top: "20px", bottom: "15px"}}>
                            Volver a Inicio
                        </Button>
                    </Link>
                    </div>

                </div>
            </div>

      </Container>
    </ThemeProvider>
  )
}
