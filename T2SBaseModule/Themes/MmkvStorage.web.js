import { MMKV_CONSTANTS } from '../../AppModules/BaseModule/GlobalAppConstants';

const getString = () => {
    return window.localStorage.getItem(MMKV_CONSTANTS.DEVICE_THEME);
};
const setString = (key, theme) => {
    window.localStorage.setItem(key, theme);
};

export const mmkvStorage = { getString, setString };
