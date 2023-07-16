import { useState, useRef, Ref, useEffect, ChangeEvent } from 'react';
import { useAppDispatch } from '@/app/hook';
import { updateLoading } from '@/app/base';
import { useSnackbar } from 'notistack';

import { Modal, Fade, Button, Radio, FormControlLabel, RadioGroup } from '@mui/material';
import { BaseInput, BaseInputType } from '@/components/baseInput/BaseInput';
import { BaseTextarea } from '@/components/baseTextarea/BaseTextarea';

import { isRequired, onlyNumber } from '@/utils/validate';
import {
    apiAddPortfolioItem,
    apiEditPortfolioItem,
    apiDeletePortfolioItem,
    PortfolioItemParams,
} from '@/api/portfolio';

type Props = {
    popup: string;
    setPopup: (value: string) => void;
    getPortfolioList: () => void;
    editData?: PortfolioItemParams;
    setEditData: (data: PortfolioItemParams) => void;
};

const PopupEdit = ({ popup, setPopup, getPortfolioList, editData, setEditData }: Props) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);

    const nameRef: Ref<BaseInputType> = useRef(null);
    const [name, setName] = useState('');
    const [nameIsValid, setNameIsValid] = useState(false);
    const nameRules = [{ validate: isRequired, message: '請輸入名稱' }];

    const [content, setContent] = useState('');

    const imgRef: Ref<BaseInputType> = useRef(null);
    const [img, setImg] = useState('');
    const [imgIsValid, setImgIsValid] = useState(false);
    const imgRules = [{ validate: isRequired, message: '請輸入圖片網址' }];

    const pathCodeRef: Ref<BaseInputType> = useRef(null);
    const [pathCode, setPathCode] = useState('');
    const [pathCodeIsValid, setPathCodeIsValid] = useState(false);
    const pathCodeRules = [{ validate: isRequired, message: '請輸入程式碼網址' }];

    const pathDemoRef: Ref<BaseInputType> = useRef(null);
    const [pathDemo, setPathDemo] = useState('');
    const [pathDemoIsValid, setPathDemoIsValid] = useState(false);
    const pathDemoRules = [{ validate: isRequired, message: '請輸入Demo網址' }];

    const [pathArticle, setPathArticle] = useState('');
    const [pathArticleIsValid, setPathArticleIsValid] = useState(false);
    const pathArticleRules = [{ validate: isRequired, message: '請輸入文章網址' }];

    const orderRef: Ref<BaseInputType> = useRef(null);
    const [order, setOrder] = useState('');
    const [orderIsValid, setOrderIsValid] = useState(false);
    const orderRules = [
        { validate: isRequired, message: '請輸入順序' },
        { validate: onlyNumber, message: '僅接受數字' },
    ];

    const [isRecommend, setIsRecommend] = useState(true);

    useEffect(() => {
        setName(editData?.name || '');
        setContent(editData?.content || '');
        setImg(editData?.img || '');
        setPathCode(editData?.pathCode || '');
        setPathDemo(editData?.pathDemo || '');
        setPathArticle(editData?.url || '');
        setOrder(String(editData?.order || ''));
        setIsRecommend(Boolean(editData?.recommend ?? true));
    }, [editData]);

    // submit
    const submit = async () => {
        const isValid = [
            nameRef.current?.validateNow(),
            imgRef.current?.validateNow(),
            pathCodeRef.current?.validateNow(),
            pathDemoRef.current?.validateNow(),
            orderRef.current?.validateNow(),
        ];
        if (!isValid.every(item => item)) return enqueueSnackbar('請確認紅框處內容');

        dispatch(updateLoading(true));
        const params: PortfolioItemParams = {
            name,
            content,
            img,
            pathCode,
            pathDemo,
            url: pathArticle,
            order: Number(order),
            status: 1,
            recommend: isRecommend,
        };
        const res =
            popup === 'add'
                ? await apiAddPortfolioItem(params)
                : await apiEditPortfolioItem({ ...params, _id: editData?._id });
        dispatch(updateLoading(false));
        if (res) {
            getPortfolioList();
            closeHandle();
        }
    };

    const deleteHandle = async () => {
        const isConfirm = window.confirm(`請確認是否刪除 ${editData?.name}`);
        if (!isConfirm) return;

        setIsLoading(true);
        const res = await apiDeletePortfolioItem(editData?._id as string);
        if (res) {
            getPortfolioList();
            closeHandle();
        }
        setIsLoading(false);
    };

    const closeHandle = () => {
        setPopup('');
        setEditData({} as PortfolioItemParams);
    };

    const changeIsRecommend = (e: ChangeEvent<HTMLInputElement>) => {
        setIsRecommend(e.target.value === 'true');
    };

    return (
        <Modal open={popup === 'add' || popup === 'edit'} closeAfterTransition>
            <Fade in={popup === 'add' || popup === 'edit'} timeout={{ enter: 500, exit: 500 }}>
                <form className="fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm sm:w-96">
                    <h1 className="mb-4 h-auto text-center text-2xl font-bold text-blue-800">
                        {`${popup === 'add' ? '新增' : '編輯'}作品項目`}
                    </h1>

                    <div className="overflow-y-auto">
                        <BaseInput
                            ref={nameRef}
                            id="life-name"
                            label="作品名稱"
                            value={name}
                            setValue={setName}
                            isValid={nameIsValid}
                            setIsValid={setNameIsValid}
                            rules={nameRules}
                            placeholder="請輸入作品名稱"
                            enter={submit}
                        />
                        <BaseTextarea
                            id="life-content"
                            label="描述"
                            value={content}
                            setValue={setContent}
                            isValid={true}
                            setIsValid={() => ({})}
                            placeholder="請輸入描述"
                        />
                        <BaseInput
                            ref={imgRef}
                            id="life-img"
                            label="圖片網址"
                            value={img}
                            setValue={setImg}
                            isValid={imgIsValid}
                            setIsValid={setImgIsValid}
                            rules={imgRules}
                            placeholder="請輸入圖片網址"
                            enter={submit}
                        />
                        <BaseInput
                            ref={pathCodeRef}
                            id="life-pathCode"
                            label="程式碼網址"
                            value={pathCode}
                            setValue={setPathCode}
                            isValid={pathCodeIsValid}
                            setIsValid={setPathCodeIsValid}
                            rules={pathCodeRules}
                            placeholder="請輸入程式碼網址"
                            enter={submit}
                        />
                        <BaseInput
                            ref={pathDemoRef}
                            id="life-pathDemo"
                            label="Demo網址"
                            value={pathDemo}
                            setValue={setPathDemo}
                            isValid={pathDemoIsValid}
                            setIsValid={setPathDemoIsValid}
                            rules={pathDemoRules}
                            placeholder="請輸入Demo網址"
                            enter={submit}
                        />
                        <BaseInput
                            id="life-pathArticle"
                            label="文章網址"
                            value={pathArticle}
                            setValue={setPathArticle}
                            isValid={pathArticleIsValid}
                            setIsValid={setPathArticleIsValid}
                            rules={pathArticleRules}
                            placeholder="請輸入文章網址"
                            enter={submit}
                        />
                        <BaseInput
                            ref={orderRef}
                            id="life-order"
                            label="排序"
                            value={order}
                            setValue={setOrder}
                            isValid={orderIsValid}
                            setIsValid={setOrderIsValid}
                            rules={orderRules}
                            placeholder="請輸入排序"
                            enter={submit}
                            inputmode="numeric"
                        />
                        <label>是否推薦</label>
                        <RadioGroup
                            className="!flex-row"
                            value={isRecommend}
                            onChange={changeIsRecommend}
                        >
                            <FormControlLabel
                                value={Boolean(true)}
                                control={<Radio size="small" />}
                                label="是"
                            />
                            <FormControlLabel
                                value={Boolean(false)}
                                control={<Radio size="small" />}
                                label="否"
                            />
                        </RadioGroup>
                    </div>

                    <div className="flex h-auto justify-evenly pt-2">
                        <Button variant="contained" onClick={submit} disabled={isLoading}>
                            送出
                        </Button>
                        {popup === 'edit' && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={deleteHandle}
                                disabled={isLoading}
                            >
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
