import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

export const blueTheme=createTheme({
    palette:{
        primary:{
            main: '#2979ff'
        },
        secondary:{
            main: '#9c27b0'
        },
        error:{
            main: red.A400
        }
    }
})
