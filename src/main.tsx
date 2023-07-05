import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { store } from '@/app/store';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { SnackbarProvider } from 'notistack';
import { SnackbarUtilsConfigurator, SnackbarCloseButton } from './utils/snackBar';

import App from './App.tsx';
import '@/assets/css/index.css';
import '@/assets/css/global.scss';

const theme = createTheme({
    palette: {
        info: {
            main: '#6b7280',
        },
    },
});

const snackProps = {
    maxSnack: 3,
    autoHideDuration: 2500,
    style: {
        width: '20rem',
        maxWidth: '100%',
        paddingRight: '2rem',
        flexWrap: 'nowrap',
        margin: 'auto',
    } as { [key: string]: string },
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider
                    {...snackProps}
                    variant="error"
                    anchorOrigin={{
                        horizontal: 'center',
                        vertical: 'top',
                    }}
                    action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}
                >
                    <App />
                    <SnackbarUtilsConfigurator />
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
