import { useState, useRef, Ref, useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/app/hook';
import { updateLoading } from '@/app/base';
import { useSnackbar } from 'notistack';
import { formatDate, toStartTime } from '@/utils/format';

import { Modal, Fade, Button, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { BaseInput, BaseInputType } from '@/components/baseInput/BaseInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { isRequired } from '@/utils/validate';
import {
    apiAddDiaryItem,
    apiEditDiaryItem,
    apiDeleteDiaryItem,
    DiaryItemParams,
} from '@/api/diary';

type Props = {
    popup: string;
    setPopup: (value: string) => void;
    getDiaryList: () => void;
    editData?: DiaryItemParams;
    setEditData: (data: DiaryItemParams) => void;
};

const PopupEdit = ({ popup, setPopup, getDiaryList, editData, setEditData }: Props) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const dateString = useMemo(() => formatDate(editData?.diaryTime || ''), [editData?.diaryTime]);

    const contentRef: Ref<BaseInputType> = useRef(null);
    const [content, setContent] = useState('');
    const [contentIsValid, setContentIsValid] = useState(false);
    const contentRules = [{ validate: isRequired, message: '請輸入名稱' }];

    const [type, setType] = useState('');

    const [selectedTime, setSelectedTime] = useState(toStartTime(new Date()));

    useEffect(() => {
        setContent(editData?.content || '');
        setType(String(editData?.type || ''));
        setSelectedTime(
            new Date(editData?.remindTime || new Date(editData?.diaryTime || Date.now()))
        );
    }, [editData]);

    // submit
    const submit = async () => {
        const isValid = [contentRef.current?.validateNow()];
        if (!isValid.every(item => item)) return enqueueSnackbar('請確認紅框處內容');
        dispatch(updateLoading(true));
        const params: DiaryItemParams = {
            diaryTime: editData?.diaryTime || Date.now(),
            content,
            type,
            remindTime: new Date(selectedTime).valueOf(),
        };
        const res =
            popup === 'add'
                ? await apiAddDiaryItem(params)
                : await apiEditDiaryItem({ ...params, _id: editData?._id });

        dispatch(updateLoading(false));
        if (res) {
            getDiaryList();
            closeHandle();
        }
    };
    const deleteItem = async () => {
        const isConfirm = window.confirm(`確定要刪除 ${editData?.content} 嗎?`);
        if (!isConfirm) return;
        dispatch(updateLoading(true));
        const res = await apiDeleteDiaryItem(editData?._id as string);
        dispatch(updateLoading(false));
        if (res) {
            getDiaryList();
            closeHandle();
        }
    };

    const closeHandle = () => {
        setPopup('');
        setEditData({} as DiaryItemParams);
    };

    return (
        <Modal open={popup === 'add' || popup === 'edit'} closeAfterTransition>
            <Fade in={popup === 'add' || popup === 'edit'} timeout={{ enter: 500, exit: 500 }}>
                <form className="fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm sm:w-96">
                    <h1 className="mb-4 h-auto text-center text-2xl font-bold text-blue-800">
                        {`${popup === 'add' ? '新增' : '編輯'} ${dateString}`}
                    </h1>

                    <div className="overflow-y-auto">
                        <BaseInput
                            ref={contentRef}
                            id="life-content"
                            label="內容"
                            value={content}
                            setValue={setContent}
                            isValid={contentIsValid}
                            setIsValid={setContentIsValid}
                            rules={contentRules}
                            placeholder="請輸入內容"
                            autoFocus
                            enter={submit}
                        />
                        <label className="text-gray-700">類型</label>
                        <RadioGroup
                            className="!flex-row"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        >
                            <FormControlLabel
                                value={'remind'}
                                control={<Radio size="small" />}
                                label="提醒"
                            />
                            <FormControlLabel
                                value={'workout'}
                                control={<Radio size="small" />}
                                label="健身"
                            />
                            <FormControlLabel
                                value={'hike'}
                                control={<Radio size="small" />}
                                label="健行"
                            />
                            <FormControlLabel
                                value={'out'}
                                control={<Radio size="small" />}
                                label="Out"
                            />
                            <FormControlLabel
                                value={''}
                                control={<Radio size="small" />}
                                label="無"
                            />
                            <FormControlLabel
                                value={'sick'}
                                control={<Radio size="small" />}
                                label="不適"
                            />
                        </RadioGroup>

                        {type === 'remind' && (
                            <>
                                <label className="mb-1 block text-gray-700">提醒時間</label>
                                <DatePicker
                                    selected={selectedTime}
                                    onChange={date => setSelectedTime(date as Date)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={60}
                                    dateFormat="HH:mm"
                                    className={`h-10 w-full rounded border px-3 outline-none transition`}
                                />
                            </>
                        )}
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
