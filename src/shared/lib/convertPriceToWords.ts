import { numberToWord } from '@/shared/config'

export const convertPriceToWords = (number: number) => {
    let x = +number.toFixed(2);
    const isMinus = x < 0;
    const maxNumber = Number.MAX_SAFE_INTEGER;
    x = Math.abs(x);
    if (x < 0 || x > maxNumber) return '';

    const currency = 'SUM';

    const groups: any[] = [];
    groups[0] = [];
    groups[1] = [];
    groups[2] = [];
    groups[3] = [];
    groups[4] = [];
    groups[5] = [];
    groups[6] = [];
    groups[9] = [];

    // Основные группы чисел
    groups[0][-1] = {
        'RUB': numberToWord.currency.rub,
        'USD': numberToWord.currency.usd,
        'EUR': numberToWord.currency.eur,
        'SUM': numberToWord.currency.sum,
        'NOCUR': ''
    };
    groups[0][1] = groups[0][2] = groups[0][3] = groups[0][4] = groups[0][-1];

    groups[1][-1] = numberToWord.units.thousand.plural;
    groups[1][1] = numberToWord.units.thousand.singular;
    groups[1][2] = groups[1][3] = groups[1][4] = numberToWord.units.thousand.few;

    groups[2][-1] = numberToWord.units.million.plural;
    groups[2][1] = numberToWord.units.million.singular;
    groups[2][2] = groups[2][3] = groups[2][4] = numberToWord.units.million.few;

    groups[3][-1] = numberToWord.units.billion.plural;
    groups[3][1] = numberToWord.units.billion.singular;
    groups[3][2] = groups[3][3] = groups[3][4] = numberToWord.units.billion.few;

    groups[4][-1] = numberToWord.units.trillion.plural;
    groups[4][1] = numberToWord.units.trillion.singular;
    groups[4][2] = groups[4][3] = groups[4][4] = numberToWord.units.trillion.few;

    groups[5][-1] = numberToWord.units.quadrillion.plural;
    groups[5][1] = numberToWord.units.quadrillion.singular;
    groups[5][2] = groups[5][3] = groups[5][4] = numberToWord.units.quadrillion.few;

    groups[6][-1] = numberToWord.units.quintillion.plural;
    groups[6][1] = numberToWord.units.quintillion.singular;
    groups[6][2] = groups[6][3] = groups[6][4] = numberToWord.units.quintillion.few;

    groups[9][-1] = {
        'RUB': numberToWord.cents.rub,
        'USD': numberToWord.cents.usd,
        'EUR': numberToWord.cents.eur,
        'SUM': numberToWord.cents.sum,
        'NOCUR': ''
    };
    groups[9][1] = groups[9][2] = groups[9][3] = groups[9][4] = groups[9][-1];

    const names = {
        1: numberToWord.numbers.one,
        2: numberToWord.numbers.two,
        3: numberToWord.numbers.three,
        4: numberToWord.numbers.four,
        5: numberToWord.numbers.five,
        6: numberToWord.numbers.six,
        7: numberToWord.numbers.seven,
        8: numberToWord.numbers.eight,
        9: numberToWord.numbers.nine,
        10: numberToWord.numbers.ten,
        11: numberToWord.numbers.eleven,
        12: numberToWord.numbers.twelve,
        13: numberToWord.numbers.thirteen,
        14: numberToWord.numbers.fourteen,
        15: numberToWord.numbers.fifteen,
        16: numberToWord.numbers.sixteen,
        17: numberToWord.numbers.seventeen,
        18: numberToWord.numbers.eighteen,
        19: numberToWord.numbers.nineteen,
        20: numberToWord.numbers.twenty,
        30: numberToWord.numbers.thirty,
        40: numberToWord.numbers.forty,
        50: numberToWord.numbers.fifty,
        60: numberToWord.numbers.sixty,
        70: numberToWord.numbers.seventy,
        80: numberToWord.numbers.eighty,
        90: numberToWord.numbers.ninety,
        100: numberToWord.numbers.hundred,
        200: numberToWord.numbers.two_hundred,
        300: numberToWord.numbers.three_hundred,
        400: numberToWord.numbers.four_hundred,
        500: numberToWord.numbers.five_hundred,
        600: numberToWord.numbers.six_hundred,
        700: numberToWord.numbers.seven_hundred,
        800: numberToWord.numbers.eight_hundred,
        900: numberToWord.numbers.nine_hundred
    } as const;

    let r = '';
    let i, j;
    let y = Math.floor(x);

    if (y === 0) {
        r = numberToWord.numbers.zero + ' ' + groups[0][-1][currency];
        return r.trim();
    }

    const decimalPart = Math.round((x - y) * 100);

    if (y > 0) {
        const t: any[] = [];
        for (i = 0; i <= 6; i++) {
            t[i] = y % 1000;
            y = Math.floor(y / 1000);
        }

        const d: any[][] = [];
        for (i = 0; i <= 6; i++) {
            d[i] = [];
            d[i][0] = t[i] % 10;
            d[i][10] = t[i] % 100 - d[i][0];
            d[i][100] = t[i] - d[i][10] - d[i][0];
            d[i][11] = t[i] % 100;
        }

        for (i = 6; i >= 0; i--) {
            const di100 = d[i][100] as keyof typeof names;
            const di11 = d[i][11] as keyof typeof names;
            const di10 = d[i][10] as keyof typeof names;
            const di0 = d[i][0] as keyof typeof names;
            if (t[i] > 0) {
                if (names[di100]) r += ' ' + names[di100];
                if (names[di11]) r += ' ' + names[di11];
                else {
                    if (names[di10]) r += ' ' + names[di10];
                    if (names[di0]) r += ' ' + names[di0];
                }

                j = names[di11] ? di11 : di0;

                let groupValue = groups[i][j] || groups[i][-1];

                if (typeof groupValue === 'object') {
                    groupValue = groupValue[currency] || '';
                }

                r += ' ' + groupValue;
            }
        }
    }

    if (decimalPart > 0) {
        r += ' ' + decimalPart;
        let decimalGroup = groups[9][decimalPart] || groups[9][-1];
        if (typeof decimalGroup === 'object') {
            decimalGroup = decimalGroup[currency] || '';
        }
        r += ' ' + decimalGroup;
    } else if (!r.includes(groups[0][-1][currency])) {
        r += ' ' + groups[0][-1][currency];
    }

    if (isMinus) {
        r = numberToWord.negative + ' ' + r;
    }

    return r.trim();
};
