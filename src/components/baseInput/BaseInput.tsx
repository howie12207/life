import { useState, useImperativeHandle, forwardRef, Ref, KeyboardEvent } from 'react';
import { Fade } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type BaseInputProps = {
    type?: React.HTMLInputTypeAttribute;
    inputmode?: React.HTMLAttributes<HTMLLIElement>['inputMode'];
    value: string;
    setValue: (value: string) => void;
    label?: string;
    id: string;
    isValid: boolean;
    setIsValid: (value: boolean) => void;
    rules?: Array<RulesType>;
    upperCase?: boolean;
    maxlength?: number;
    immediate?: boolean;
    children?: JSX.Element;
    disabled?: boolean;
    placeholder?: string;
    setIsFocus?: (value: boolean) => void;
    showEye?: boolean;
    keydown?: (value: string) => void;
    autoFocus?: boolean;
    enter?: () => void;
    onBlur?: () => unknown;
    className?: string;
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
        type = 'text',
        inputmode,
        label,
        value,
        id,
        setValue,
        isValid,
        setIsValid,
        rules = [],
        upperCase = false,
        maxlength,
        immediate = false,
        children,
        disabled = false,
        placeholder = '',
        showEye = false,
        setIsFocus,
        keydown,
        autoFocus = false,
        enter,
        onBlur,
        className = '',
    }: BaseInputProps,
    ref: Ref<BaseInputType>
) => {
    const [isBlured, setIsBlured] = useState(false);
    const [message, setMessage] = useState('');

    const blurHandle = () => {
        setIsBlured(true);
        if (setIsFocus) setIsFocus(false);
        validate();
        if (onBlur) onBlur();
    };
    const inputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;
        if (upperCase) inputValue = inputValue.toUpperCase();
        setValue(inputValue);
        if (immediate || isBlured) validate(inputValue);
    };
    const focusHandle = () => {
        if (setIsFocus) setIsFocus(true);
    };
    const keydownHandle = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Go') {
            // Prevent default form submit
            e.preventDefault();

            if (enter && !e.nativeEvent.isComposing) enter();
        }

        if (keydown) keydown(e.key);
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

    const [customType, setCustomType] = useState(type);
    const typeHandle = () => {
        if (customType !== 'text') setCustomType('text');
        else setCustomType('password');
    };

    useImperativeHandle(ref, () => {
        return {
            validateNow,
            resetField,
        };
    });

    return (
        <div
            className={`max-w-full flex-1 ${!isValid && isBlured ? 'error-item' : ''} ${className}`}
        >
            <>
                {label && (
                    <label htmlFor={id} className="mb-1 inline-block text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative sm:flex">
                    <input
                        className={[
                            'h-10 w-full rounded border px-3 outline-none transition focus:border-blue-700 disabled:bg-gray-300',
                            `${!isValid && isBlured ? '!border-red-500' : ''}`,
                            `${showEye ? 'pr-10' : ''}`,
                        ].join(' ')}
                        type={customType}
                        id={id}
                        value={value}
                        onBlur={blurHandle}
                        onInput={inputHandle}
                        onFocus={focusHandle}
                        onKeyDown={keydownHandle}
                        autoComplete="new-password"
                        {...(disabled ? { disabled } : {})}
                        {...(inputmode ? { inputMode: inputmode } : {})}
                        {...(maxlength ? { maxLength: maxlength } : {})}
                        {...(placeholder ? { placeholder } : {})}
                        {...(autoFocus ? { autoFocus } : {})}
                    />
                    {showEye && (
                        <div className="absolute right-2 top-2">
                            {customType === 'password' ? (
                                <Visibility className="cursor-pointer" onClick={typeHandle} />
                            ) : (
                                <VisibilityOff className="cursor-pointer" onClick={typeHandle} />
                            )}
                        </div>
                    )}
                    {children}
                </div>
            </>
            <Fade in={!isValid && isBlured}>
                <div className="my-1 min-h-[1.25rem] text-sm text-red-500">{message}</div>
            </Fade>
        </div>
    );
};

export const BaseInput = forwardRef(Input);
