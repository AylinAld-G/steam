import * as React from 'react';
import PropTypes from 'prop-types';
import {Paper, Box, Typography, Grid, Link, Button} from '@mui/material';
import { NavLink } from 'react-router-dom';

function MainFeaturedPost(props) {
  const { post } = props;


  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${post.image})`,
        marginTop: "2%"
      }}
    >
      {<img style={{ display: 'none' }} src={post.image} alt={post.imageText} />}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.3)',
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
            <Typography component="h1" variant="h3" color="inherit" gutterBottom 
            sx={{ fontFamily: 'Didact Gothic, sans-serif',
                  fontSize: { xs: '2rem', md: '3.75rem', lg: '4rem' }, // Tamaño de fuente para diferentes tamaños de pantalla
                  marginBottom: { xs: '16px', md: '24px' },}}>
              {post.title}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph 
              sx={{ fontFamily: 'Didact Gothic, sans-serif', fontSize: { xs: '1rem', md: '1.25rem', lg: '1.75rem'} }}>
              {post.description}
            </Typography>

            <NavLink to="/users/auth">
              <Button variant="contained" 
              sx={{ fontFamily: 'Didact Gothic, sans-serif', borderRadius:"30px", fontSize: { xs: '0.875rem', md: '1rem' } }}
              >
                {post.linkText}
              </Button>
            </NavLink>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

MainFeaturedPost.propTypes = {
  post: PropTypes.shape({
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageText: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default MainFeaturedPost;
