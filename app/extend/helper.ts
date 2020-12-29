/**
 * JSON解析
 * @param {String} str
 * @param {any} placeholder
 */
export function getJsonData<T>(str: string, placeholder = ({} as T)): T {
    if (!str || str === 'null') {
        return placeholder;
    }
    try {
        return JSON.parse(str);
    } catch (e) {
        return placeholder;
    }
}

export default {
    getJsonData,
};
