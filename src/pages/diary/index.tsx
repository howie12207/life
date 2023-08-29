import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { updateLoading } from '@/app/base';
import { apiGetDiaryList, DiaryItemParams } from '@/api/diary';

import Calendar from './Calendar';
import PopupEdit from './PopupEdit';

const Diary = () => {
    const dispatch = useAppDispatch();
    const isLogin = useAppSelector(state => state.base.token);

    const [diaryList, setDiaryList] = useState([] as Array<DiaryItemParams>);
    const getDiaryList = useCallback(async (params?: { [key: string]: number }) => {
        dispatch(updateLoading(true));
        const res = await apiGetDiaryList({
            startTime: params?.startTime,
            endTime: params?.endTime,
        });
        if (res) setDiaryList(res);
        dispatch(updateLoading(false));
    }, []);

    // Popup
    const [popup, setPopup] = useState('');
    const [editData, setEditData] = useState({} as DiaryItemParams);
    const handleEditData = (data: DiaryItemParams) => {
        if (!isLogin) return;

        if (!data.content) setPopup('add');
        else setPopup('edit');
        setEditData(data);
    };
    return (
        <div>
            <Calendar
                list={diaryList}
                handleEditData={handleEditData}
                getDiaryList={getDiaryList}
            />

            <PopupEdit
                popup={popup}
                setPopup={setPopup}
                editData={editData}
                setEditData={setEditData}
                getDiaryList={getDiaryList}
            />
        </div>
    );
};

export default Diary;
