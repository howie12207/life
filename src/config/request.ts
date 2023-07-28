import { navigateTo } from '@/utils/navigateHelper';
import SnackbarUtils from '@/utils/snackBar';
import { store } from '@/app/store';
import { clearToken } from '@/app/base';

type RequestParams = {
    method?: string;
    headers?: { [key: string]: string };
    body?: BodyInit;
    mode?: RequestMode;
    cache?: RequestCache;
    retries?: number;
    retryDelay?: number;
    timeout?: number;
    cancelMsg?: boolean;
};

const controllers = {} as {
    [key: string]: {
        cancel: AbortController;
        timeout?: ReturnType<typeof setTimeout>;
        isRepeated?: boolean;
    };
};

const clear = (url: string, isCancelByRepeated?: boolean) => {
    clearTimeout(controllers[url]?.timeout);
    delete controllers[url];
    if (isCancelByRepeated) throw new Error('isCancelByRepeated');
};

const request = async (
    url: string,
    options = {} as RequestParams,
    retryCount = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
    const {
        method = 'GET',
        headers,
        body,
        mode = 'cors',
        cache = 'default',
        retries = 2,
        retryDelay = 1000,
        timeout = 12000,
        cancelMsg,
    } = options;

    // Headers setting
    const defaultHeaders = {
        ...headers,
    } as { [key: string]: string };
    if (headers?.['authorization'] !== '')
        defaultHeaders['authorization'] = `Bearer ${store.getState().base.token}`;
    else delete defaultHeaders['authorization'];
    if (headers?.['Content-Type'] === undefined)
        defaultHeaders['Content-Type'] = 'application/json';
    else if (headers?.['Content-Type'] === '') delete defaultHeaders['Content-Type'];

    // is Repeated
    if (controllers[url] && retryCount === 0) {
        controllers[url].isRepeated = true;
        controllers[url].cancel.abort();
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    // Cancel setting
    const controller = new AbortController();
    controllers[url] = { ...controllers[url], cancel: controller };
    const signal = controller.signal;

    // Cancel old repeated
    if (retryCount !== 0 && controllers[url]?.isRepeated) {
        controllers[url].isRepeated = false;
        return false;
    }

    // setTimeout for cancel
    let timeoutId: ReturnType<typeof setTimeout>;
    if (timeout) {
        timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);
        controllers[url] = { ...controllers[url], timeout: timeoutId };
    }

    try {
        const res = await fetch(url, {
            method,
            headers: defaultHeaders,
            body,
            mode,
            cache,
            signal,
        });

        clear(url);

        // 401 403
        if (res?.status === 401 || res?.status === 403) {
            if (!cancelMsg) SnackbarUtils.error('登入逾時，請重新登入');
            store.dispatch(clearToken());
            // setTimeout(() => {
            //     const homeUrl = import.meta.env.DEV
            //         ? `${import.meta.env.VITE_DOMAIN}/`
            //         : `${import.meta.env.VITE_DOMAIN}/${import.meta.env.VITE_BASE_URL}/`;
            //     window.location.href = homeUrl;
            // }, 300);
            return false;
        }

        // 500
        if (res?.status === 500) {
            const errMsg = '系統異常，請稍後再試';
            if (!cancelMsg) SnackbarUtils.error(errMsg);
            navigateTo('/error?errorCode=500');
            return false;
        }

        // Data type
        let data;
        if (defaultHeaders['Content-Type'] === 'text/html') data = await res.text();
        else if (defaultHeaders['responseType'] === 'arraybuffer') data = await res.arrayBuffer();
        else if (res.headers.get('content-type') === 'application/zip') data = await res.blob();
        else data = await res.json();

        // not 200
        if (res?.status !== 200) {
            const errMsg = data.message || '系統異常，請稍後再試';
            SnackbarUtils.error(errMsg);
            return false;
        }

        return data;
    } catch (error) {
        const isCancel = error instanceof DOMException && error.name === 'AbortError';
        const isNetworkError = error instanceof TypeError && error.message === 'Failed to fetch';

        // return old repeated
        if (controllers[url]?.isRepeated) return clear(url, true);

        // Retry
        if ((isCancel || isNetworkError) && retryCount < retries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return request(url, options, retryCount + 1);
        }

        // Error msg
        let msg = '未知錯誤，請稍後再試';
        if (isCancel || isNetworkError) msg = '網路異常，請確認網路連線狀態';
        else if (error instanceof SyntaxError) msg = '返回資料有誤，請稍後再試';
        if (!cancelMsg) SnackbarUtils.error(msg);

        clear(url);
        return false;
    }
};

export default request;
