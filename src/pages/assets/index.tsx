import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppSelector } from '@/app/hook';
import { apiGetAssetsList } from '@/api/assets';
import { formatDate, formatToThousand } from '@/utils/format';

import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Button, Table, TableHead, TableRow, TableBody, TableCell, Skeleton } from '@mui/material';
import { Add } from '@mui/icons-material';
import PopupEdit from './PopupEdit';
import SearchBar from './SearchBar';
import { AssetsItemParams } from '@/api/assets';

const Assets = () => {
    const nodeRef = useRef(null);
    const isLogin = useAppSelector(state => state.base.token);

    // Search
    const [recordStartDate, setRecordStartDate] = useState<null | Date>(
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6)
    );
    const [searchSwitch, setSearchSwitch] = useState(false);

    const [assetsList, setAssetsList] = useState([{}, {}, {}, {}, {}] as Array<AssetsItemParams>);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const getAssetsList = useCallback(async () => {
        setIsLoadingData(true);
        const params: { [key: string]: number | string } = {};
        if (recordStartDate) params.startTime = recordStartDate.valueOf();

        const res = await apiGetAssetsList(params);
        if (res) aseetsListFilter(res);

        setIsLoadingData(false);
    }, [searchSwitch]);
    useEffect(() => {
        getAssetsList();
    }, [getAssetsList]);

    // Popup
    const [popup, setPopup] = useState('');

    const aseetsListFilter = (data: Array<AssetsItemParams>) => {
        const combineNameList = new Set() as Set<string>;
        data.forEach(asset => {
            asset.list.forEach(item => {
                combineNameList.add(`${item.itemName} (${item.currency})`);
                item.combineName = `${item.itemName} (${item.currency})`;
            });

            asset.total = asset.list.reduce((pre, next) => {
                let money = Number(next.dollar);
                if (next.currency === 'usd') money = money * Number(asset.forexUSD);
                else if (next.currency === 'zar') money = money * Number(asset.forexZAR);

                return pre + Number(money);
            }, 0);
        });

        data.forEach(asset => {
            combineNameList.forEach(item => {
                const spaceIndex = item.lastIndexOf(' ');
                const itemName = item.substring(0, spaceIndex);
                const currency = item.substring(spaceIndex + 2, item.length - 1);

                const existingItem = asset.list.find(
                    exist => `${exist.itemName} (${exist.currency})` === item
                );
                if (!existingItem) {
                    asset.list.push({
                        itemName,
                        currency,
                        dollar: 0,
                        combineName: `${itemName} (${currency})`,
                    });
                }

                asset.list.sort((a, b) =>
                    String(a.combineName) > String(b.combineName)
                        ? 1
                        : String(b.combineName) > String(a.combineName)
                        ? -1
                        : 0
                );
            });
        });

        setAssetsList(data);
    };

    return (
        <section className="p-4">
            {isLogin && (
                <div className="text-right">
                    <Button variant="contained" color="secondary" onClick={() => setPopup('add')}>
                        <Add className="!text-base" />
                        新增
                    </Button>
                </div>
            )}

            <SearchBar
                recordStartDate={recordStartDate}
                setRecordStartDate={setRecordStartDate}
                searchSwitch={searchSwitch}
                setSearchSwitch={setSearchSwitch}
            />

            <div className="overflow-x-auto">
                <SwitchTransition>
                    <CSSTransition
                        key={isLoadingData ? 'loading' : 'data'}
                        nodeRef={nodeRef}
                        timeout={300}
                        classNames="page"
                    >
                        <Table ref={nodeRef}>
                            <TableHead>
                                <TableRow>
                                    {isLoadingData ? (
                                        <TableCell>
                                            <Skeleton width={600} />
                                        </TableCell>
                                    ) : (
                                        <>
                                            <TableCell>時間</TableCell>
                                            {assetsList?.[0]?.list?.map(item => {
                                                return (
                                                    <TableCell key={item.combineName}>
                                                        {item.currency === 'twd'
                                                            ? item.itemName
                                                            : item.combineName}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>總額</TableCell>
                                        </>
                                    )}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {assetsList?.map((item, index) => {
                                    return !isLoadingData ? (
                                        <TableRow key={index}>
                                            <TableCell>{formatDate(item.recordDate)}</TableCell>
                                            {item.list?.map(list => {
                                                return (
                                                    <TableCell key={list.combineName}>
                                                        {formatToThousand(list.dollar, '-')}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                {formatToThousand(item.total || 0)}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Skeleton width={800} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CSSTransition>
                </SwitchTransition>
            </div>

            <PopupEdit popup={popup} setPopup={setPopup} getAssetsList={getAssetsList} />
        </section>
    );
};

export default Assets;
