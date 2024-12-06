import * as React from 'react';
import { Typography, Grid, Divider, Container, ThemeProvider, createTheme, Paper, Box, CardMedia, Button, CircularProgress} from '@mui/material';
import Header from './Header';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Link, NavLink, useParams } from 'react-router-dom';
import Comments from './Comments';
import { useSteamStore } from '../../hooks';

const sections = [
  { title: 'science', url: '/publications', category: 'ciencia', icon: '../../../public/images/scienceIcon.png' },
  { title: 'tech', url: '/publications', category: 'tecnología', icon: '../../../public/images/technoIcon.png'  },
  { title: 'eng', url: '/publications', category: 'ingeniería', icon: '../../../public/images/engineIcon.png'  },
  { title: 'art', url: '/publications', category: 'arte', icon: '../../../public/images/artIcon.jpg'  },
  { title: 'math', url: '/publications', category: 'matemáticas', icon: '../../../public/images/mathIcon.jpg'  }
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
  const { t } = useTranslation();
  const { publications, startLoadingArticles } = useSteamStore(); 
  const [isLoading, setIsLoading] = React.useState(true);  


  React.useEffect(() => {
    setIsLoading(true)
    startLoadingArticles();
    setIsLoading(false)

  }, []);

  const post = publications.find((article) => article[0] === id);

  /*if (!post) {
    return <Navigate to="/not-found" />;
  }*/

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
      <Header title="STEAM" sections={sections.map(section => ({ title: t(section.title), category: section.category, url: section.url, icon: section.icon }))}/>
      <Grid>
          <div key={post[0]}>
            <Container>
              <Paper
              sx={{
                backgroundColor: 'grey.800',
                color: '#fff',
                mb: 4,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${post[5]})`,}}
              />
              <Box p={2}>
                <Typography component="h2" variant="h4" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                {post[4]}
                </Typography>
                <CardMedia
                  component="img"
                  height="350px"
                  src={post[5]}
                  sx={{borderRadius:"4px", marginTop:"3%", marginBottom:"2%"}}
                />
                <Typography variant="subtitle1" paragraph sx={{fontFamily: 'Didact Gothic, sans-serif', fontSize:'1.15rem' }}>
                  {post[6]}
                </Typography>
              </Box>

            </Container>
            <Grid>

              <Container maxWidth="lg">
                <Divider/>
                <NavLink to= {`/comments/${id}`}>
                  <Comments postId={post[0]}/>
                </NavLink>
              </Container>
            </Grid>
          </div>
      </Grid>
      </Container>
      </ThemeProvider>

    </>
  );
}
