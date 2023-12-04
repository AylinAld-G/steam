import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Avatar, AvatarGroup, Divider } from '@mui/material';

const theme = createTheme();

export default function PersonCard(props) {
  const { post, isFirstCard } = props;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
            <Card sx={{ height: "100%",display: 'flex', flexDirection: 'column'}}>
              <AvatarGroup max={isFirstCard ? 2 : 1} sx={{justifyContent:'center'}}>
                <Avatar src={isFirstCard ? post.image1 : post.image} 
                sx={{ width: 170, height: 170,
                    '@media (max-width: 780px)': {
                      width: 120,
                      height: 120,},
                      '@media (max-width: 599px)': {
                        width: 170,
                        height: 170,},
                        '@media (max-width: 380px)': {
                          width: 120,
                          height: 120,},
                  }}/>
                {isFirstCard && <Avatar src={post.image2} 
                  sx={{ width: 170, height: 170, 
                    '@media (max-width: 780px)': {
                      width: 120,
                      height: 120,},
                      '@media (max-width: 599px)': {
                        width: 170,
                        height: 170,},
                        '@media (max-width: 380px)': {
                          width: 120,
                          height: 120,}, }} />}
              </AvatarGroup>
              <CardContent sx={{ flex: 1 }}>
                <Typography component="h3" variant="h4" sx={{ fontFamily: 'Didact Gothic, sans-serif', 
                  '@media (max-width: 780px)': {
                    fontSize: '1.75rem'},
                    '@media (max-width: 599px)': {
                      fontSize:'2.15rem'},
                  '@media (max-width: 380px)': {
                    fontSize: '1.75rem'} }}>
                  {post.title}
                </Typography>
                <Divider component="h1" />
                <Typography component="subtitle1" variant="h6" color='text.secondary' sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>
                  {post.subtitle}
                </Typography>
                <Typography variant="subtitle1" paragraph sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>
                  {post.description}
                </Typography>
              </CardContent>
            </Card>
      </main>
    </ThemeProvider>
  );
}

PersonCard.propTypes = {
  post: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    image1: PropTypes.string, 
    image2: PropTypes.string,
    imageLabel: PropTypes.string,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
  }).isRequired,
  isFirstCard: PropTypes.bool.isRequired,
};

