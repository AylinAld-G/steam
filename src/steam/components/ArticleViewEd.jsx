import * as React from 'react';
import PropTypes from 'prop-types';
import {Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Fab} from '@mui/material';
import { Edit, Delete, Add} from '@mui/icons-material'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EditArticle } from '../pages/EditArticle';
import { useSteamStore } from '../../hooks';
import { onSetActiveArticle } from '../../store/steam/steamSlice';
import { useDispatch } from 'react-redux';
import { DeleteDialog } from '../views/DeleteDialog';


function ArticleViewEd(props) {
  const { post, id } = props;

  const {t} = useTranslation();
  const {activeArticle} = useSteamStore();
  const dispatch = useDispatch();

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

  const handleDelete = (event, article) => {
    event.stopPropagation();
    event.preventDefault(); 
    dispatch(onSetActiveArticle(article))
    console.log(article);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false); 
  };


  const [isMobile, setIsMobile] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

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
                    image={post[5]}
                    />)
                }

                <Typography component="h2" variant="h5" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                {post[4]}
                </Typography>
                <Typography variant="subtitle1" paragraph sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                {post[6]}
                </Typography>
                <Typography variant="subtitle1" color="primary" sx={{fontFamily: 'Didact Gothic, sans-serif' }}>
                {t("keepReading")}
                </Typography>
            </CardContent>

            {!isMobile && (
                <CardMedia
                component="img"
                sx={{ width: { xs: '100%', sm: '50%' }, display: { xs: 'none', sm: 'block' } }}
                image={post[5]}

                />
            )}
            {/* Botones flotantes */}
            {isHovered && (
            <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                <Fab color="rgba(255, 255, 255, 0.7)" size="small" aria-label="edit" 
                style={{ marginRight: '10px' }}
                onClick={(event) => handleEdit(event)}
                href={`/publications/update/${id}`}
                >
                <Edit />
                </Fab>


                <Fab onClick={(event) => handleDelete(event, post)} color="rgba(255, 255, 255, 0.7)" size="small" aria-label="delete">
                  <Delete />
                </Fab>

            </div>
            )}

            </Card>
        </CardActionArea>
        </div>
        )
    }
    </Grid>

    {isDeleteDialogOpen && <DeleteDialog onClose={closeDeleteDialog} />}
    </>
  );
}

ArticleViewEd.propTypes = {
    id: PropTypes.number.isRequired,
post: PropTypes.array.isRequired
  
};

export default ArticleViewEd;
