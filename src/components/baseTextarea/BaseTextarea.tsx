import { useState, useImperativeHandle, forwardRef, Ref } from 'react';
import { Fade } from '@mui/material';

type BaseInputProps = {
    value: string;
    setValue: (value: string) => void;
    label?: string;
    id: string;
    isValid: boolean;
    setIsValid: (value: boolean) => void;
    rules?: Array<RulesType>;
    immediate?: boolean;
    children?: JSX.Element;
    disabled?: boolean;
    placeholder?: string;
    setIsFocus?: (value: boolean) => void;
    rows?: number;
    cols?: number;
};
export type BaseInputType = {
    validateNow: () => boolean;
    resetField: () => void;
};
export type RulesType = {
    validate: (value: string | Date) => boolean;
    message: string;
};

const Input = (
    {
        label,
        value,
        id,
        setValue,
        isValid,
        setIsValid,
        rules = [],
        immediate = false,
        children,
        disabled = false,
        placeholder = '',
        setIsFocus,
        rows,
        cols,
    }: BaseInputProps,
    ref: Ref<BaseInputType>
) => {
    const [isBlured, setIsBlured] = useState(false);
    const [message, setMessage] = useState('');

    const blurHandle = () => {
        setIsBlured(true);
        if (setIsFocus) setIsFocus(false);
        validate();
    };
    const inputHandle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        setValue(inputValue);
        if (immediate || isBlured) validate(inputValue);
    };
    const focusHandle = () => {
        if (setIsFocus) setIsFocus(true);
    };
    const validate = (modalValue = value) => {
        if (rules.length === 0) {
            setIsValid(true);
            return true;
        }
        for (const item of rules) {
            const valid = item.validate(modalValue);
            if (valid) continue;
            setMessage(item.message);
            setIsValid(false);
            return false;
        }
        setIsValid(true);
        return true;
    };
    const validateNow = (modalValue = value) => {
        const res = validate(modalValue);
        setIsBlured(true);
        return res;
    };
    const resetField = () => {
        setValue('');
        setIsValid(false);
        setIsBlured(false);
    };

    useImperativeHandle(ref, () => {
        return {
            validateNow,
            resetField,
        };
    });

    return (
        <div className={`max-w-full flex-1 ${!isValid && isBlured ? 'error-item' : ''}`}>
            <>
                {label && (
                    <label htmlFor={id} className="mb-1 inline-block text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative sm:flex">
                    <textarea
                        className={[
                            'w-full rounded border px-3 py-2 outline-none transition focus:border-blue-700 disabled:bg-gray-300',
                            `${!isValid && isBlured ? '!border-red-500' : ''}`,
                        ].join(' ')}
                        id={id}
                        value={value}
                        onBlur={blurHandle}
                        onInput={inputHandle}
                        onFocus={focusHandle}
                        {...(disabled ? { disabled } : {})}
                        {...(placeholder ? { placeholder } : {})}
                        {...(rows ? { rows } : {})}
                        {...(cols ? { cols } : {})}
                    />
                    {children}
                </div>
            </>
            <Fade in={!isValid && isBlured}>
                <div className="my-1 min-h-[1.25rem] text-sm text-red-500">{message}</div>
            </Fade>
        </div>
    );
};

export const BaseTextarea = forwardRef(Input);
