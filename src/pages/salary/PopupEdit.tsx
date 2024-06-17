import { useState, useRef, Ref, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { updateLoading } from '@/app/base';
import { useSnackbar } from 'notistack';
import { toStartTime, formatDate } from '@/utils/format';
import {
    apiAddSalaryItem,
    apiEditSalaryItem,
    apiDeleteSalaryItem,
    SalaryItemParams,
} from '@/api/salary';
import { isRequired, onlyNumber } from '@/utils/validate';

import { Modal, Fade, Button } from '@mui/material';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';
import { BaseInput, BaseInputType } from '@/components/baseInput/BaseInput';

type Props = {
    popup: string;
    setPopup: (value: string) => void;
    getSalaryList: () => unknown;
    editData?: SalaryItemParams;
    setEditData: (data: SalaryItemParams) => void;
};

const PopupEdit = ({ popup, setPopup, getSalaryList, editData, setEditData }: Props) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const autoReload = useAppSelector(state => state.base.autoReload);

    const getDateRef: Ref<BaseInputType> = useRef(null);
    const [getDate, setGetDate] = useState<Date | null>(new Date());
    const [getDateIsValid, setGetDateIsValid] = useState(false);
    const getDateRules = [{ validate: isRequired, message: '請選擇日期' }];

    const placeRef: Ref<BaseInputType> = useRef(null);
    const [place, setPlace] = useState('');
    const [placeIsValid, setPlaceIsValid] = useState(false);
    const placeRules = [{ validate: isRequired, message: '請輸入地方' }];

    const contentRef: Ref<BaseInputType> = useRef(null);
    const [content, setContent] = useState('');
    const [contentIsValid, setContentIsValid] = useState(false);
    const contentRules = [{ validate: isRequired, message: '請輸入工作內容' }];

    const dollarRef: Ref<BaseInputType> = useRef(null);
    const [dollar, setDollar] = useState('');
    const [dollarIsValid, setDollarIsValid] = useState(false);
    const dollarRules = [{ validate: onlyNumber, message: '請輸入正確金額' }];

    const remarkRef: Ref<BaseInputType> = useRef(null);
    const [remark, setRemark] = useState('');

    useEffect(() => {
        setGetDate(new Date(editData?.getDate || new Date()));
        setPlace(editData?.place || '');
        setContent(editData?.content || '');
        setDollar(String(editData?.dollar || ''));
        setRemark(editData?.remark || '');
    }, [editData]);

    // submit
    const submit = async () => {
        const isValid = [getDateRef.current?.validateNow()];
        if (!isValid.every(item => item)) return enqueueSnackbar('請確認紅框處內容');
        dispatch(updateLoading(true));
        const params: SalaryItemParams = {
            getDate: (toStartTime(getDate) as Date)?.valueOf(),
            place,
            content,
            dollar: Number(dollar),
            remark,
        };

        const res =
            popup === 'add'
                ? await apiAddSalaryItem(params)
                : await apiEditSalaryItem({ ...params, _id: editData?._id });

        dispatch(updateLoading(false));
        if (res) {
            getSalaryList();
            closeHandle();
        }
    };

    const deleteItem = async () => {
        const isConfirm = window.confirm(
            `確定要刪除 ${formatDate(editData?.getDate || new Date())} 嗎?`
        );
        if (!isConfirm) return;
        dispatch(updateLoading(true));
        const res = await apiDeleteSalaryItem(editData?._id as string);
        dispatch(updateLoading(false));
        if (res) {
            if (autoReload) getSalaryList();
            closeHandle();
        }
    };

    const closeHandle = () => {
        setPopup('');

        setTimeout(() => {
            setEditData({} as SalaryItemParams);
            setPopupType('');
        }, 500);
    };

    const [popupType, setPopupType] = useState('');
    useEffect(() => {
        if (!popupType) setPopupType(popup);
    }, [popup, popupType]);

    return (
        <Modal open={popup === 'add' || popup === 'edit'} closeAfterTransition>
            <Fade in={popup === 'add' || popup === 'edit'} timeout={{ enter: 500, exit: 500 }}>
                <form className="fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm sm:w-96">
                    <h1 className="mb-4 h-auto text-center text-2xl font-bold text-blue-800">
                        {`${popupType === 'add' ? '新增' : '編輯'}薪水`}
                    </h1>

                    <div className="overflow-y-auto">
                        <BaseDatePicker
                            ref={getDateRef}
                            id="life-getDate"
                            label="取得日期"
                            value={getDate}
                            setValue={setGetDate}
                            isValid={getDateIsValid}
                            setIsValid={setGetDateIsValid}
                            rules={getDateRules}
                            placeholder="請選擇取得日期"
                        />

                        <BaseInput
                            ref={placeRef}
                            id="life-place"
                            label="地方"
                            value={place}
                            setValue={setPlace}
                            isValid={placeIsValid}
                            setIsValid={setPlaceIsValid}
                            rules={placeRules}
                            placeholder="請輸入地方"
                        />

                        <BaseInput
                            ref={contentRef}
                            id="life-place"
                            label="工作內容"
                            value={content}
                            setValue={setContent}
                            isValid={contentIsValid}
                            setIsValid={setContentIsValid}
                            rules={contentRules}
                            placeholder="請輸入工作內容"
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
                        />

                        <BaseInput
                            ref={remarkRef}
                            id="life-place"
                            label="備註"
                            value={remark}
                            setValue={setRemark}
                            isValid={true}
                            setIsValid={() => true}
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

export default PopupEdit;
