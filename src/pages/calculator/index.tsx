import { useState, useMemo } from 'react';
import Decimal from 'decimal.js-light';

import { BaseInput } from '@/components/baseInput/BaseInput';
import { RadioGroup, Radio, FormControlLabel, Button } from '@mui/material';

// TODO
const Calculator = () => {
    // 成本價位
    const [costPrice, setCostPrice] = useState('');

    // 槓桿倍率
    const [leverage, setLeverage] = useState('1');

    // 計算類型
    const [calcType, setCalcType] = useState('ratio');

    // 比例金額
    const [ratioPrice, setRatioPrice] = useState('');

    // 計算結果
    const calcValue = useMemo(() => {
        const calCostPrice = Number(costPrice) || 0;
        const calLeverage = Number(leverage) || 0;
        const calRatioPrice = Number(ratioPrice) || 0;
        if (!calCostPrice || !calLeverage || !calRatioPrice) return 0;

        const startVal = new Decimal(calCostPrice);
        if (calcType === 'ratio') {
            return `
            ${startVal.minus(startVal.mul(calRatioPrice).div(100).div(calLeverage)).toNumber()} ,
            ${startVal.add(startVal.mul(calRatioPrice).div(100).div(calLeverage)).toNumber()}`;
        }
        if (calcType === 'price') {
            const profit = startVal.minus(calRatioPrice).negated().mul(calLeverage);
            return `${new Decimal(profit).div(calCostPrice).mul(100).toNumber()} %`;
        }
        return 0;
    }, [costPrice, leverage, calcType, ratioPrice]);

    return (
        <section className="p-6 pb-20">
            <div>
                <Button variant="contained">新增</Button>
                <div className="mb-4 text-right">
                    <Button variant="contained" color="error">
                        刪除
                    </Button>
                </div>
                <BaseInput
                    // label="成本價位"
                    id="life-cost-price"
                    value={costPrice}
                    setValue={setCostPrice}
                    isValid={true}
                    setIsValid={() => ({})}
                    placeholder="請輸入成本價位"
                    className="w-[15rem] flex-none"
                />
                <BaseInput
                    // label="槓桿倍率"
                    id="life-leverage"
                    value={leverage}
                    setValue={setLeverage}
                    isValid={true}
                    setIsValid={() => ({})}
                    placeholder="請輸入槓桿倍率"
                    className="w-[15rem] flex-none"
                />
                <RadioGroup
                    className="!flex-row"
                    value={calcType}
                    onChange={e => setCalcType(e.target.value)}
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
                    value={ratioPrice}
                    setValue={setRatioPrice}
                    isValid={true}
                    setIsValid={() => ({})}
                    // placeholder="請輸入比例金額"
                    className="w-[15rem] flex-none"
                />
                <div>
                    結果： <br />
                    {calcValue}
                </div>
            </div>
        </section>
    );
};

export default Calculator;
