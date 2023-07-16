import { useState, useCallback, useEffect } from 'react';
import { apiGetDiaryList, DiaryItemParams } from '@/api/diary';

import Calendar from './Calendar';
import PopupEdit from './PopupEdit';

const Workout = () => {
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [diaryList, setDiaryList] = useState([] as Array<DiaryItemParams>);
    const getDiaryList = useCallback(async () => {
        setIsLoadingData(true);
        const res = await apiGetDiaryList();
        if (res) setDiaryList(res);

        setIsLoadingData(false);
    }, []);
    useEffect(() => {
        getDiaryList();
        // TODO
        console.log(isLoadingData);
    }, [getDiaryList]);

    // Popup
    const [popup, setPopup] = useState('');
    const [editData, setEditData] = useState({} as DiaryItemParams);
    const handleEditData = (data: DiaryItemParams) => {
        if (!data.content) setPopup('add');
        else setPopup('edit');
        setEditData(data);
    };
    return (
        <div>
            <div></div>
            <Calendar list={diaryList} handleEditData={handleEditData} handleMonth={getDiaryList} />

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

export default Workout;
