import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';
import Cookies from 'js-cookie';

import { store } from '@/app/store';
import { updateToken } from '@/app/base';

// 登入
type LoginParams = { account: string; password: string };
export const apiLogin = async (params: LoginParams) => {
    const res = await req(`${base}/user/login`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('登入成功');
        store.dispatch(updateToken(res.data?.token));
        Cookies.set('token', res.data?.token, {
            expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
        });
        return true;
    } else return false;
};

export const apiDownloadDb = async () => {
    const res = await req(`${base}/dbDownload`);
    if (res?.code === 200) {
        SnackbarUtils.success('下載成功');
        return res.data;
    } else return false;
};
