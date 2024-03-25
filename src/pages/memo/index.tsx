import { useState, MouseEvent, useEffect, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hook';
import { updateLoading } from '@/app/base';
import {
    apiGetMemoList,
    apiAddMemoItem,
    apiEditMemoItem,
    apiDeleteMemoItem,
    MemoItemParams,
} from '@/api/memo';

import { TextField, MenuItem, Menu, IconButton } from '@mui/material';
import { Palette, NotInterested } from '@mui/icons-material';
import { ClickAwayListener } from '@mui/base';
import PopupEdit from './PopupEdit';

const Memo = () => {
    const dispatch = useAppDispatch();
    const isLogin = useAppSelector(state => state.base.token);
    const autoReload = useAppSelector(state => state.base.autoReload);

    const [newText, setNewText] = useState('');

    // Menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Palette
    const [palette, setPalette] = useState('');
    const paletteOptions = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
    const handleColor = (color: string) => {
        setPalette(color);
        handleClose();
    };

    // List
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [memoList, setMemoList] = useState<Array<MemoItemParams>>([]);
    const setLayout = () => {
        const gap = 16;
        const wrapperWitdh = wrapperRef.current?.offsetWidth || 0;
        const memoItems = document.getElementsByClassName('memoItem');
        const itemWidth = (memoItems[0] as HTMLDivElement)?.offsetWidth || 0;
        const colmunsCount = Math.floor(wrapperWitdh / (itemWidth + gap));
        const containerWitdh = colmunsCount * itemWidth + (colmunsCount - 1) * 16;
        const diff = (wrapperWitdh - containerWitdh) / 2;
        if (containerRef.current) {
            containerRef.current.style.width = `${containerWitdh}px`;
        }

        const rowHeightArray = [] as number[];

        const setPosition = (index: number) => {
            if (index >= memoItems.length) return;

            const element = memoItems[index] as HTMLElement;
            if (index < colmunsCount) {
                element.style.transform = `translate(${(itemWidth + gap) * index}px, 0)`;
                rowHeightArray.push(element.offsetHeight);
            } else {
                const minHeight = Math.min(...rowHeightArray);
                const rowIndex = rowHeightArray.indexOf(minHeight);
                element.style.transform = `translate(${
                    memoItems[rowIndex].getBoundingClientRect().left - diff
                }px, ${minHeight + gap}px)`;
                rowHeightArray[rowIndex] = rowHeightArray[rowIndex] + element.offsetHeight + gap;
            }

            setPosition(index + 1);
        };
        setPosition(0);
    };
    useEffect(() => {
        window.addEventListener('resize', setLayout);
        return () => {
            window.removeEventListener('resize', setLayout);
        };
    }, []);
    const fetchMemoList = useCallback(async () => {
        dispatch(updateLoading(true));
        const res = await apiGetMemoList();
        if (res) {
            setMemoList(res as Array<MemoItemParams>);
            requestAnimationFrame(() => {
                setLayout();
                dispatch(updateLoading(false));
            });
        }
    }, []);
    useEffect(() => {
        fetchMemoList();
    }, []);

    const handleClickAway = async () => {
        if (!newText.trim()) return;
        submitAdd();
    };

    // Submit
    const submitAdd = async () => {
        const res = await apiAddMemoItem({ content: newText.trim(), color: palette });
        if (res) {
            if (autoReload) await fetchMemoList();
            setNewText('');
            setPalette('');
        }
    };
    const submitEdit = async (data: MemoItemParams) => {
        dispatch(updateLoading(true));
        const res = await apiEditMemoItem(data);
        if (res) {
            if (autoReload) fetchMemoList();
            close();
        }
        dispatch(updateLoading(false));
    };
    const submitDelete = async () => {
        dispatch(updateLoading(true));
        const res = await apiDeleteMemoItem(editData?._id as string);
        if (res) {
            fetchMemoList();
            close();
        }
        dispatch(updateLoading(false));
    };

    // Popup
    const [popup, setPopup] = useState('');
    const [editData, setEditData] = useState({} as MemoItemParams);
    const handleEditData = (data: MemoItemParams) => {
        if (!isLogin) return;
        setPopup('edit');
        setEditData(data);
    };
    const close = () => {
        setPopup('');

        setTimeout(() => {
            setEditData({} as MemoItemParams);
        }, 500);
    };

    return (
        <section>
            {isLogin && (
                <ClickAwayListener onClickAway={handleClickAway}>
                    <div className="mx-auto mt-4 w-96 max-w-[90%]">
                        <TextField
                            className="w-full"
                            style={{ backgroundColor: palette }}
                            multiline
                            maxRows={20}
                            placeholder="新增便條紙.."
                            value={newText}
                            onChange={e => setNewText(e.target.value)}
                        />
                        <div className="rounded bg-gray-200">
                            <IconButton onClick={handleClick}>
                                <Palette className="cursor-pointer" fontSize="small" />
                            </IconButton>
                            <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
                                {paletteOptions.map(color => {
                                    return (
                                        <MenuItem key={color} onClick={() => handleColor(color)}>
                                            <span
                                                className="h-5 w-5 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                        </MenuItem>
                                    );
                                })}
                                <MenuItem onClick={() => handleColor('')}>
                                    <NotInterested fontSize="small" />
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </ClickAwayListener>
            )}

            <div ref={wrapperRef} className="mt-4">
                <div ref={containerRef} className="relative mx-auto">
                    {memoList?.map((memo, index) => {
                        return (
                            <div
                                className={`memoItem absolute max-h-[30rem] w-60 translate-x-0 translate-y-0 overflow-y-auto break-words rounded border p-2`}
                                key={index}
                                style={{ backgroundColor: memo.deleteTime ? '#888' : memo.color }}
                                onClick={() => handleEditData(memo)}
                            >
                                <div className="whitespace-pre-wrap">{memo.content}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <PopupEdit
                popup={popup}
                close={close}
                editData={editData}
                paletteOptions={paletteOptions}
                submitEdit={submitEdit}
                submitDelete={submitDelete}
            />
        </section>
    );
};

export default Memo;
