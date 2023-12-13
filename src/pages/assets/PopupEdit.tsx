import { useState, useRef, Ref } from 'react';
import { useAppDispatch } from '@/app/hook';
import { updateLoading } from '@/app/base';
import { useSnackbar } from 'notistack';
import { formatToThousand, toStartTime } from '@/utils/format';
import { apiAddAssetsItem, AssetsListItem, AssetsItemParams } from '@/api/assets';
import { isRequired, onlyNumber } from '@/utils/validate';

import {
    Modal,
    Fade,
    Button,
    RadioGroup,
    Radio,
    FormControlLabel,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';
import { BaseInput, BaseInputType } from '@/components/baseInput/BaseInput';

type Props = {
    popup: string;
    setPopup: (value: string) => void;
    getAssetsList: () => unknown;
};

const PopupEdit = ({ popup, setPopup, getAssetsList }: Props) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const recordDateRef: Ref<BaseInputType> = useRef(null);
    const [recordDate, setRecordDate] = useState<Date | null>(new Date());
    const [recordDateIsValid, setRecordDateIsValid] = useState(false);
    const recordDateRules = [{ validate: isRequired, message: '請選擇日期' }];

    const [tempList, setTempList] = useState([] as Array<AssetsListItem>);

    const itemNameRef: Ref<BaseInputType> = useRef(null);
    const [itemName, setItemName] = useState('');
    const [itemNameIsValid, setItemNameIsValid] = useState(false);
    const itemNameRules = [{ validate: isRequired, message: '請輸入項目名稱' }];

    const [currency, setCurrency] = useState('twd');

    const dollarRef: Ref<BaseInputType> = useRef(null);
    const [dollar, setDollar] = useState('');
    const [dollarIsValid, setDollarIsValid] = useState(false);
    const dollarRules = [{ validate: onlyNumber, message: '請輸入正確金額' }];

    const forexUSDRef: Ref<BaseInputType> = useRef(null);
    const [forexUSD, setForexUSD] = useState('');
    const [forexUSDIsValid, setForexUSDIsValid] = useState(false);
    const forexUSDRules = [{ validate: onlyNumber, message: '請輸入正確美金匯率' }];

    const forexZARRef: Ref<BaseInputType> = useRef(null);
    const [forexZAR, setForexZAR] = useState('');
    const [forexZARIsValid, setForexZARIsValid] = useState(false);
    const forexZARRules = [{ validate: onlyNumber, message: '請輸入正確南非幣匯率' }];

    const addOne = () => {
        const isValid = [itemNameRef.current?.validateNow(), dollarRef.current?.validateNow()];
        if (!isValid.every(item => item)) return enqueueSnackbar('請確認紅框處內容');
        setTempList(pre => [...pre, { itemName, currency, dollar }] as Array<AssetsListItem>);
        setItemName('');
        setCurrency('twd');
        setDollar('');
    };
    const deleteOne = (index: number) => {
        setTempList(pre => [...pre.slice(0, index), ...pre.slice(index + 1)]);
    };

    // submit
    const submit = async () => {
        const isValid = [recordDateRef.current?.validateNow()];
        if (!isValid.every(item => item)) return enqueueSnackbar('請確認紅框處內容');
        if (tempList.length <= 0) return enqueueSnackbar('請新增資產');
        dispatch(updateLoading(true));
        const params: AssetsItemParams = {
            recordDate: toStartTime(recordDate as Date).valueOf(),
            list: tempList,
            forexUSD,
            forexZAR,
        };
        const res = await apiAddAssetsItem(params);

        dispatch(updateLoading(false));
        if (res) {
            getAssetsList();
            closeHandle();
        }
    };

    const closeHandle = () => {
        setPopup('');
    };

    return (
        <Modal open={popup === 'add' || popup === 'edit'} closeAfterTransition>
            <Fade in={popup === 'add' || popup === 'edit'} timeout={{ enter: 500, exit: 500 }}>
                <form className="fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm sm:w-96">
                    <h1 className="mb-4 h-auto text-center text-2xl font-bold text-blue-800">
                        {`${popup === 'add' ? '新增' : '編輯'}資產`}
                    </h1>

                    <div className="overflow-y-auto">
                        <BaseDatePicker
                            ref={recordDateRef}
                            id="life-recordDate"
                            label="紀錄日期"
                            value={recordDate}
                            setValue={setRecordDate}
                            isValid={recordDateIsValid}
                            setIsValid={setRecordDateIsValid}
                            rules={recordDateRules}
                            placeholder="請選擇紀錄日期"
                        />

                        <BaseInput
                            ref={forexUSDRef}
                            id="life-forexUSD"
                            label="美金匯率"
                            value={forexUSD}
                            setValue={setForexUSD}
                            isValid={forexUSDIsValid}
                            setIsValid={setForexUSDIsValid}
                            rules={forexUSDRules}
                            placeholder="請輸入美金匯率"
                            enter={submit}
                        />
                        <BaseInput
                            ref={forexZARRef}
                            id="life-forexZAR"
                            label="南非幣匯率"
                            value={forexZAR}
                            setValue={setForexZAR}
                            isValid={forexZARIsValid}
                            setIsValid={setForexZARIsValid}
                            rules={forexZARRules}
                            placeholder="請輸入南非幣匯率"
                            enter={submit}
                        />

                        <BaseInput
                            ref={itemNameRef}
                            id="life-itemName"
                            label="資產名稱"
                            value={itemName}
                            setValue={setItemName}
                            isValid={itemNameIsValid}
                            setIsValid={setItemNameIsValid}
                            rules={itemNameRules}
                            placeholder="請輸入資產名稱"
                            enter={addOne}
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
                            enter={addOne}
                        />
                        <RadioGroup
                            className="!flex-row"
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                        >
                            <FormControlLabel
                                value={'twd'}
                                control={<Radio size="small" />}
                                label="台幣"
                            />
                            <FormControlLabel
                                value={'usd'}
                                control={<Radio size="small" />}
                                label="美金"
                            />
                            <FormControlLabel
                                value={'zar'}
                                control={<Radio size="small" />}
                                label="南非幣"
                            />
                        </RadioGroup>
                        <Button
                            className="!mb-1 !block"
                            variant="contained"
                            color="secondary"
                            onClick={addOne}
                        >
                            新增一筆
                        </Button>

                        <label htmlFor="">列表</label>
                        <Table className="mb-4">
                            <TableBody>
                                {tempList.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell width={1}>
                                                <Close
                                                    className="cursor-pointer"
                                                    onClick={() => deleteOne(index)}
                                                />
                                            </TableCell>
                                            <TableCell>{item.itemName}</TableCell>
                                            <TableCell>{item.currency}</TableCell>
                                            <TableCell>{formatToThousand(item.dollar)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex h-auto justify-evenly pt-2">
                        <Button variant="contained" onClick={submit}>
                            送出
                        </Button>
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
