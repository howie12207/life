import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'url';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return {
        plugins: [react()],
        base: `${process.env.VITE_BASE_URL}/`,
        define: {
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            port: 7777,
            proxy: {
                '/proxyBase': {
                    target: 'http://localhost:7071',
                    changeOrigin: true,
                    secure: false,
                    rewrite: path => path.replace(/^\/proxyBase/, ''),
                },
                '/proxyMax': {
                    target: 'https://max-api.maicoin.com/api/v2/tickers',
                    changeOrigin: true,
                    secure: false,
                    rewrite: path => path.replace(/^\/proxyMax/, ''),
                },
                '/proxyAce': {
                    target: 'https://ace.io/polarisex',
                    changeOrigin: true,
                    secure: false,
                    rewrite: path => path.replace(/^\/proxyAce/, ''),
                },
                '/proxyBito': {
                    target: 'https://api.bitopro.com/v3',
                    changeOrigin: true,
                    secure: false,
                    rewrite: path => path.replace(/^\/proxyBito/, ''),
                },
            },
        },
        optimizeDeps: {
            esbuildOptions: {
                // Node.js global to browser globalThis
                define: {
                    global: 'globalThis',
                },
                // Enable esbuild polyfill plugins
                plugins: [
                    NodeGlobalsPolyfillPlugin({
                        process: true,
                    }),
                    NodeModulesPolyfillPlugin(),
                ],
            },
        },
    };
});
