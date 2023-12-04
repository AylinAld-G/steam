import * as React from 'react';
import PropTypes from 'prop-types';
import {Toolbar, Button, Typography, Link, MenuItem, Select, Grid, Menu, Fade} from '@mui/material';
import { NavLink } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';
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
  const { sections, title } = props;
  const [language, setLang] = React.useState('es');

  //Menú del admin
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const location = useLocation();

  // Función para detectar si una sección está resaltada
  const isSectionActive = (sectionUrl) => {
    return location.pathname === sectionUrl;
  };


  const {status, startLogout, user, getRoles} = useAuthStore();

  const roles = getRoles();
  const isAdmin = roles.includes('Admin');
  const isCreator = roles.includes('Creator')

  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language');

    if (storedLanguage) {
      // Si hay un idioma guardado, se establece como idioma predeterminado
      setLang(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []); // Se ejecutará solo una vez al cargar el componente Header

  const { t, i18n } = useTranslation();


  const handleTrans = (code) => {
    i18n.changeLanguage(code);
    setLang(code);

    // Guardar el idioma seleccionado en el localStorage
    localStorage.setItem('language', code);
  };

  const [isMobile, setIsMobile] = React.useState(false);

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

  

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>

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
        {isCreator ?(
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
          </>
        ): null}


        {isAdmin ?(
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
          </>
        ): null}


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


      <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={language}
          onChange={(event) => handleTrans(event.target.value)}
          autoWidth
          IconComponent={LanguageIcon}
          sx={{border:"none", fontFamily: 'Didact Gothic, sans-serif',
          display: 'inline-flex',
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
            variant="h3"
            color="inherit"
            align="center"
            noWrap
            sx={{ flex: 1, fontFamily: 'Comfortaa, sans-serif' }}
          >
            {title}
          </Typography>
        </Toolbar>
      ) : null}

      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto', overflowY: 'hidden'}}
      >
        {sections.map((section) => (
          <Grid container direction="column" alignItems="center" key={section.title}>
          <img src={section.icon} style={{ width: '25%', marginBottom: '4px', marginTop:'6px' }} />
          <NavLink to={section.url} style={{textDecoration:"none"}}>
            <Link
              noWrap
              key={section.title}
              variant="body2"
              sx={{ 
                p: 1, 
                flexShrink: 0, 
                fontFamily: 'Didact Gothic, sans-serif', 
                fontSize: "1.25rem",
                textDecoration: 'none', 
                color: isSectionActive(section.url) ? 'primary.main' : 'black', // Cambia el color de la sección seleccionada
                cursor: 'pointer',
              }}
            >
              {section.title}
            </Link>
          </NavLink>
          </Grid>
        ))}
      </Toolbar>
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
