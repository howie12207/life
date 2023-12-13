import { Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';

type Props = {
    recordStartDate: Date | null;
    setRecordStartDate: (value: Date | null) => void;
    searchSwitch: boolean;
    setSearchSwitch: (value: boolean) => void;
};

const SearchBar = ({
    recordStartDate,
    setRecordStartDate,
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
                <label className="mb-1 inline-block text-gray-700">花費日期</label>
                <div className="mb-6 flex items-center gap-2">
                    <BaseDatePicker
                        id="life-search-record-start-date"
                        value={recordStartDate}
                        setValue={setRecordStartDate}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="紀錄日期起始"
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
