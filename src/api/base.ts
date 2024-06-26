import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';
import { setToken } from '@/utils/lsHandle';

// 登入
type LoginParams = { account: string; password: string };
export const apiLogin = async (params: LoginParams) => {
    const res = await req(`${base}/login`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('登入成功');
        setToken(res.data?.token, Date.now() + 60 * 60 * 24 * 1000 * 7);
        return true;
    } else return false;
};

export const apiDownloadDb = async () => {
    const res = await req(`${base}/dbDownload`);
    if (res) {
        SnackbarUtils.success('下載成功');
        return res;
    } else return false;
};

// TODO
export const apiWebPush = async () => {
    const res = await req(`${base}/line/reply`, {
        method: 'POST',
        body: JSON.stringify({
            events: [
                {
                    type: 'message',
                    message: {
                        type: 'text',
                        text: '24323',
                    },
                },
            ],
        }),
    });
    console.log(111, res);
};
