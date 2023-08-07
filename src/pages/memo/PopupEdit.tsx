import { useState, useEffect, MouseEvent } from 'react';
import { useSnackbar } from 'notistack';

import { Modal, Fade, Button, TextField, IconButton, MenuItem, Menu } from '@mui/material';
import { Palette, NotInterested } from '@mui/icons-material';

import { MemoItemParams } from '@/api/memo';

type Props = {
    popup: string;
    close: () => void;
    editData?: MemoItemParams;
    paletteOptions: Array<string>;
    submitEdit: (data: MemoItemParams) => void;
    submitDelete: () => void;
};

const PopupEdit = ({ popup, close, editData, paletteOptions, submitEdit, submitDelete }: Props) => {
    const { enqueueSnackbar } = useSnackbar();

    const [content, setContent] = useState('');

    // Menu
    const [palette, setPalette] = useState('');
    const handleColor = (color: string) => {
        setPalette(color);
        handleClose();
    };
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        setContent(editData?.content || '');
        setPalette(editData?.color || '');
    }, [editData]);

    // submit
    const submit = async () => {
        if (!content.trim()) return enqueueSnackbar('請輸入內容');
        submitEdit({ ...editData, content: content.trim(), color: palette });
    };
    const deleteItem = async () => {
        const isConfirm = window.confirm(`確定要刪除嗎?`);
        if (!isConfirm) return;
        submitDelete();
    };

    return (
        <Modal open={popup === 'edit'} closeAfterTransition>
            <Fade in={popup === 'edit'} timeout={{ enter: 500, exit: 500 }}>
                <div className="fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm sm:w-96">
                    <div className="overflow-y-auto">
                        <TextField
                            className="w-full"
                            style={{ backgroundColor: palette }}
                            multiline
                            maxRows={20}
                            placeholder="新增便條紙.."
                            value={content}
                            onChange={e => setContent(e.target.value)}
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

                    <div className="flex h-auto justify-evenly pt-2">
                        <Button variant="contained" onClick={submit}>
                            送出
                        </Button>
                        {!editData?.deleteTime && (
                            <Button color="error" variant="contained" onClick={deleteItem}>
                                刪除
                            </Button>
                        )}
                        <Button color="info" variant="contained" onClick={close}>
                            取消
                        </Button>
                    </div>
                </div>
            </Fade>
        </Modal>
    );
};

export default PopupEdit;
