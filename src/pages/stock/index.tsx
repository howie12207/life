import { useState, useCallback, useEffect, SyntheticEvent } from 'react';
import { apiGetStockList, StockListRes } from '@/api/stock';

import { Tabs, Tab } from '@mui/material';
import Summary from './Summary';
import Detail from './Detail';

const Stock = () => {
    // tabs
    const [activatedTab, setActivatedTab] = useState('0');
    const changeTab = (_: SyntheticEvent, value: string) => {
        setActivatedTab(value);
    };

    // list
    const [stockList, setStockList] = useState([] as StockListRes['list']);
    const getStockList = useCallback(async () => {
        const res = await apiGetStockList();
        if (res) {
            setStockList(res.list);
        }
    }, []);
    useEffect(() => {
        getStockList();
    }, [getStockList]);

    return (
        <section className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">股票清單</h1>
            </div>

            <Tabs value={activatedTab} onChange={changeTab}>
                <Tab label="統整" value={'0'} />
                <Tab label="明細" value={'1'} />
            </Tabs>

            {/* TODO css transition */}
            {activatedTab === '0' && <Summary stockList={stockList} />}
            {activatedTab === '1' && <Detail stockList={stockList} getStockList={getStockList} />}
        </section>
    );
};

export default Stock;
