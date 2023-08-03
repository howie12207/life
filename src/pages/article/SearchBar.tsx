import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { updateSortList } from '@/app/sort';
import { apiGetSortList, SortListRes } from '@/api/sort';

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { BaseInput } from '@/components/baseInput/BaseInput';

type Props = {
    searchName: string;
    setSearchName: (value: string) => void;
    searchSort: Array<string>;
    setSearchSort: (value: Array<string>) => void;
    searchSwitch: boolean;
    setSearchSwitch: (value: boolean) => void;
};

const SearchBar = ({
    searchName,
    setSearchName,
    searchSort,
    setSearchSort,
    searchSwitch,
    setSearchSwitch,
}: Props) => {
    const dispatch = useAppDispatch();
    const sortList = useAppSelector<SortListRes['list']>(state => state.sort.sortList);
    const getSortList = useCallback(async () => {
        const res = await apiGetSortList();
        if (res) {
            dispatch(updateSortList(res.list));
        }
    }, [dispatch]);
    const changeSort = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const index = searchSort.findIndex(item => item === value);
        setSearchSort(
            index === -1
                ? [...searchSort, value]
                : [...searchSort.slice(0, index), ...searchSort.slice(index + 1)]
        );
    };
    useEffect(() => {
        if (sortList.length === 0) getSortList();
    }, [sortList, getSortList]);

    const handleSearch = () => {
        setSearchSwitch(!searchSwitch);
    };
    return (
        <Accordion className="mt-1">
            <AccordionSummary expandIcon={<ExpandMore />}>搜尋</AccordionSummary>
            <AccordionDetails>
                <BaseInput
                    label="文章名稱"
                    id="life-search-name"
                    value={searchName}
                    setValue={setSearchName}
                    isValid={true}
                    setIsValid={() => ({})}
                    placeholder="請輸入文章名稱"
                    className="w-[15rem] flex-none"
                />
                <label className="mb-1 inline-block text-gray-700">分類</label>
                <div className="mb-6 flex flex-wrap items-center gap-2">
                    {sortList.map(item => {
                        return (
                            <FormControlLabel
                                label={item.name}
                                control={
                                    <Checkbox
                                        value={item.name}
                                        checked={Boolean(searchSort.includes(item.name))}
                                        onChange={changeSort}
                                    />
                                }
                                key={item.name}
                            />
                        );
                    })}
                </div>
                <Button variant="contained" size="small" onClick={handleSearch}>
                    搜尋
                </Button>
            </AccordionDetails>
        </Accordion>
    );
};

export default SearchBar;
