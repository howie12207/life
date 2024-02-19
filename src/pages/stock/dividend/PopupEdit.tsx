import { useState, useRef, Ref, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { updateLoading } from '@/app/base';
import { updateStockTable } from '@/app/stock';
import { useSnackbar } from 'notistack';
import { toStartTime } from '@/utils/format';
import { apiGetStockTable } from '@/api/stock';

import { Modal, Fade, Button } from '@mui/material';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';
import { BaseInput, BaseInputType } from '@/components/baseInput/BaseInput';
import { BaseTextarea } from '@/components/baseTextarea/BaseTextarea';

import { isRequired, onlyNumber } from '@/utils/validate';
import {
    apiAddDividendItem,
    apiEditDividendItem,
    apiDeleteDividendItem,
    DividendItemParams,
} from '@/api/stock';

type Props = {
    popup: string;
    setPopup: (value: string) => void;
    getDividendList: () => unknown;
    editData?: DividendItemParams;
    setEditData: (data: DividendItemParams) => void;
};

const PopupDividendEdit = ({ popup, setPopup, getDividendList, editData, setEditData }: Props) => {
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

    const tradeDateRef: Ref<BaseInputType> = useRef(null);
    const [tradeDate, setTradeDate] = useState<Date | null>(new Date());
    const [tradeDateIsValid, setTradeDateIsValid] = useState(false);
    const tradeDateRules = [{ validate: isRequired, message: '請選擇發放日期' }];

    const exDividendDateRef: Ref<BaseInputType> = useRef(null);
    const [exDividendDate, setExDividendDate] = useState<Date | null>(new Date());
    const [exDividendDateIsValid, setExDividendDateIsValid] = useState(false);
    const exDividendDateRules = [{ validate: isRequired, message: '請選擇除息日期' }];

    const dollarRef: Ref<BaseInputType> = useRef(null);
    const [dollar, setDollar] = useState('');
    const [dollarIsValid, setDollarIsValid] = useState(false);
    const dollarRules = [{ validate: onlyNumber, message: '請輸入正確金額' }];

    const amountRef: Ref<BaseInputType> = useRef(null);
    const [amount, setAmount] = useState('');
    const [amountIsValid, setAmountIsValid] = useState(false);
    const amountRules = [{ validate: onlyNumber, message: '請輸入持有股數' }];

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
        setTradeDate(new Date(editData?.tradeDate || new Date()));
        setExDividendDate(new Date(editData?.exDividendDate || new Date()));
        setDollar(String(editData?.dollar || ''));
        setAmount(String(editData?.amount || ''));
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
            exDividendDateRef.current?.validateNow(),
            itemCodeRef.current?.validateNow(),
            itemNameRef.current?.validateNow(),
            dollarRef.current?.validateNow(),
            amountRef.current?.validateNow(),
        ];
        if (!isValid.every(item => item)) return enqueueSnackbar('請確認紅框處內容');
        dispatch(updateLoading(true));
        const params: DividendItemParams = {
            itemCode,
            itemName,
            tradeDate: toStartTime(tradeDate as Date).valueOf(),
            exDividendDate: toStartTime(exDividendDate as Date).valueOf(),
            dollar: Number(dollar),
            amount: Number(amount),
            note,
        };
        const res =
            popup === 'add'
                ? await apiAddDividendItem(params)
                : await apiEditDividendItem({ ...params, _id: editData?._id });

        dispatch(updateLoading(false));
        if (res) {
            getDividendList();
            closeHandle();
        }
    };

    const deleteItem = async () => {
        const isConfirm = window.confirm(`確定要刪除 ${editData?.itemName} 嗎?`);
        if (!isConfirm) return;
        dispatch(updateLoading(true));
        const res = await apiDeleteDividendItem(editData?._id as string);
        dispatch(updateLoading(false));
        if (res) {
            getDividendList();
            closeHandle();
        }
    };

    const [popupType, setPopupType] = useState('');
    useEffect(() => {
        if (!popupType) setPopupType(popup);
    }, [popup, popupType]);

    const closeHandle = () => {
        setPopup('');

        setTimeout(() => {
            setEditData({} as DividendItemParams);
            setPopupType('');
        }, 500);
    };

    return (
        <Modal open={popup === 'add' || popup === 'edit'} closeAfterTransition>
            <Fade in={popup === 'add' || popup === 'edit'} timeout={{ enter: 500, exit: 500 }}>
                <form className="fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm sm:w-96">
                    <h1 className="mb-4 h-auto text-center text-2xl font-bold text-blue-800">
                        {`${popupType === 'add' ? '新增' : '編輯'}股利項目`}
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

                        <BaseDatePicker
                            ref={tradeDateRef}
                            id="life-tradeDate"
                            label="發放日期"
                            value={tradeDate}
                            setValue={setTradeDate}
                            isValid={tradeDateIsValid}
                            setIsValid={setTradeDateIsValid}
                            rules={tradeDateRules}
                            placeholder="請選擇發放日期"
                        />
                        <BaseDatePicker
                            ref={exDividendDateRef}
                            id="life-exDividendDate"
                            label="除息日期"
                            value={exDividendDate}
                            setValue={setExDividendDate}
                            isValid={exDividendDateIsValid}
                            setIsValid={setExDividendDateIsValid}
                            rules={exDividendDateRules}
                            placeholder="請選擇除息日期"
                        />
                        <BaseInput
                            ref={dollarRef}
                            id="life-dollar"
                            label="配息金額"
                            value={dollar}
                            setValue={setDollar}
                            isValid={dollarIsValid}
                            setIsValid={setDollarIsValid}
                            rules={dollarRules}
                            placeholder="請輸入配息金額"
                            enter={submit}
                        />
                        <BaseInput
                            ref={amountRef}
                            id="life-amount"
                            label="持有股數"
                            value={amount}
                            setValue={setAmount}
                            isValid={amountIsValid}
                            setIsValid={setAmountIsValid}
                            rules={amountRules}
                            placeholder="請輸入持有股數"
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
                        {popupType === 'edit' && (
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

export default PopupDividendEdit;
