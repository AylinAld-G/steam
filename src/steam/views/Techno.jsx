import * as React from 'react';
import { Container, Grid, ThemeProvider, createTheme} from '@mui/material';
import Footer from '../components/Footer';
import { PostsList } from '../components/PostsList';

const theme = createTheme();

export const Techno = () => {

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Grid>
            <PostsList/>
          </Grid>
          <Footer
            title="STEAM Intercultural"
            description="2023"
          />
        </Container>
      </ThemeProvider>
    </>
)
}
