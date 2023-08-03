import { useState, useRef, Ref, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { updateLoading } from '@/app/base';
import { updateStockTable } from '@/app/stock';
import { useSnackbar } from 'notistack';
import { toStartTime } from '@/utils/format';
import {
    apiGetStockTable,
    apiAddStockItem,
    apiEditStockItem,
    apiDeleteStockItem,
    StockItemParams,
} from '@/api/stock';
import { isRequired, onlyNumber } from '@/utils/validate';
import { BUY_TOTAL_CHARGE, SELL_TOTAL_CHARGE } from '@/config/constant';

import { Modal, Fade, Button, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';
import { BaseInput, BaseInputType } from '@/components/baseInput/BaseInput';
import { BaseTextarea } from '@/components/baseTextarea/BaseTextarea';

type Props = {
    popup: string;
    setPopup: (value: string) => void;
    getStockList: () => unknown;
    editData?: StockItemParams;
    setEditData: (data: StockItemParams) => void;
};

const PopupEdit = ({ popup, setPopup, getStockList, editData, setEditData }: Props) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const itemCodeRef: Ref<BaseInputType> = useRef(null);
    const [itemCode, setItemCode] = useState('');
    const [itemCodeIsValid, setItemCodeIsValid] = useState(false);
    const itemCodeRules = [{ validate: isRequired, message: '請輸入股票代碼' }];

    const itemNameRef: Ref<BaseInputType> = useRef(null);
    const [itemName, setItemName] = useState('');
    const [itemNameIsValid, setItemNameIsValid] = useState(false);
    const itemNameRules = [{ validate: isRequired, message: '請輸入股票名稱' }];

    const [itemType, setItemType] = useState('buy');

    const tradeDateRef: Ref<BaseInputType> = useRef(null);
    const [tradeDate, setTradeDate] = useState<Date | null>(new Date());
    const [tradeDateIsValid, setTradeDateIsValid] = useState(false);
    const tradeDateRules = [{ validate: isRequired, message: '請選擇日期' }];

    const priceRef: Ref<BaseInputType> = useRef(null);
    const [price, setPrice] = useState('');
    const [priceIsValid, setPriceIsValid] = useState(false);
    const priceRules = [{ validate: isRequired, message: '請輸入正確價位' }];

    const amountRef: Ref<BaseInputType> = useRef(null);
    const [amount, setAmount] = useState('');
    const [amountIsValid, setAmountIsValid] = useState(false);
    const amountRules = [{ validate: onlyNumber, message: '請輸入正確股數' }];
    const amountBlur = () => {
        if (itemType === 'buy')
            setDollar(Math.floor(Number(price) * Number(amount) * BUY_TOTAL_CHARGE).toString());
        else setDollar(Math.floor(Number(price) * Number(amount) * SELL_TOTAL_CHARGE).toString());
    };

    const dollarRef: Ref<BaseInputType> = useRef(null);
    const [dollar, setDollar] = useState('');
    const [dollarIsValid, setDollarIsValid] = useState(false);
    const dollarRules = [{ validate: onlyNumber, message: '請輸入正確金額' }];

    const noteRef: Ref<BaseInputType> = useRef(null);
    const [note, setNote] = useState('');

    const stockTable = useAppSelector(state => state.stock.stockTable);
    const getStockTable = useCallback(async () => {
        const res = await apiGetStockTable();
        if (res) {
            dispatch(updateStockTable(res));
        }
    }, [dispatch]);
    useEffect(() => {
        if (Object.keys(stockTable).length === 0 && (popup === 'add' || popup === 'edit'))
            getStockTable();
    }, [popup, getStockTable, stockTable]);

    useEffect(() => {
        setItemCode(editData?.itemCode || '');
        setItemName(editData?.itemName || '');
        setItemType(editData?.itemType || 'buy');
        setTradeDate(new Date(editData?.tradeDate || new Date()));
        setPrice(editData?.price || '');
        setAmount(String(editData?.amount || ''));
        setDollar(String(editData?.dollar || ''));
        setNote(editData?.note || '');
    }, [editData]);

    const codeNameBlur = (target: string, value: string) => {
        if (target === 'itemCode') {
            setItemName(stockTable?.[value]?.name || '');
        } else {
            setItemCode(
                Object.keys(stockTable).find(item => stockTable[item].name === value) || ''
            );
        }
    };

    // submit
    const submit = async () => {
        const isValid = [
            tradeDateRef.current?.validateNow(),
            itemCodeRef.current?.validateNow(),
            itemNameRef.current?.validateNow(),
            priceRef.current?.validateNow(),
            amountRef.current?.validateNow(),
            dollarRef.current?.validateNow(),
        ];
        if (!isValid.every(item => item)) return enqueueSnackbar('請確認紅框處內容');
        dispatch(updateLoading(true));
        const params: StockItemParams = {
            itemCode,
            itemName,
            itemType,
            tradeDate: toStartTime(tradeDate as Date).valueOf(),
            price,
            amount: Number(amount),
            dollar: Number(dollar),
            note,
        };
        const res =
            popup === 'add'
                ? await apiAddStockItem(params)
                : await apiEditStockItem({ ...params, _id: editData?._id });

        dispatch(updateLoading(false));
        if (res) {
            getStockList();
            closeHandle();
        }
    };

    const deleteItem = async () => {
        const isConfirm = window.confirm(`確定要刪除 ${editData?.itemName} 嗎?`);
        if (!isConfirm) return;
        dispatch(updateLoading(true));
        const res = await apiDeleteStockItem(editData?._id as string);
        dispatch(updateLoading(false));
        if (res) {
            getStockList();
            closeHandle();
        }
    };

    const closeHandle = () => {
        setPopup('');
        setEditData({} as StockItemParams);
    };

    return (
        <Modal open={popup === 'add' || popup === 'edit'} closeAfterTransition>
            <Fade in={popup === 'add' || popup === 'edit'} timeout={{ enter: 500, exit: 500 }}>
                <form className="fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm sm:w-96">
                    <h1 className="mb-4 h-auto text-center text-2xl font-bold text-blue-800">
                        {`${popup === 'add' ? '新增' : '編輯'}股票項目`}
                    </h1>

                    <div className="overflow-y-auto">
                        <BaseInput
                            ref={itemCodeRef}
                            id="life-itemCode"
                            label="股票代碼"
                            value={itemCode}
                            setValue={setItemCode}
                            isValid={itemCodeIsValid}
                            setIsValid={setItemCodeIsValid}
                            rules={itemCodeRules}
                            placeholder="請輸入股票代碼"
                            enter={submit}
                            onBlur={() => codeNameBlur('itemCode', itemCode)}
                        />
                        <BaseInput
                            ref={itemNameRef}
                            id="life-itemName"
                            label="股票名稱"
                            value={itemName}
                            setValue={setItemName}
                            isValid={itemNameIsValid}
                            setIsValid={setItemNameIsValid}
                            rules={itemNameRules}
                            placeholder="請輸入股票名稱"
                            enter={submit}
                            onBlur={() => codeNameBlur('itemName', itemName)}
                        />

                        <RadioGroup
                            className="!flex-row"
                            value={itemType}
                            onChange={e => setItemType(e.target.value)}
                        >
                            <FormControlLabel
                                value={'buy'}
                                control={<Radio size="small" />}
                                label="買進"
                            />
                            <FormControlLabel
                                value={'sell'}
                                control={<Radio size="small" />}
                                label="賣出"
                            />
                            <FormControlLabel
                                value={'allotment'}
                                control={<Radio size="small" />}
                                label="配股"
                            />
                        </RadioGroup>

                        <BaseDatePicker
                            ref={tradeDateRef}
                            id="life-tradeDate"
                            label="交易日期"
                            value={tradeDate}
                            setValue={setTradeDate}
                            isValid={tradeDateIsValid}
                            setIsValid={setTradeDateIsValid}
                            rules={tradeDateRules}
                            placeholder="請選擇交易日期"
                        />
                        <BaseInput
                            ref={priceRef}
                            id="life-price"
                            label="價位"
                            value={price}
                            setValue={setPrice}
                            isValid={priceIsValid}
                            setIsValid={setPriceIsValid}
                            rules={priceRules}
                            placeholder="請輸入價位"
                            enter={submit}
                        />
                        <BaseInput
                            ref={amountRef}
                            id="life-amount"
                            label="股數"
                            value={amount}
                            setValue={setAmount}
                            isValid={amountIsValid}
                            setIsValid={setAmountIsValid}
                            rules={amountRules}
                            placeholder="請輸入股數"
                            enter={submit}
                            onBlur={amountBlur}
                        />
                        <BaseInput
                            ref={dollarRef}
                            id="life-dollar"
                            label="金額"
                            value={dollar}
                            setValue={setDollar}
                            isValid={dollarIsValid}
                            setIsValid={setDollarIsValid}
                            rules={dollarRules}
                            placeholder="請輸入金額"
                            enter={submit}
                        />

                        <BaseTextarea
                            ref={noteRef}
                            id="life-note"
                            label="備註"
                            value={note}
                            setValue={setNote}
                            isValid={true}
                            setIsValid={() => ({})}
                            placeholder="請輸入備註"
                        />
                    </div>

                    <div className="flex h-auto justify-evenly pt-2">
                        <Button variant="contained" onClick={submit}>
                            送出
                        </Button>
                        {popup === 'edit' && (
                            <Button color="error" variant="contained" onClick={deleteItem}>
                                刪除
                            </Button>
                        )}
                        <Button color="info" variant="contained" onClick={closeHandle}>
                            取消
                        </Button>
                    </div>
                </form>
            </Fade>
        </Modal>
    );
};

export default PopupEdit;
