import Cookies from "js-cookie";

const HISTORY_KEY = "gacha_history";

export const saveToHistory = (item: any) => {
    const history = getHistory();
    history.push(item);
    Cookies.set(HISTORY_KEY, JSON.stringify(history));
};

export const getHistory = (): any[] => {
    const history = Cookies.get(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
};

export const clearHistory = () => {
    Cookies.remove(HISTORY_KEY);
};