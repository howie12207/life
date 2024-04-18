import { store } from '@/app/store';
import { clearToken, updateToken } from '@/app/base';

export const getToken = () => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            store.dispatch(clearToken());
            return null;
        }
        const { token, expires } = JSON.parse(accessToken);
        if (Date.now() > expires) {
            store.dispatch(clearToken());
            return null;
        }
        store.dispatch(updateToken(token));
        return token;
    } catch (_) {
        store.dispatch(clearToken());
        return null;
    }
};

export const setToken = (token: string, expires: number) => {
    store.dispatch(updateToken(token));
    localStorage.setItem('accessToken', JSON.stringify({ token, expires }));
};
