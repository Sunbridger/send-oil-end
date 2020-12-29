import randomString from 'random-string';

/**
 * 生成指定长度的不重复的8位随机码
 * @param {String} len 长度
 * @param {String[]} arr 已经存在的随机码
 * @return {String[]} 生成的随机码
 */
export function getRandom(len: number, arr: string[] = []): string[] {
    const randoms = new Array(len - arr.length).fill('').map(() => randomString({ length: 8 }));
    arr = arr.concat(randoms);
    arr = Array.from(new Set(arr));
    if (arr.length < len) {
        return getRandom(len, arr);
    }
    return arr;
}

/**
 * 生成非存在的8位随机码
 * @param {String} num 个数
 * @param {String[]} arr 已经存在的随机码
 * @param {String[]} result 结果
 * @param {String[]}
 */
export function getCodes(num: number, arr: string[], result: string[] = []) {
    let codes = result.concat(getRandom(num));
    codes = codes.filter(code => arr.indexOf(code) === -1);
    if (codes.length === num) {
        return codes;
    }
    return getCodes(num - codes.length, arr, codes);
}
