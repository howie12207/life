import { apiWebPush } from '@/api/base';

const Home = () => {
    return (
        <section className="bg-blue-200">
            <div onClick={() => apiWebPush()}>home</div>
        </section>
    );
};

export default Home;
