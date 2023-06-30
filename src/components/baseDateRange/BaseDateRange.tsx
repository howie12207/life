// import { useState, useImperativeHandle, forwardRef, Ref } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { Fade } from '@mui/material';
// import type { RulesType, BaseInputType } from '@/components/baseInput/BaseInput';

// type Props = {
//     label?: string;
//     value: Array<Date | null>;
//     setValue: (date: Array<Date | null>) => void;
//     isValid: boolean;
//     setIsValid: (isValid: boolean) => void;
//     rules?: Array<RulesType>;
//     placeholder?: string;
// };

// const Input = (
//     { label, value, setValue, isValid, setIsValid, rules = [], placeholder }: Props,
//     ref: Ref<BaseInputType>
// ) => {
//     const [isBlured, setIsBlured] = useState(false);
//     const [message, setMessage] = useState('');

//     const blurHandle = () => {
//         // setIsBlured(true);
//         // validate();
//     };
//     const changeHandle = (value: Date) => {
//         // setValue(value);
//         // validate(value);
//     };
//     const changeStartHandle = (value: Date) => {
//         // setValue(value);
//         // validate(value);
//     };
//     const changeEndHandle = (value: Date) => {
//         // setValue(value);
//         // validate(value);
//     };

//     const validate = (modalValue = value) => {
//         if (rules.length === 0) {
//             setIsValid(true);
//             return true;
//         }
//         for (const item of rules) {
//             const valid = item.validate(modalValue || '');
//             if (valid) continue;
//             setMessage(item.message);
//             setIsValid(false);
//             return false;
//         }
//         setIsValid(true);
//         return true;
//     };
//     const validateNow = (modalValue = value) => {
//         const res = validate(modalValue);
//         setIsBlured(true);
//         return res;
//     };
//     const resetField = () => {
//         setValue(null);
//         setIsValid(false);
//         setIsBlured(false);
//     };

//     useImperativeHandle(ref, () => {
//         return {
//             validateNow,
//             resetField,
//         };
//     });

//     return (
//         <>
//             {label && <label className="mb-1 inline-block text-gray-700">{label}</label>}
//             <DatePicker
//                 dateFormat="yyyy/MM/dd"
//                 wrapperClassName="sm:mx-2 w-full sm:w-auto min-w-[216px]"
//                 className={`h-10 w-full rounded border px-3 outline-none transition ${
//                     !isValid && isBlured ? '!border-red-500' : ''
//                 }`}
//                 selectsRange={true}
//                 startDate={value[0]}
//                 endDate={value[1]}
//                 onChange={update => {
//                     setValue(update);
//                 }}
//             />
//             {/* <DatePicker
//                 dateFormat="yyyy/MM/dd"
//                 wrapperClassName="sm:mx-2 w-full sm:w-auto"
//                 className={`h-10 w-full rounded border px-3 outline-none transition sm:w-auto ${
//                     !isValid && isBlured ? '!border-red-500' : ''
//                 }`}
//                 selected={value[0]}
//                 onChange={date => {
//                     setValue([date, value[1]]);
//                 }}
//                 {...(placeholder ? { placeholderText: placeholder } : {})}
//             />
//             <span className="block rotate-90 text-center sm:inline-block sm:rotate-0 sm:text-left">
//                 ~
//             </span>
//             <DatePicker
//                 dateFormat="yyyy/MM/dd"
//                 wrapperClassName="sm:mx-2 w-full sm:w-auto"
//                 className={`h-10 w-full rounded border px-3 outline-none transition sm:w-auto ${
//                     !isValid && isBlured ? '!border-red-500' : ''
//                 }`}
//                 selected={value[1]}
//                 onChange={date => {
//                     setValue([value[0], date]);
//                 }}
//                 {...(placeholder ? { placeholderText: placeholder } : {})}
//             /> */}
//             {/* <Fade in={!isValid && isBlured}>
//                 <div className="my-1 min-h-[20px] text-sm text-red-500">{message}</div>
//             </Fade> */}
//         </>
//     );
// };
// export const BaseDateRange = forwardRef(Input);
const BaseDateRange = () => {
    return <div></div>;
};
export default BaseDateRange;
