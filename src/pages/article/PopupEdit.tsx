import { useState, useRef, Ref, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { updateLoading } from '@/app/base';
import { updateSortList } from '@/app/sort';
import { useSnackbar } from 'notistack';

import { Modal, Fade, Button, FormControlLabel, Checkbox, Skeleton } from '@mui/material';
import { BaseInput, BaseInputType } from '@/components/baseInput/BaseInput';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { isRequired } from '@/utils/validate';
import {
    apiAddArticleItem,
    apiEditArticleItem,
    apiDeleteArticleItem,
    ArticleItemParams,
} from '@/api/article';
import { apiGetSortList, SortListRes } from '@/api/sort';

type Props = {
    popup: string;
    setPopup: (value: string) => void;
    getArticle: () => void;
    editData?: ArticleItemParams;
};

const PopupEdit = ({ popup, setPopup, getArticle, editData }: Props) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const edit = useMemo(() => {
        return popup === 'add' || popup === 'edit';
    }, [popup]);

    type PopupType = 'add' | 'edit';
    const popupTypeText = useMemo(() => {
        const typeList = { add: '新增', edit: '編輯' };
        return typeList[popup as PopupType] || '';
    }, [popup]);

    // Title
    const titleRef: Ref<BaseInputType> = useRef(null);
    const [title, setTitle] = useState('');
    const [titleIsValid, setTitleIsValid] = useState(false);
    const titleRules = [{ validate: isRequired, message: '請輸入標題名稱' }];

    // Content
    const [content, setContent] = useState('');
    const contentIsValid = useMemo(() => content?.length > 15, [content]);
    const [quillBlur, setQuillBlur] = useState(false);
    const blurQuill = () => {
        if (!quillBlur) setQuillBlur(true);
    };

    // Sort
    const sortList = useAppSelector<SortListRes['list']>(state => state.sort.sortList);
    const getSortList = useCallback(async () => {
        const res = await apiGetSortList();
        if (res) {
            dispatch(updateSortList(res.list));
        }
    }, [dispatch]);
    useEffect(() => {
        if (sortList.length === 0 && edit) getSortList();
    }, [popup, sortList, getSortList]);
    const [sorts, setSorts] = useState<string[]>([]);
    const sortsIsValid = useMemo(() => sorts?.length > 0, [sorts]);
    const [sortsBlur, setSortsBlur] = useState(false);
    const changeSort = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!sortsBlur) setSortsBlur(true);
        const value = event.target.value;
        const index = sorts.findIndex(item => item === value);
        setSorts(
            index === -1 ? [...sorts, value] : [...sorts.slice(0, index), ...sorts.slice(index + 1)]
        );
    };
    const nodeRef = useRef(null);
    const Sorts = useMemo(() => {
        const Loading = () => <Skeleton height={120} />;
        const Data = () => {
            return (
                <>
                    {sortList.map(item => {
                        return (
                            <FormControlLabel
                                label={item.name}
                                control={
                                    <Checkbox
                                        value={item.name}
                                        checked={Boolean(sorts.includes(item.name))}
                                        onChange={changeSort}
                                        className={sortsBlur && !sortsIsValid ? 'error-item' : ''}
                                    />
                                }
                                key={item.name}
                            />
                        );
                    })}
                    <Fade in={sortsBlur && !sortsIsValid}>
                        <div className="my-1 min-h-[1.25rem] text-sm text-red-500">
                            請選擇文章的分類
                        </div>
                    </Fade>
                </>
            );
        };
        return sortList.length === 0 ? <Loading /> : <Data />;
    }, [sortList, sorts]);

    useEffect(() => {
        setTitle(editData?.name || '');
        setContent(editData?.content || '');
        setSorts(editData?.sorts || []);
    }, [editData, popup]);

    // Submit
    const submit = async () => {
        const isValid = [titleRef.current?.validateNow(), contentIsValid, sortsIsValid];
        if (!isValid.every(item => item)) {
            if (!quillBlur) setQuillBlur(true);
            if (!sortsBlur) setSortsBlur(true);
            return enqueueSnackbar('請確認紅框處內容');
        }

        dispatch(updateLoading(true));
        const params: ArticleItemParams = {
            name: title,
            content,
            sorts,
            status: 1,
        };
        const res =
            popup === 'add'
                ? await apiAddArticleItem(params)
                : await apiEditArticleItem({ ...params, _id: editData?._id });

        dispatch(updateLoading(false));
        if (res) {
            getArticle();
            closeHandle();
        }
    };

    const deleteItem = async () => {
        const isConfirm = window.confirm(`確認要刪除 ${editData?.name} 嗎?`);
        if (!isConfirm) return;
        dispatch(updateLoading(true));
        const res = await apiDeleteArticleItem(editData?._id as string);
        dispatch(updateLoading(false));
        if (res) return navigate('/article');
    };

    const closeHandle = () => {
        setPopup('');
        resetSetting();
    };

    const resetSetting = () => {
        setTitle('');
        setContent('');
        setQuillBlur(false);
        setSorts([]);
        setSortsBlur(false);
    };

    return (
        <Modal open={edit} closeAfterTransition>
            <Fade in={edit} timeout={{ enter: 500, exit: 500 }}>
                <form
                    className={`fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm`}
                >
                    <h1 className="mb-4 h-auto text-center text-2xl font-bold text-blue-800">
                        {`${popupTypeText}文章`}
                    </h1>

                    <div className="h-full overflow-y-auto">
                        <BaseInput
                            ref={titleRef}
                            id="life-articleTitle"
                            label="標題名稱"
                            value={title}
                            setValue={setTitle}
                            isValid={titleIsValid}
                            setIsValid={setTitleIsValid}
                            rules={titleRules}
                            placeholder="請輸入標題名稱"
                            enter={submit}
                        />
                        <label className="mb-1 block text-gray-700">文章內容</label>
                        <ReactQuill
                            theme="snow"
                            defaultValue={content}
                            onChange={setContent}
                            onBlur={blurQuill}
                            className={quillBlur && !contentIsValid ? 'error-item' : ''}
                            modules={{
                                toolbar: {
                                    container: [
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [
                                            { list: 'ordered' },
                                            { list: 'bullet' },
                                            { indent: '-1' },
                                            { indent: '+1' },
                                        ],
                                        [{ align: [] }],
                                        [{ size: ['small', false, 'large', 'huge'] }],
                                        ['link', 'image', 'video'],
                                        ['clean'],
                                        [{ color: [] }, { background: [] }],
                                    ],
                                },
                            }}
                        />
                        <Fade in={quillBlur && !contentIsValid}>
                            <div className="my-1 min-h-[1.25rem] text-sm text-red-500">
                                內容長度不夠
                            </div>
                        </Fade>
                        <label className="mb-1 mt-4 block text-gray-700">文章分類</label>
                        <SwitchTransition>
                            <CSSTransition
                                key={sortList.length === 0 ? 'Loading' : 'DataDisplay'}
                                nodeRef={nodeRef}
                                classNames="page"
                                unmountOnExit
                                timeout={500}
                            >
                                <div ref={nodeRef}>{Sorts}</div>
                            </CSSTransition>
                        </SwitchTransition>
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
