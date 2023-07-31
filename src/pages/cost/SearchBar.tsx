import { Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';
import { BaseInput } from '@/components/baseInput/BaseInput';

type Props = {
    costStartDate: Date | null;
    setCostStartDate: (value: Date | null) => void;
    costEndDate: Date | null;
    setCostEndDate: (value: Date | null) => void;
    searchName: string;
    setSearchName: (value: string) => void;
    searchSwitch: boolean;
    setSearchSwitch: (value: boolean) => void;
};

const SearchBar = ({
    costStartDate,
    setCostStartDate,
    costEndDate,
    setCostEndDate,
    searchName,
    setSearchName,
    searchSwitch,
    setSearchSwitch,
}: Props) => {
    const handleSearch = () => {
        setSearchSwitch(!searchSwitch);
    };
    return (
        <Accordion className="mt-1">
            <AccordionSummary expandIcon={<ExpandMore />}>搜尋</AccordionSummary>
            <AccordionDetails>
                <BaseInput
                    label="項目名稱"
                    id="life-search-name"
                    value={searchName}
                    setValue={setSearchName}
                    isValid={true}
                    setIsValid={() => ({})}
                    placeholder="請輸入項目名稱"
                    className="w-[15rem] flex-none"
                />
                <label className="mb-1 inline-block text-gray-700">花費日期</label>
                <div className="mb-6 flex items-center gap-2">
                    <BaseDatePicker
                        id="life-search-cost-start-date"
                        value={costStartDate}
                        setValue={setCostStartDate}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="花費日期起始"
                        wFull={false}
                    />
                    <BaseDatePicker
                        id="life-search-cost-end-date"
                        value={costEndDate}
                        setValue={setCostEndDate}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="花費日期結束"
                        wFull={false}
                    />
                </div>
                <Button variant="contained" size="small" onClick={handleSearch}>
                    搜尋
                </Button>
            </AccordionDetails>
        </Accordion>
    );
};

export default SearchBar;
