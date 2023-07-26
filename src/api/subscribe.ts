import req from '@/config/request';
import { base } from '@/config/apiPath';

export const apiAddSubscription = async (params: object) => {
    const res = await req(`${base}/subscribe/subscription`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        return true;
    } else return false;
};
