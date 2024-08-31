import * as React from 'react';
import PropTypes from 'prop-types';
import {Toolbar, Button, Typography, Link, MenuItem, Select, Grid, Menu, Fade, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, IconButton} from '@mui/material';
import { NavLink } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthStore } from '../../hooks';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

const lngs = [
  { code: "es", native: "Spanish" },
  { code: "na", native: "Náhuatl" },
];

function Header(props) {
  const { sections, title, category } = props;
  const [language, setLang] = React.useState('es');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('defaultCategory');
  const [isMobile, setIsMobile] = React.useState(false);
  const {status, startLogout, user} = useAuthStore();
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Función para detectar si una sección está resaltada
  const isSectionActive = (sectionCategory) => {
    return activeCategory === sectionCategory;
  };


  const handleSectionClick = (sectionCategory) => {
    setActiveCategory(sectionCategory);
    localStorage.setItem('activeCategory', sectionCategory);
  };

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language');

    if (storedLanguage) {
      // Si hay un idioma guardado, se establece como idioma predeterminado
      setLang(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []); // Se ejecutará solo una vez al cargar el componente Header


  const handleTrans = (code) => {
    i18n.changeLanguage(code);
    setLang(code);

    // Guardar el idioma seleccionado en el localStorage
    localStorage.setItem('language', code);
  };

  React.useEffect(() => {
    // Detecta si la pantalla es de 690px o menos
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 690);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const drawerList = () => (
    <Box role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {sections.map((section, index) => (
          <NavLink to={section.url} key={section.title} style={{ textDecoration: 'none', color:'black' }}>
          <ListItem button key={section.title} onClick={() => handleSectionClick(section.category)}>
            <ListItemIcon>
              <img src={section.icon} alt={section.title} style={{ width: '24px' }} />
            </ListItemIcon>
            <ListItemText primary={section.title} style={{fontFamily: 'Didact Gothic, sans-serif'}}/>
          </ListItem>
          </NavLink>
        ))}
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider'}}>
  
      {
          (status==='authenticated')
          
          ? <>
          <Typography variant='h5' component="h6" sx={{ fontFamily: 'Didact Gothic, sans-serif', marginRight:'10px' }}>
              {user.username}
          </Typography>

            
          <NavLink to="/">
            <Button variant="outlined" size="small" onClick={startLogout} sx={{ fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px" }}>
              {t("logout")}
            </Button>
          </NavLink>

          </>
          :
            <NavLink to="/auth/login">
              <Button variant="outlined" size="small" href='/auth/login'
                sx={{ fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", padding:"8px", marginRight: isMobile ? '20px' : "auto", }}>{t("login")}
              </Button>
            </NavLink>

        }

        {/*Menú del creator */}
        { status=== 'authenticated' && user.rol_name==='Creator' ?(
          <>
            <Button
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{marginRight:'10px'}}
            >
              {user.name}
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              <MenuItem component={NavLink} to="/dashboard" onClick={handleClose}>Tablero</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>

            <NavLink to="/">
            <Button variant="outlined" size="small" onClick={startLogout} sx={{ fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px" }}>
              {t("logout")}
            </Button>
          </NavLink>
          </>
        ): null}


        {status=== 'authenticated' && user.rol_name==='Admin' ?(
          <>
            <Button
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{marginRight:'10px'}}
            >
              {user.name}
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              <MenuItem component={NavLink} to="/admin/dashboard" onClick={handleClose}>Tablero</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>

            <NavLink to="/">
            <Button variant="outlined" size="small" onClick={startLogout} sx={{ fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px" }}>
              {t("logout")}
            </Button>
          </NavLink> 
          </>
        ): null}


        <Typography
          component="h2"
          variant="h3"
          color="inherit"
          align="center"
          noWrap
          display={ isMobile ? "none" : "flow"}
          sx={{ flex: 1, fontFamily: 'Comfortaa, sans-serif', marginTop: '2px'}}
        >
          {title}
        </Typography>


        {/*Menú de idioma */}
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={language}
          onChange={(event) => handleTrans(event.target.value)}
          autoWidth
          IconComponent={LanguageIcon}
          sx={{border:"none", fontFamily: 'Didact Gothic, sans-serif',
          display: 'inline-flex',
          marginBottom: 1,
          marginTop: 1,
          padding: 0,
          '@media (max-width: 380px)': {
            fontSize: '1rem',
            padding: 0,
            '&.MuiSelect-select.MuiSelect-select': { 
              padding:0,
              fontSize: '1rem',
            }, 
            '&.MuiMenu-list': { fontSize: '1rem'}
          },
          '@media (max-width: 355px)': {
            fontSize: '15px',
            '&.MuiSelect-select.MuiSelect-select': { 
              fontSize: '15px',
              padding:0 },
            '&.MuiMenu-list': { fontSize: '15px'} 
          },
          }}
        >
          <MenuItem value="es">
            <em>{t("esp")}</em>
          </MenuItem>
          <MenuItem value="na">{t("nah")}</MenuItem>
        </Select>

        </Toolbar>


        {isMobile ? (
          <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Typography
            component="h2"
            variant="h4"
            color="inherit"
            align="left"
            noWrap
            sx={{ flex: 1, fontFamily: 'Comfortaa, sans-serif', marginTop: '5px' }}
          >
            {title}
          </Typography>

          <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

          </Toolbar>

        ) : null}


      {/* Categorías (vista Desktop) */}
      {!isMobile && (
        <Toolbar component="nav" variant="dense" sx={{ justifyContent: 'space-between', overflowX: 'auto' }}>
          {sections.map((section) => (
            <NavLink to={section.url} key={section.title} style={{ textDecoration: 'none' }}>
              <Grid container direction="column" alignItems="center">
                <img src={section.icon} style={{ width: '25%', marginBottom: '4px', marginTop: '6px' }} />
                <Link
                  noWrap
                  key={section.title}
                  variant="body2"
                  onClick={() => handleSectionClick(section.category)}
                  sx={{ 
                    p: 1, 
                    flexShrink: 0, 
                    fontFamily: 'Didact Gothic, sans-serif', 
                    fontSize: "1.25rem",
                    textDecoration: 'none', 
                    color: isSectionActive(section.category) ? 'primary.main' : 'black', // Cambia el color de la sección seleccionada
                    cursor: 'pointer',
                  }}
                >
                  {section.title}
                </Link>
              </Grid>
            </NavLink>
          ))}
        </Toolbar>
      )}

      {/* Drawer */}
      <SwipeableDrawer anchor="top" open={drawerOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
        {drawerList()}
      </SwipeableDrawer>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
