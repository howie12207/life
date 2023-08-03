import { useState, useCallback, useEffect, SyntheticEvent, useRef } from 'react';
import { apiGetStockList, StockListRes } from '@/api/stock2';

import { Tabs, Tab } from '@mui/material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Summary from './summary';
import Detail from './detail';
import Dividend from './dividend';

const Stock = () => {
    const nodeRef = useRef(null);

    // tabs
    const [activatedTab, setActivatedTab] = useState('0');
    const changeTab = (_: SyntheticEvent, value: string) => {
        setActivatedTab(value);
    };

    // list
    const [stockList, setStockList] = useState([] as StockListRes['list']);
    const [isLoadingStockList, setIsLoadingStockList] = useState(true);
    const getStockList = useCallback(async () => {
        setIsLoadingStockList(true);
        const res = await apiGetStockList();
        if (res) {
            setStockList(res.list);
        }
        setIsLoadingStockList(false);
    }, []);
    useEffect(() => {
        getStockList();
    }, [getStockList]);

    return (
        <section className="p-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">股票清單</h1>
            </div>

            <Tabs value={activatedTab} onChange={changeTab} className="mb-2">
                <Tab label="統整" value={'0'} />
                <Tab label="明細" value={'1'} />
                <Tab label="配息" value={'2'} />
            </Tabs>

            <SwitchTransition>
                <CSSTransition
                    key={activatedTab}
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames="page"
                    unmountOnExit
                >
                    <div ref={nodeRef}>
                        {activatedTab === '0' && (
                            <Summary
                                stockList={stockList}
                                isLoadingStockList={isLoadingStockList}
                            />
                        )}
                        {activatedTab === '1' && (
                            <Detail stockList={stockList} getStockList={getStockList} />
                        )}
                        {activatedTab === '2' && <Dividend />}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </section>
    );
};

export default Stock;
