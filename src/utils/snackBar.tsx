import { useSnackbar, VariantType, ProviderContext } from 'notistack';
import React from 'react';

import CloseIcon from '@mui/icons-material/Close';

let useSnackbarRef: ProviderContext;
export const SnackbarUtilsConfigurator: React.FC = () => {
    useSnackbarRef = useSnackbar();
    return null;
};

export default {
    success(msg: string) {
        this.toast(msg, 'success');
    },
    warning(msg: string) {
        this.toast(msg, 'warning');
    },
    info(msg: string) {
        this.toast(msg, 'info');
    },
    error(msg: string) {
        this.toast(msg, 'error');
    },
    toast(msg: string, variant: VariantType = 'default') {
        useSnackbarRef.enqueueSnackbar(msg, { variant });
    },
};

export const SnackbarCloseButton = ({ snackbarKey }: { snackbarKey: number | string }) => {
    const { closeSnackbar } = useSnackbar();
    return (
        <div
            className="cursor-pointer transition hover:opacity-60"
            onClick={() => closeSnackbar(snackbarKey)}
        >
            <CloseIcon />
        </div>
    );
};
