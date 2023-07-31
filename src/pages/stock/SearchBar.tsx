import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';
import { BaseInput } from '@/components/baseInput/BaseInput';

type Props = {
    itemName: string;
    setItemName: (value: string) => void;
    buyStartDate: Date | null;
    setBuyStartDate: (value: Date | null) => void;
    buyEndDate: Date | null;
    setBuyEndDate: (value: Date | null) => void;
    sellStartDate: Date | null;
    setSellStartDate: (value: Date | null) => void;
    sellEndDate: Date | null;
    setSellEndDate: (value: Date | null) => void;
};

const SearchBar = ({
    itemName,
    setItemName,
    buyStartDate,
    setBuyStartDate,
    buyEndDate,
    setBuyEndDate,
    sellStartDate,
    setSellStartDate,
    sellEndDate,
    setSellEndDate,
}: Props) => {
    return (
        <Accordion className="mt-1">
            <AccordionSummary expandIcon={<ExpandMore />}>搜尋</AccordionSummary>
            <AccordionDetails>
                <BaseInput
                    label="股票名稱"
                    id="life-search-name"
                    value={itemName}
                    setValue={setItemName}
                    isValid={true}
                    setIsValid={() => ({})}
                    placeholder="請輸入股票名稱"
                    className="w-[15rem] flex-none"
                />
                <label className="mb-1 inline-block text-gray-700">購買日期</label>
                <div className="mb-6 flex items-center gap-2">
                    <BaseDatePicker
                        id="life-search-buy-start-date"
                        value={buyStartDate}
                        setValue={setBuyStartDate}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="購買日期起始"
                        wFull={false}
                    />
                    <BaseDatePicker
                        id="life-search-buy-end-date"
                        value={buyEndDate}
                        setValue={setBuyEndDate}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="購買日期結束"
                        wFull={false}
                    />
                </div>
                <label className="mb-1 inline-block text-gray-700">售出日期</label>
                <div className="mb-6 flex items-center gap-2">
                    <BaseDatePicker
                        id="life-search-sell-start-date"
                        value={sellStartDate}
                        setValue={setSellStartDate}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="售出日期起始"
                        wFull={false}
                    />
                    <BaseDatePicker
                        id="life-search-sell-end-date"
                        value={sellEndDate}
                        setValue={setSellEndDate}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="售出日期結束"
                        wFull={false}
                    />
                </div>
            </AccordionDetails>
        </Accordion>
    );
};

export default SearchBar;
