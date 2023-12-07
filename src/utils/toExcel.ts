import { utils, writeFileXLSX } from 'xlsx';

type xlsxOptions = {
    sheetName?: string;
    fileName?: string;
};

/**
 *
 * @param {Array} data 原始資料
 * @param {String} sheetName 工作表名稱
 * @param {String} fileName 檔案名稱
 *
 */
export const toXLSX = (data: Array<unknown>, { sheetName, fileName } = {} as xlsxOptions) => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, sheetName);
    writeFileXLSX(wb, `${fileName}.xlsx`);
};
