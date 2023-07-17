import { useState, useEffect, useMemo, useCallback } from 'react';
import { apiGetDiaryList, DiaryItemParams } from '@/api/diary';
import { formatDate } from '@/utils/format';
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
    }) => void;
    handleMonth: () => void;
};
type DisplayItem = {
    time: number;
    content: Array<DiaryItemParams>;
};

const Calendar = ({ list, handleEditData, handleMonth }: Props) => {
    const now = new Date();
    const [displayDate, setDisplayDate] = useState(now);
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
            });
            setDisplayList(newList);
        });
    }, [list]);

    useEffect(() => {
        handleDisplayList();
    }, [handleDisplayList]);

    const showMonthString = useMemo(() => {
        const middle = displayList?.[15]?.time;
        return String(formatDate(middle))?.slice(0, 7);
    }, [displayList]);

    const formatDay = (time: number) => {
        const day = String(formatDate(time)).slice(-2);
        return day === '01' ? String(formatDate(time)).slice(-5) : day;
    };

    const changeMonth = (direction: string) => {
        const middle = displayList?.[15]?.time;
        if (direction === 'previous') setDisplayDate(new Date(middle - 60 * 60 * 1000 * 24 * 30));
        else setDisplayDate(new Date(middle + 60 * 60 * 1000 * 24 * 30));
        handleMonth();
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

    return (
        <>
            <div className="my-1 flex items-center justify-center">
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
            <section className="grid h-[calc(100vh-3.5rem-1.5rem)] grid-cols-7 overflow-hidden">
                {displayList.map(item => {
                    return (
                        <div
                            className="border p-1"
                            key={item.time}
                            onClick={() =>
                                handleEditData({
                                    diaryTime: item.time,
                                    content: '',
                                    type: '',
                                })
                            }
                        >
                            <div className="text-center">{formatDay(item.time)}</div>
                            <div className="">
                                {item.content?.map((text: DiaryItemParams, index: number) => {
                                    return (
                                        <div
                                            title={text.content}
                                            className={`cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded p-1 ${
                                                text.type === 'out'
                                                    ? 'bg-green-100'
                                                    : text.type === 'workout'
                                                    ? 'bg-red-100'
                                                    : text.type === 'hike'
                                                    ? 'bg-blue-100'
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
                                                });
                                            }}
                                        >
                                            {text.content}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </section>
        </>
    );
};

export default Calendar;
