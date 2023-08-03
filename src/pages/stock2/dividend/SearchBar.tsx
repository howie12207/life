import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';
import { BaseInput } from '@/components/baseInput/BaseInput';

type Props = {
    itemName: string;
    setItemName: (value: string) => void;
    startDate: Date | null;
    setStartDate: (value: Date | null) => void;
    endDate: Date | null;
    setEndDate: (value: Date | null) => void;
};

const SearchBar = ({
    itemName,
    setItemName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}: Props) => {
    return (
        <Accordion className="mt-2">
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
                <label className="mb-1 inline-block text-gray-700">配息日</label>
                <div className="mb-6 flex items-center gap-2">
                    <BaseDatePicker
                        id="life-search-start-date"
                        value={startDate}
                        setValue={setStartDate}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="配息日起始"
                        wFull={false}
                    />
                    <BaseDatePicker
                        id="life-search-end-date"
                        value={endDate}
                        setValue={setEndDate}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="配息日結束"
                        wFull={false}
                    />
                </div>
            </AccordionDetails>
        </Accordion>
    );
};

export default SearchBar;
