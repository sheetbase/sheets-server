// turn [[],[], ...] to [{},{}, ...]
export function translateRangeValues<Item>(
    values: any[][],
    noHeader = false,
    modifier = item => item,
) {
    values = values || [];
    // get header
    const headers: string[] = !noHeader ? values.shift() : [];
    // build data
    const result: Item[] = [];
    for (let i = 0; i < values.length; i++) {
        const item: Item = {} as any;
        // process columns
        const rows = values[i] || [];
        for (let j = 0; j < rows.length; j++) {
            if (rows[j]) {
                item[headers[j] || ('value' + (j + 1))] = rows[j];
            }
        }
        if (Object.keys(item).length > 0) {
            item['_row'] = !noHeader ? i + 2 : i + 1;
            result.push(modifier(item));
        }
    }
    return result;
}

// convert string of data load from spreadsheet to correct data type
export function parseData(data: {}) {
    for (const key of Object.keys(data)) {
        if (data[key] === '' || data[key] === null || data[key] === undefined) {
            // delete null key
            delete data[key];
        } else if ((data[key] + '').toLowerCase() === 'true') {
            // boolean TRUE
            data[key] = true;
        } else if ((data[key] + '').toLowerCase() === 'false') {
            // boolean FALSE
            data[key] = false;
        } else if (!isNaN(data[key])) {
            // number
            // tslint:disable:ban radix
            if (Number(data[key]) % 1 === 0) {
                data[key] = parseInt(data[key]);
            }
            if (Number(data[key]) % 1 !== 0) {
                data[key] = parseFloat(data[key]);
            }
        } else {
            // JSON
            try {
                data[key] = JSON.parse(data[key]);
            } catch (e) {
                // continue
            }
        }
    }
    return data as any;
}

// convert some types to string for saving to spreadsheet
export function stringifyData(data: {}) {
    for (const key of Object.keys(data)) {
        // object
        if (data[key] instanceof Object) {
            data[key] = JSON.stringify(data[key]);
        }
    }
    return data as any;
}