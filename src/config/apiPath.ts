const local = import.meta.env.VITE_DOMAIN;

export const base: string = import.meta.env.DEV
    ? `${local}/proxyBase`
    : import.meta.env.VITE_API_BASE;

export const apiMax = `${local}/proxyMax`;
export const apiAce = `${local}/proxyAce`;
export const apiBito = `${local}/proxyBito`;
