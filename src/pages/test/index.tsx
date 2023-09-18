import { useEffect, useState, useRef } from 'react';
import { Web3 } from 'web3';

// TODO
const Test = () => {
    const [web3, setWeb3] = useState(undefined) as any;

    const renderRef = useRef(false);
    useEffect(() => {
        if (renderRef.current) return;
        renderRef.current = true;
        const INFURA_API_KEY = '9379e0a3442247b0956383706f180132';
        const provider = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
        const web3Provider = new Web3.providers.HttpProvider(provider);
        const web3 = new Web3(web3Provider);
        setWeb3(web3);
    }, []);

    const getBalanceEth = async () => {
        const address = '0xfa187ac3b1cc77b874638c493a130132927d84c6';
        const res = await web3.eth.getBalance(address);
        if (res) {
            const number = web3.utils.fromWei(res, 'ether');
            console.log(number);
        }
    };

    return (
        <section className="p-6 pb-20">
            <button onClick={getBalanceEth}>test</button>
        </section>
    );
};

export default Test;
