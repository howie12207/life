import { useState, useRef, Ref, useEffect } from 'react';
import { useAppDispatch } from '@/app/hook';
import { updateLoading } from '@/app/base';
import { useSnackbar } from 'notistack';

import { Modal, Fade, Button } from '@mui/material';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';
import { BaseInput, BaseInputType } from '@/components/baseInput/BaseInput';
import { BaseTextarea } from '@/components/baseTextarea/BaseTextarea';

import { isRequired, onlyNumber } from '@/utils/validate';
import { toStartTime } from '@/utils/format';
import { apiAddCostItem, apiEditCostItem, apiDeleteCostItem, CostItemParams } from '@/api/cost';

type Props = {
    popup: string;
    setPopup: (value: string) => void;
    getCostList: () => void;
    editData?: CostItemParams;
    setEditData: (data: CostItemParams) => void;
};

const PopupEdit = ({ popup, setPopup, getCostList, editData, setEditData }: Props) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const dateRef: Ref<BaseInputType> = useRef(null);
    const [dateValue, setDateValue] = useState<Date | null>(new Date());
    const [dateIsValid, setDateIsValid] = useState(false);
    const dateRules = [{ validate: isRequired, message: '請選擇日期' }];

    const itemNameRef: Ref<BaseInputType> = useRef(null);
    const [itemName, setItemName] = useState('');
    const [itemNameIsValid, setItemNameIsValid] = useState(false);
    const itemNameRules = [{ validate: isRequired, message: '請輸入名稱' }];

    const priceRef: Ref<BaseInputType> = useRef(null);
    const [price, setPrice] = useState('');
    const [priceIsValid, setPriceIsValid] = useState(false);
    const priceRules = [{ validate: onlyNumber, message: '請輸入正確金額' }];

    const noteRef: Ref<BaseInputType> = useRef(null);
    const [note, setNote] = useState('');

    useEffect(() => {
        setDateValue(new Date(editData?.costTime || new Date()));
        setItemName(editData?.itemName || '');
        setPrice(String(editData?.price || ''));
        setNote(editData?.note || '');
    }, [editData]);

    // submit
    const submit = async () => {
        const isValid = [
            dateRef.current?.validateNow(),
            itemNameRef.current?.validateNow(),
            priceRef.current?.validateNow(),
        ];
        if (!isValid.every(item => item)) return enqueueSnackbar('請確認紅框處內容');
        dispatch(updateLoading(true));
        const params: CostItemParams = {
            costTime: toStartTime(dateValue as Date).valueOf(),
            itemName,
            price: Number(price),
            note,
        };
        const res =
            popup === 'add'
                ? await apiAddCostItem(params)
                : await apiEditCostItem({ ...params, _id: editData?._id });

        dispatch(updateLoading(false));
        if (res) {
            getCostList();
            closeHandle();
        }
    };

    const deleteItem = async () => {
        const isConfirm = window.confirm(`確定要刪除 ${editData?.itemName} 嗎?`);
        if (!isConfirm) return;
        dispatch(updateLoading(true));
        const res = await apiDeleteCostItem(editData?._id as string);
        dispatch(updateLoading(false));
        if (res) {
            getCostList();
            closeHandle();
        }
    };

    const closeHandle = () => {
        setPopup('');
        setEditData({} as CostItemParams);
    };

    return (
        <Modal open={popup === 'add' || popup === 'edit'} closeAfterTransition>
            <Fade in={popup === 'add' || popup === 'edit'} timeout={{ enter: 500, exit: 500 }}>
                <form className="fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm sm:w-96">
                    <h1 className="mb-4 h-auto text-center text-2xl font-bold text-blue-800">
                        {`${popup === 'add' ? '新增' : '編輯'}花費項目`}
                    </h1>

                    <div className="overflow-y-auto">
                        <BaseDatePicker
                            ref={dateRef}
                            id="life-date"
                            label="花費日期"
                            value={dateValue}
                            setValue={setDateValue}
                            isValid={dateIsValid}
                            setIsValid={setDateIsValid}
                            rules={dateRules}
                            placeholder="請選擇花費日期"
                        />
                        <BaseInput
                            ref={itemNameRef}
                            id="life-itemName"
                            label="項目名稱"
                            value={itemName}
                            setValue={setItemName}
                            isValid={itemNameIsValid}
                            setIsValid={setItemNameIsValid}
                            rules={itemNameRules}
                            placeholder="請輸入項目名稱"
                            enter={submit}
                        />
                        <BaseInput
                            ref={priceRef}
                            id="life-price"
                            label="花費金額"
                            value={price}
                            setValue={setPrice}
                            isValid={priceIsValid}
                            setIsValid={setPriceIsValid}
                            rules={priceRules}
                            placeholder="請輸入花費金額"
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
