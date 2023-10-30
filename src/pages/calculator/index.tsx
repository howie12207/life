import { useState, useCallback, useEffect, useRef } from 'react';
import Decimal from 'decimal.js-light';
import { apiGetCryptoPrice } from '@/api/crypto';
import { formatDateTime } from '@/utils/format';

import { BaseInput } from '@/components/baseInput/BaseInput';
import { RadioGroup, Radio, FormControlLabel, Button, Skeleton } from '@mui/material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

type InitData = 'costPrice' | 'leverage' | 'calcType' | 'ratioPrice';

const INTERVAL = 30000;
const Calculator = () => {
    const nodeRef = useRef(null);

    const initData = {
        costPrice: '',
        leverage: '1',
        calcType: 'ratio',
        ratioPrice: '',
    };
    const [itemList, setItemList] = useState([initData]);
    const handleEdit = (index: number, target: InitData, value: string) => {
        const newItem = { ...itemList[index], [target]: value };

        setItemList([...itemList.slice(0, index), newItem, ...itemList.slice(index + 1)]);
    };
    // 計算結果
    const calcValue = useCallback(
        (index: number) => {
            const target = itemList[index];
            const calCostPrice = Number(target.costPrice) || 0;
            const calLeverage = Number(target.leverage) || 0;
            const calRatioPrice = Number(target.ratioPrice) || 0;
            if (!calCostPrice || !calLeverage || !calRatioPrice) return 0;
            const startVal = new Decimal(calCostPrice);
            if (target.calcType === 'ratio') {
                return `
                ${startVal
                    .minus(startVal.mul(calRatioPrice).div(100).div(calLeverage))
                    .toNumber()} ,
                ${startVal.add(startVal.mul(calRatioPrice).div(100).div(calLeverage)).toNumber()}`;
            }
            if (target.calcType === 'price') {
                const profit = startVal.minus(calRatioPrice).negated().mul(calLeverage);
                return `${new Decimal(profit).div(calCostPrice).mul(100).toNumber()} %`;
            }
            return 0;
        },
        [itemList]
    );

    // 新增
    const addItem = () => {
        setItemList([...itemList, initData]);
    };

    // 複製
    const copyItem = (index: number) => {
        setItemList([...itemList, itemList[index]]);
    };

    // 刪除
    const deleteItem = (index: number) => {
        setItemList([...itemList.slice(0, index), ...itemList.slice(index + 1)]);
    };

    // 取得加密貨幣
    const [updateTime, setUpdateTime] = useState(formatDateTime(new Date()));
    const [isLoadingCrypto, setIsLoadingCrypto] = useState(true);
    const [inputCrypto, setInputCrypto] = useState(
        window.localStorage.getItem('cryptoList') || 'BTC'
    );
    const [cryptoPriceList, setCryptoPriceList] = useState({});
    const getCryptoPrice = useCallback(async () => {
        setIsLoadingCrypto(true);
        const res = await apiGetCryptoPrice({ fsyms: inputCrypto });
        setUpdateTime(formatDateTime(new Date()));
        if (res) setCryptoPriceList(res);
        setIsLoadingCrypto(false);
    }, [inputCrypto]);
    useEffect(() => {
        getCryptoPrice();
        let timer: ReturnType<typeof setTimeout> = setInterval(() => {
            getCryptoPrice();
        }, INTERVAL);

        const handleVisible = () => {
            if (document.visibilityState === 'visible') {
                getCryptoPrice();
                timer = setInterval(() => {
                    getCryptoPrice();
                }, INTERVAL);
            } else clearInterval(timer);
        };
        document.addEventListener('visibilitychange', handleVisible);

        return () => {
            document.removeEventListener('visibilitychange', handleVisible);
            clearInterval(timer);
        };
    }, []);

    const cryptoInputBlur = () => {
        window.localStorage.setItem('cryptoList', inputCrypto);
        getCryptoPrice();
    };

    return (
        <section className="p-6 pb-20">
            <div>
                <Button variant="contained" onClick={addItem}>
                    新增
                </Button>

                {itemList.map((item, index) => {
                    return (
                        <section key={index}>
                            <div className="my-4 flex flex-wrap gap-4">
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => copyItem(index)}
                                >
                                    複製
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => deleteItem(index)}
                                >
                                    刪除
                                </Button>
                            </div>
                            <BaseInput
                                id="life-cost-price"
                                value={item.costPrice}
                                setValue={value => handleEdit(index, 'costPrice', value)}
                                isValid={true}
                                setIsValid={() => ({})}
                                placeholder="請輸入成本價位"
                                className="w-[15rem] flex-none"
                            />
                            <BaseInput
                                id="life-leverage"
                                value={item.leverage}
                                setValue={value => handleEdit(index, 'leverage', value)}
                                isValid={true}
                                setIsValid={() => ({})}
                                placeholder="請輸入槓桿倍率"
                                className="w-[15rem] flex-none"
                            />
                            <RadioGroup
                                className="!flex-row"
                                value={item.calcType}
                                onChange={e => handleEdit(index, 'calcType', e.target.value)}
                            >
                                <FormControlLabel
                                    value={'ratio'}
                                    control={<Radio size="small" />}
                                    label="比例"
                                />
                                <FormControlLabel
                                    value={'price'}
                                    control={<Radio size="small" />}
                                    label="金額"
                                />
                            </RadioGroup>
                            <BaseInput
                                id="life-ratio-price"
                                value={item.ratioPrice}
                                setValue={value => handleEdit(index, 'ratioPrice', value)}
                                isValid={true}
                                setIsValid={() => ({})}
                                placeholder="請輸入比例金額"
                                className="w-[15rem] flex-none"
                            />
                            <div>
                                結果： <br />
                                {calcValue(index)}
                            </div>
                        </section>
                    );
                })}

                <div className="my-4">
                    <BaseInput
                        id="life-crypto-search"
                        value={inputCrypto}
                        setValue={setInputCrypto}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="請輸入欲查詢的幣"
                        className="w-[15rem] flex-none"
                        onBlur={cryptoInputBlur}
                    />
                    <div>{updateTime}</div>
                    <SwitchTransition>
                        <CSSTransition
                            key={isLoadingCrypto ? 'loading' : 'data'}
                            nodeRef={nodeRef}
                            timeout={300}
                            classNames="page"
                            unmountOnExit
                        >
                            <section ref={nodeRef}>
                                {isLoadingCrypto ? (
                                    <>
                                        <Skeleton width={160} />
                                        <Skeleton width={160} />
                                        <Skeleton width={160} />
                                        <Skeleton width={160} />
                                        <Skeleton width={160} />
                                        <Skeleton width={160} />
                                        <Skeleton width={160} />
                                    </>
                                ) : (
                                    Object.entries(cryptoPriceList).map(item => {
                                        return (
                                            <div key={item[0]} className="my-1">
                                                <span className="inline-block w-12">
                                                    {item[0]}:
                                                </span>
                                                <span>{Number(item[1]).toLocaleString()}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </section>
                        </CSSTransition>
                    </SwitchTransition>
                </div>
            </div>
        </section>
    );
};

export default Calculator;
