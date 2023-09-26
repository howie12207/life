import { useState, useCallback } from 'react';
import Decimal from 'decimal.js-light';

import { BaseInput } from '@/components/baseInput/BaseInput';
import { RadioGroup, Radio, FormControlLabel, Button } from '@mui/material';

type InitData = 'costPrice' | 'leverage' | 'calcType' | 'ratioPrice';

// TODO
const Calculator = () => {
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
                                // label="成本價位"
                                id="life-cost-price"
                                value={item.costPrice}
                                setValue={value => handleEdit(index, 'costPrice', value)}
                                isValid={true}
                                setIsValid={() => ({})}
                                placeholder="請輸入成本價位"
                                className="w-[15rem] flex-none"
                            />
                            <BaseInput
                                // label="槓桿倍率"
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
                                // placeholder="請輸入比例金額"
                                className="w-[15rem] flex-none"
                            />
                            <div>
                                結果： <br />
                                {calcValue(index)}
                            </div>
                        </section>
                    );
                })}
            </div>
        </section>
    );
};

export default Calculator;
