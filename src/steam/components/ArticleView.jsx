import * as React from 'react';
import PropTypes from 'prop-types';
import {Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Fab, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSteamStore } from '../../hooks';


function ArticleView(props) {
  const { post, id } = props;

  const {t} = useTranslation();

  const cardLinkStyle = {
    textDecoration: 'none', // Quitar subrayado del Link
  };


  return (
    <Grid item xs={12}>
      <Link to={`/publications/${id}`} style={cardLinkStyle}>
        <CardActionArea component="a">
          <Card sm={{ display: 'flex', marginTop: "8%", marginBottom: "8%", width: '100%' }}>
            <CardContent md={{ flex: 1 }}>
                         
              <CardMedia
                component="img"
                sx={{
                  width: '100%',  // Imagen de ancho completo en todas las vistas
                  height: 'auto',  // Mantener la proporción de la imagen
                  display: { sm: 'block', md: 'block' },  // Mostrar la imagen en ambas vistas
                }}
                image={post[5]}
              />
              <Typography component="h2" variant="h5" sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>
                {post[4]}
              </Typography>
              <Typography variant="subtitle1" paragraph sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>
                {post[6]}
              </Typography>
              <Typography variant="subtitle1" color="primary" sx={{ fontFamily: 'Didact Gothic, sans-serif' }}>
                {t("keepReading")}
              </Typography>
            </CardContent>
            
          </Card>
        </CardActionArea>
      </Link>
    </Grid>
  )
}

ArticleView.propTypes = {
  id: PropTypes.string.isRequired,
post: PropTypes.array.isRequired
};

export default ArticleView;
