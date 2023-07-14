import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ReportProblem } from '@mui/icons-material';

const Error = () => {
    const { search } = useLocation();

    const errorObj = useMemo(() => {
        const query = new URLSearchParams(search);

        const errorList: { [key: string]: string } = {
            '404': '查無此頁',
            '500': '系統錯誤，請再重新操作',
            unknown: '不明錯誤，請再重新操作',
        };
        const errorCode = query.get('errorCode') || 'unknown';
        return { code: errorCode, text: errorList[errorCode] };
    }, [search]);

    return (
        <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-sky-600 bg-gradient-to-r from-sky-700 py-40">
            <div className="items-center gap-4 rounded bg-white/60 p-8 sm:flex">
                <ReportProblem className="mx-auto !block !text-9xl" />
                <div className="text-center text-4xl">
                    {errorObj.code}
                    <br />
                    {errorObj.text}
                    <br />
                    <NavLink to="/" className="text-right text-xl text-blue-500 hover:underline">
                        返回首頁
                    </NavLink>
                </div>
            </div>
        </section>
    );
};

export default Error;
