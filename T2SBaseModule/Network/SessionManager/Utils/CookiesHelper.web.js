import Cookies from 'universal-cookie';
import { isValidElement } from '../../../Utils/helpers';
const cookies = new Cookies();

export const getCookies = (key) => {
    return cookies.get(key);
};

export const getAllCookies = () => {
    return cookies.getAll();
};

export const setCookies = (key, value, path, expireTime = null) => {
    if (isValidElement(path)) {
        document.cookie = `${key}=${value}; path=${path}`;
        return null;
    }
    return expireTime ? cookies.set(key, value, { expires: expireTime }) : cookies.set(key, value);
};

export const deleteCookies = (key) => {
    return cookies.remove(key);
};
