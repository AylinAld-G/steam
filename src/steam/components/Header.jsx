import * as React from 'react';
import PropTypes from 'prop-types';
import {Toolbar, Button, IconButton, Typography, Link, MenuItem, Select} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { NavLink } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuthStore } from '../../hooks';

function Header(props) {
  const { sections, title } = props;
  const [language, setLang] = React.useState('');

  const handleChange = (event) => {
    setLang(event.target.value);
  };

  const {status, startLogout, user} = useAuthStore();


  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>

        {
          (status==='authenticated')
          
          ? <>
          <Typography variant='h5' component="h6">
              {user.username}
          </Typography>

            
          <NavLink to="/">
            <Button variant="outlined" size="small" onClick={startLogout}>Cerrar sesión</Button>
          </NavLink>

          </>
          :
            <NavLink to="auth/login">
              <Button variant="outlined" size="small">Iniciar sesión</Button>
            </NavLink>

        }

        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>

        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={language}
          onChange={handleChange}
          autoWidth
          IconComponent={LanguageIcon}
          sx={{border:"none"}}
        >
          <MenuItem value="">
            <em>Español</em>
          </MenuItem>
          <MenuItem value={10}>Náhuatl</MenuItem>
        </Select>

      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;