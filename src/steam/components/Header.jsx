import * as React from 'react';
import PropTypes from 'prop-types';
import {Toolbar, Button, Typography, Link, MenuItem, Select, Grid, Menu, Fade, Box, List, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, IconButton, CircularProgress} from '@mui/material';
import { NavLink } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthStore } from '../../hooks';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { Person } from '@mui/icons-material';

const lngs = [
  { code: "es", native: "Spanish" },
  { code: "na", native: "Náhuatl" },
];

function Header(props) {
  const { sections, title, category } = props;
  const [language, setLang] = React.useState('es');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [activeCategory, setActiveCategory] = useState(() =>{
    return localStorage.getItem('activeCategory') || 'defaultCategory';
  });
  const [isMobile, setIsMobile] = React.useState(false);
  const {status, startLogout, user} = useAuthStore();
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [role, setRole] = useState(null)
  const isUserRole = role === 'User';
  const isCreatorRole = role === 'Creator';
  const isAdminRole = role === 'Admin';

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () =>{
    setLoading(true);
    await startLogout();
    setLoading(false);
  }

  const getUserRol = async () => {
    const user = localStorage.getItem('user')
    if(user){
      const userObject = JSON.parse(user);
      const rolName = userObject.role_name

     return rolName || null
    }else{
      console.error("No se encontró el objeto user")
      return null;
    }
  } 

  useEffect(() => {
    const fetchUserRole = async () => {
      const rol = await getUserRol();
      setRole(rol)
    }

    fetchUserRole()
  }, []);

  React.useEffect(() => {
    if (!location.pathname.includes('/publications')) {
      localStorage.removeItem('activeCategory');
      setActiveCategory('defaultCategory');
    }
  }, [location.pathname]);

  // Función para detectar si una sección está resaltada
  const isSectionActive = (category) => {
    return activeCategory === category;
  };


  const handleSectionClick = (category) => {
    setActiveCategory(category);
    localStorage.setItem('activeCategory', category);
  };
  
  const handleTrans = (code) => {
    i18n.changeLanguage(code);
    setLang(code);

    // Guardar el idioma seleccionado en el localStorage
    localStorage.setItem('language', code);
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
      setLang(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
    const handleResize = () => setIsMobile(window.innerWidth <= 690);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [i18n]);

  const drawerList = () => (
    <Box role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {sections.map((section, index) => (
          <NavLink to={section.url} key={section.title} style={{ textDecoration: 'none'}}>
            <ListItemButton key={section.title} 
            onClick={() => handleSectionClick(section.category)}
            sx={{
              p: 1,
              fontSize: '1.25rem',
              color: isSectionActive(section.category) ? 'blue' : 'black',
              fontWeight: isSectionActive(section.category) ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
            }}
            >
              <ListItemIcon>
                <img src={section.icon} alt={section.title} style={{ width: '24px' }} />
              </ListItemIcon>
              <ListItemText primary={section.title} />
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider'}}>
  
      {
          status==='authenticated' && user.verified && role === 'User' &&(
          
           <>
          <Typography variant='h5' component="h6" sx={{ fontFamily: 'Didact Gothic, sans-serif', marginRight:'10px' }}>
              {user.username}
          </Typography>

            

          <NavLink to="/">
            <Button variant="outlined" size="small" onClick={handleLogout} sx={{ fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px" }}>
              {t("logout")}
            </Button>
          </NavLink>

          {loading && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 9999,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          </>
          ) }
          
           {
            status === 'authenticated' || user ? (
              <></>
            ) :(
            <NavLink to="/users/auth/login">
              <Button variant="contained" size="small" href='/users/auth/login'
                sx={{ fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", padding:"8px", marginRight: isMobile ? '20px' : "auto", }}>{t("login")}
              </Button>
            </NavLink>
            )
          }

          {
            status === 'not-authenticated' && (
              <NavLink to="/users/auth/login">
              <Button variant="contained" size="small" href='/users/auth/login'
                sx={{ fontFamily: 'Didact Gothic, sans-serif', borderRadius:"20px", padding:"8px", marginRight: isMobile ? '20px' : "auto", }}>{t("login")}
              </Button>
            </NavLink>
            ) 
          } 

        

        {/*Menú del creator */}
        { status=== 'authenticated' && isCreatorRole &&(
          <>
            <Button
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            startIcon ={<Person/>}
            sx={{marginRight:'10px', fontFamily: 'Didact Gothic, sans-serif'}}
            >
              {user.username}
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
        )}


        {status=== 'authenticated' && isAdminRole &&(
          <>
            <Button
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            startIcon ={<Person/>}
            sx={{marginRight:'10px', fontFamily: 'Didact Gothic, sans-serif',  borderRadius:"30px"}}
            >
              {user.username}
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
        )}


        <Typography
          component="h2"
          variant="h3"
          color="inherit"
          align="center"
          noWrap
          display={ isMobile ? "none" : "flow"}
          sx={{ flex: 1, fontFamily: 'Comfortaa, sans-serif'}}
        >
          {title}
        </Typography>


        {/*Menú de idioma */}
        <Box
          sx={{
            top: 0,
            right: 0,
            padding: '10px',
            zIndex: 1000, 
            '@media (max-width: 380px)': {
              padding: '7px', // Ajuste opcional para pantallas más pequeñas
            },
          }}
        >
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
        </Box>

        </Toolbar>


        {isMobile ? (
          <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Typography
            component="h2"
            variant="h3"
            color="inherit"
            align="left"
            noWrap
            sx={{ flex: 1, fontFamily: 'Comfortaa, sans-serif' }}
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
                  variant="body2"
                  onClick={() => handleSectionClick(section.category)}
                  sx={{
                    p: 1,
                    fontFamily: 'Didact Gothic, sans-serif',
                    fontSize: '1.25rem',
                    color: isSectionActive(section.category) ? 'blue' : 'black',
                    fontWeight: isSectionActive(section.category) ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
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
      category: PropTypes.string
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
