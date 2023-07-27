import { useState, useEffect, useMemo, useCallback, DragEvent } from 'react';
import { apiGetDiaryList, apiEditDiaryItem, DiaryItemParams } from '@/api/diary';
import { formatDate, toStartTime } from '@/utils/format';
import { toXLSX } from '@/utils/toExcel';

import { Button } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Download } from '@mui/icons-material';

type Props = {
    list: Array<DiaryItemParams>;
    handleEditData: (data: {
        _id?: string;
        diaryTime: number;
        content: string;
        type: string;
        remindTime: number;
    }) => void;
    getDiaryList: () => void;
};
type DisplayItem = {
    time: number;
    content: Array<DiaryItemParams>;
};

const Calendar = ({ list, handleEditData, getDiaryList }: Props) => {
    const now = new Date();
    const [displayDate, setDisplayDate] = useState(now);
    const [monthStart, setMonthStart] = useState(0);
    const [monthEnd, setMonthEnd] = useState(0);
    const [displayList, setDisplayList] = useState<DisplayItem[]>([]);

    const getTimestampArray = (date = new Date()) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const previousMonthLastDay = new Date(year, month, 0);
        const nextMonthFirstDay = new Date(year, month + 1, 1);

        const timestampArray = [];

        // 包含前一個月的天數
        const previousMonthDays = firstDay.getDay();
        const previousMonthYear = previousMonthLastDay.getFullYear();
        const previousMonthMonth = previousMonthLastDay.getMonth();
        for (let i = previousMonthDays; i > 0; i--) {
            const timestamp = new Date(
                previousMonthYear,
                previousMonthMonth,
                previousMonthLastDay.getDate() - i + 1
            ).getTime();
            timestampArray.push({ time: timestamp, content: [] });
        }

        // 當月的天數
        for (let day = 1; day <= daysInMonth; day++) {
            const timestamp = new Date(year, month, day).getTime();
            if (day === 1) setMonthStart(timestamp);
            else if (day === daysInMonth) setMonthEnd(timestamp);
            timestampArray.push({ time: timestamp, content: [] });
        }

        // 包含後一個月的天數
        const totalShowDays = timestampArray.length > 35 ? 42 : 35;
        const nextMonthDays = totalShowDays - timestampArray.length;
        const nextMonthYear = nextMonthFirstDay.getFullYear();
        const nextMonthMonth = nextMonthFirstDay.getMonth();
        for (let i = 1; i <= nextMonthDays; i++) {
            const timestamp = new Date(nextMonthYear, nextMonthMonth, i).getTime();
            timestampArray.push({ time: timestamp, content: [] });
        }

        return timestampArray;
    };

    const handleDisplayList = useCallback(() => {
        const newList: Array<DisplayItem> = getTimestampArray(displayDate);
        list?.forEach(item => {
            const index = newList.findIndex(date => date.time === item.diaryTime);
            newList[index]?.content.push({
                _id: item._id,
                diaryTime: item.diaryTime,
                content: item.content,
                type: item.type,
                remindTime: item.remindTime,
            });
            setDisplayList(newList);
        });
    }, [displayDate, list]);

    useEffect(() => {
        handleDisplayList();
    }, [handleDisplayList]);

    type WeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const weekDayString = (index: WeekIndex) => {
        const list = {
            0: '日',
            1: '一',
            2: '二',
            3: '三',
            4: '四',
            5: '五',
            6: '六',
        };
        return list[index];
    };

    const showMonthString = useMemo(() => {
        const middle = displayList?.[15]?.time;
        return String(formatDate(middle) || '')?.slice(0, 7);
    }, [displayList]);

    const formatDay = (time: number) => {
        const day = String(formatDate(time)).slice(-2);
        return day === '01' ? String(formatDate(time)).slice(-5) : day;
    };

    const changeMonth = (direction: string) => {
        const middle = displayList?.[15]?.time;
        if (direction === 'previous') setDisplayDate(new Date(middle - 60 * 60 * 1000 * 24 * 30));
        else setDisplayDate(new Date(middle + 60 * 60 * 1000 * 24 * 30));
    };

    // Download
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const download = async () => {
        setIsLoadingDownload(true);
        const downloadList = await apiGetDiaryList();
        if (downloadList) {
            const newData = downloadList.map(item => {
                return {
                    日期: formatDate(item.diaryTime),
                    內容: item.content,
                    類型: item.type,
                };
            });
            toXLSX(newData, {
                sheetName: '日曆',
                fileName: `日曆${formatDate(new Date())}`,
            });
        }
        setIsLoadingDownload(false);
    };

    // Drag
    const [dragItem, setDragItem] = useState({} as DiaryItemParams);
    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (Object.keys(dragItem).length === 0) return;
        const newTime = Number(event.currentTarget?.dataset?.timestamp as string);
        const params: DiaryItemParams = {
            _id: dragItem._id || '',
            diaryTime: newTime,
            content: dragItem.content,
            type: dragItem.type,
        };
        if (dragItem.type === 'remind')
            params.remindTime = newTime - (dragItem.diaryTime - (dragItem.remindTime || 0));
        const res = await apiEditDiaryItem(params);
        if (res) getDiaryList();
    };
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };
    const handleDragStart = ({ _id, content, type, diaryTime, remindTime }: DiaryItemParams) => {
        setDragItem({ _id, content, type, diaryTime, remindTime });
    };

    return (
        <>
            <div className="my-4 flex items-center justify-center">
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setDisplayDate(now)}
                    className="!absolute left-4"
                    size="small"
                >
                    今天
                </Button>
                <KeyboardArrowLeft
                    className="cursor-pointer"
                    onClick={() => changeMonth('previous')}
                />
                {showMonthString}
                <KeyboardArrowRight
                    className="cursor-pointer"
                    onClick={() => changeMonth('next')}
                />
                <Button
                    variant="contained"
                    onClick={download}
                    disabled={isLoadingDownload}
                    className="!absolute right-4"
                    size="small"
                >
                    <Download className="!text-base" />
                    下載
                </Button>
            </div>
            <section className="grid h-[calc(100vh-5rem-2rem)] grid-cols-7 overflow-hidden text-xs sm:text-base">
                {displayList.map((item, index) => {
                    return (
                        <div
                            className={`border p-1 ${
                                toStartTime(now).valueOf() === item.time ? ' bg-green-200' : ''
                            } ${
                                item.time < monthStart || item.time > monthEnd ? 'bg-gray-100' : ''
                            }`}
                            key={item.time}
                            onClick={() =>
                                handleEditData({
                                    diaryTime: item.time,
                                    content: '',
                                    type: '',
                                    remindTime: item.time,
                                })
                            }
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            data-timestamp={item.time}
                        >
                            {index < 7 && (
                                <div className="text-center">
                                    {weekDayString(index as WeekIndex)}
                                </div>
                            )}
                            <div className="text-center">{formatDay(item.time)}</div>
                            {item.content?.map((text: DiaryItemParams, index: number) => {
                                return (
                                    <div
                                        title={text.content}
                                        className={`mb-1 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded p-1 ${
                                            text.type === 'out'
                                                ? 'bg-green-100'
                                                : text.type === 'workout'
                                                ? 'bg-red-100'
                                                : text.type === 'hike'
                                                ? 'bg-blue-100'
                                                : text.type === 'sick'
                                                ? 'bg-purple-100'
                                                : text.type === 'remind'
                                                ? 'bg-yellow-100'
                                                : ''
                                        }`}
                                        key={index}
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleEditData({
                                                _id: text._id,
                                                diaryTime: item.time,
                                                content: text.content,
                                                type: text.type,
                                                remindTime: text.remindTime || item.time,
                                            });
                                        }}
                                        draggable
                                        onDragStart={() =>
                                            handleDragStart({
                                                _id: text._id,
                                                diaryTime: item.time,
                                                content: text.content,
                                                type: text.type,
                                                remindTime: text.remindTime,
                                            })
                                        }
                                    >
                                        {text.content}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </section>
        </>
    );
};

export default Calendar;
