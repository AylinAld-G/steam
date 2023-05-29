import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Divider } from '@mui/material';

const theme = createTheme();

export default function PersonCard(props) {
  const { post } = props;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
            <Card sx={{ height: "100%",display: 'flex', flexDirection: 'column'}}>
              <CardMedia component="img" sx={{ borderRadius: '60%',
                width: 200,
                height: 200,
                objectFit: 'cover',
                margin: 'auto',
                border: '2px solid #fff',}} 
              image={post.image} alt={post.imageLabel} />
              <CardContent sx={{ flex: 1 }}>
                <Typography component="h3" variant="h4">
                  {post.title}
                </Typography>
                <Divider component="h1" />
                <Typography component="subtitle1" variant="h6">
                  {post.subtitle}
                </Typography>
                <Typography variant="subtitle1" paragraph>
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
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
  }).isRequired,
};
