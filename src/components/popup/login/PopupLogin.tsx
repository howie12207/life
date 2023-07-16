import { useState, useRef, Ref } from 'react';
import { useAppDispatch } from '@/app/hook';
import { updateLoading } from '@/app/base';
import { useSnackbar } from 'notistack';
import { Modal, Fade, Button, Backdrop } from '@mui/material';
import { BaseInput, BaseInputType } from '@/components/baseInput/BaseInput';
import { isRequired } from '@/utils/validate';
import { apiLogin } from '@/api/base';

type Props = {
    popup: string;
    setPopup: (value: string) => void;
};

const PopupLogin = ({ popup, setPopup }: Props) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const accountRef: Ref<BaseInputType> = useRef(null);
    const [account, setAccount] = useState('');
    const [accountIsValid, setAccountIsValid] = useState(false);
    const accountRules = [{ validate: isRequired, message: '請輸入帳號' }];

    const passwordRef: Ref<BaseInputType> = useRef(null);
    const [password, setPassword] = useState('');
    const [passwordIsValid, setPasswordIsValid] = useState(false);
    const passwordRules = [{ validate: isRequired, message: '請輸入密碼' }];

    // Submit
    const submit = async () => {
        const isValid = [accountRef.current?.validateNow(), passwordRef.current?.validateNow()];
        if (!isValid.every(item => item)) return enqueueSnackbar('請確認紅框處內容');

        dispatch(updateLoading(true));
        const res = await apiLogin({ account, password });
        dispatch(updateLoading(false));
        if (res) setPopup('');
    };

    return (
        <Modal
            open={popup === 'login'}
            onClose={() => setPopup('')}
            slots={{ backdrop: Backdrop }}
            closeAfterTransition
        >
            <Fade in={popup === 'login'} timeout={{ enter: 500, exit: 500 }}>
                <form className="fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col rounded bg-white px-4 py-8 text-sm sm:w-96">
                    <h1 className="mb-4 h-auto text-center text-2xl font-bold text-blue-800">
                        管理員登入
                    </h1>

                    <div className="overflow-y-auto">
                        <BaseInput
                            ref={accountRef}
                            id="life-account"
                            label="帳號"
                            value={account}
                            setValue={setAccount}
                            isValid={accountIsValid}
                            setIsValid={setAccountIsValid}
                            rules={accountRules}
                            placeholder="請輸入您的帳號"
                            enter={submit}
                        />
                        <BaseInput
                            ref={passwordRef}
                            id="life-password"
                            label="密碼"
                            type="password"
                            showEye
                            value={password}
                            setValue={setPassword}
                            isValid={passwordIsValid}
                            setIsValid={setPasswordIsValid}
                            rules={passwordRules}
                            placeholder="請輸入您的密碼"
                            enter={submit}
                        />
                    </div>

                    <div className="flex h-auto justify-evenly pt-2">
                        <Button variant="contained" onClick={submit}>
                            登入
                        </Button>
                        <Button color="info" variant="contained" onClick={() => setPopup('')}>
                            取消
                        </Button>
                    </div>
                </form>
            </Fade>
        </Modal>
    );
};

export default PopupLogin;
