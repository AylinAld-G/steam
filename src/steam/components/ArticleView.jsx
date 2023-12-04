import * as React from 'react';
import PropTypes from 'prop-types';
import {Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Fab, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSteamStore } from '../../hooks';


function ArticleView(props) {
  const { post, id, category } = props;

  const {t} = useTranslation();

  const cardLinkStyle = {
    textDecoration: 'none', // Quitar subrayado del Link
  };

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Detecta si la pantalla es de 600px o menos
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <Grid item xs={16}>
        <Link to={`/${category}/publications/${id}`} style={cardLinkStyle}>
        <CardActionArea component="a">
        <Card sx={{ display: 'flex', marginTop:"8%", marginBottom:"8%"}}>
          <CardContent sx={{ flex: 1}}>
            {isMobile && (
              <CardMedia
              component="img"
              sx={{ width: '100%', height: '26%', display: 'block' }}
              image={post.image}
              alt={post.imageLabel}
              />)
            }
            <Typography component="h2" variant="h5" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
              {post.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
              {post.author}
            </Typography>
            <Typography variant="subtitle1" paragraph sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
              {post.description}
            </Typography>
            <Typography variant="subtitle1" color="primary" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
              {t("keepReading")}
            </Typography>
          </CardContent>
          {!isMobile && (
                <CardMedia
                component="img"
                sx={{ width: { xs: '100%', sm: '50%' }, display: { xs: 'none', sm: 'block' } }}
                image={post.image}
                alt={post.imageLabel}
                />
            )}
 
        </Card>
      </CardActionArea>
      </Link>
    </Grid>
  );
}

ArticleView.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string,
    title: PropTypes.string.isRequired,
  }).isRequired,
  id: PropTypes.number.isRequired, // id
  category: PropTypes.string.isRequired,
};

export default ArticleView;