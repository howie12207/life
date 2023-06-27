import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';

import { store } from '@/app/store';
import { updateUsername } from '@/app/base';

type LoginParams = { account: string; password: string };
export const apiLogin = async (params: LoginParams) => {
    const res = await req(`${base}/user/login`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('登入成功');
        store.dispatch(updateUsername(res.data?.username));
        return true;
    } else return false;
};
