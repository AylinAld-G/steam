import * as React from 'react';
import { Typography, Grid, Divider, Container, ThemeProvider, createTheme, Paper, Box, CardMedia, Stack, Button} from '@mui/material';
import Header from './Header';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Link, useParams } from 'react-router-dom';
import Comments from './Comments';
import { useSteamStore } from '../../hooks';

const sections = [
  { title: 'science', url: '/science/publications', icon: '../../../public/images/scienceIcon.png' },
  { title: 'tech', url: '/tech/publications', icon: '../../../public/images/technoIcon.png'  },
  { title: 'eng', url: '/engine/publications', icon: '../../../public/images/engineIcon.png'  },
  { title: 'art', url: '/art/publications', icon: '../../../public/images/artIcon.jpg'  },
  { title: 'math', url: '/math/publications', icon: '../../../public/images/mathIcon.jpg'  }
];


const theme = createTheme();

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const Article = () => {

  const { id } = useParams();
  const adjustedIndex = parseInt(id);
  const { t } = useTranslation();
  const { publications, activeArticle } = useSteamStore();   


  // Encuentrar artículo según el índice
  const post = publications[parseInt(adjustedIndex)];

  if (isNaN(adjustedIndex) || adjustedIndex < 0 || adjustedIndex >= publications.length || !post) {
    return <Redirect to="/not-found" />;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
      <Header title="STEAM" sections={sections.map(section => ({ title: t(section.title), url: section.url, icon: section.icon }))}/>
      <Grid>
          <div key={post.id}>
            <Container>
              <Paper
              sx={{
                backgroundColor: 'grey.800',
                color: '#fff',
                mb: 4,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${post.image})`,}}
              />
              <Box p={2}>
                <Typography component="h2" variant="h4" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                {post.title}
                </Typography>
                <CardMedia
                  component="img"
                  alt={post.imageLabel}
                  height="350px"
                  src={post.image}
                  sx={{borderRadius:"4px", marginTop:"3%", marginBottom:"2%"}}
                />
                <Typography variant="subtitle1" color="text.secondary" sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize:'1.15rem' }}>
                  {post.author}
                </Typography>
                <Typography variant="subtitle1" paragraph sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize:'1.15rem' }}>
                  {post.description}
                </Typography>
              </Box>

            </Container>
            <Grid>

              <Container maxWidth="lg">
                <Divider/>
                <Comments postId={post.id}/>
              </Container>
            </Grid>
          </div>
      </Grid>
      </Container>
      </ThemeProvider>

    </>
  );
}
