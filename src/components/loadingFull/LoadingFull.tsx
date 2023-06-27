import { useAppSelector } from '@/app/hook';

import { CircularProgress, Fade, Modal } from '@mui/material';

const LoadingFull = () => {
    const loading = useAppSelector(state => state.base.loading);

    return (
        <Modal open={loading} closeAfterTransition>
            <Fade in={loading}>
                <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/60">
                    <CircularProgress sx={{ color: '#005598' }} size={60} />
                </div>
            </Fade>
        </Modal>
    );
};

export default LoadingFull;
