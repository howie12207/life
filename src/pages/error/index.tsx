import { NavLink } from 'react-router-dom';
import { ReportProblem } from '@mui/icons-material';

const Error = () => {
    return (
        <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-sky-600 bg-gradient-to-r from-sky-700 py-40">
            <div className="items-center gap-4 rounded bg-white/60 p-8 sm:flex">
                <ReportProblem className="mx-auto !block !text-9xl" />
                <div className="text-center text-4xl">
                    404
                    <br />
                    查無此頁面
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
