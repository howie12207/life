import { Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';
import { BaseInput } from '@/components/baseInput/BaseInput';

type Props = {
    getStartDate: Date | null;
    setGetStartDate: (value: Date | null) => void;
    place: string;
    setPlace: (value: string) => void;
    searchSwitch: boolean;
    setSearchSwitch: (value: boolean) => void;
};

const SearchBar = ({
    getStartDate,
    setGetStartDate,
    place,
    setPlace,
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
                <label className="mb-1 inline-block text-gray-700">取得日期開始</label>
                <div className="mb-6 flex items-center gap-2">
                    <BaseDatePicker
                        id="life-search-get-start-date"
                        value={getStartDate}
                        setValue={setGetStartDate}
                        isValid={true}
                        setIsValid={() => ({})}
                        placeholder="取得日期起始"
                        wFull={false}
                    />
                </div>

                <BaseInput
                    label="地點"
                    id="life-search-place"
                    value={place}
                    setValue={setPlace}
                    isValid={true}
                    setIsValid={() => ({})}
                    placeholder="請輸入地點"
                    className="w-[15rem] flex-none"
                />

                <Button variant="contained" size="small" onClick={handleSearch}>
                    搜尋
                </Button>
            </AccordionDetails>
        </Accordion>
    );
};

export default SearchBar;
