import * as React from 'react';
import PropTypes from 'prop-types';
import {Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Fab, Box, Tooltip} from '@mui/material';
import { Edit, Delete, Add} from '@mui/icons-material'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EditArticle } from '../pages/EditArticle';


function ArticleViewEd(props) {
  const { post, id, category } = props;

  const {t} = useTranslation();

  const cardLinkStyle = {
    textDecoration: 'none', // Quitar subrayado
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [isEditVisible, setIsEditVisible] = React.useState(false);
  // Muestra u oculta el componente adicional al hacer clic en editar
  const handleEdit = (event) => {
    event.stopPropagation(); 
    setIsEditVisible(!isEditVisible);
  };

  const handleClickOpen = (event) => {
    event.stopPropagation();
  }

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
    <>
    <Grid item xs={16}>
      {isEditVisible ? (<EditArticle/>) 
        : (
            <div>
            <CardActionArea component={Link} to={`/publications/${id}`} style={cardLinkStyle}>
            <Card sx={{ display: 'flex', marginTop:"8%", marginBottom:"8%"}} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}>
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
            {/* Botones flotantes */}
            {isHovered && (
            <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                <Fab color="rgba(255, 255, 255, 0.7)" size="small" aria-label="edit" 
                style={{ marginRight: '10px' }}
                onClick={(event) => handleEdit(event)}
                href={`/publications/update/${index + 1}`}
                >
                <Edit />
                </Fab>

                <Link to={`/publications/delete/${index + 1 }`} style={cardLinkStyle}>
                    <Fab color="rgba(255, 255, 255, 0.7)" size="small" aria-label="delete"
                    onClick={(event) => { event.stopPropagation(); handleClickOpen(event)}}>
                        <Delete />
                    </Fab>
                </Link>
            </div>
            )}
            </Card>
        </CardActionArea>
        </div>)
    }
    </Grid>
    </>
  );
}

ArticleViewEd.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.string,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string,
    title: PropTypes.string.isRequired,
  }).isRequired,
  id: PropTypes.number.isRequired, // índice
  category: PropTypes.string.isRequired,
};

export default ArticleViewEd;