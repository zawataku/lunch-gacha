const HISTORY_KEY = "gacha_history";

export const saveToHistory = (item: any) => {
    const history = getHistory();
    
    // 履歴表示に必要なデータのみを抽出して保存（容量節約）
    const simplifiedItem = {
        id: item.id,
        name: item.name,
        img: item.img,
        rarity: item.rarity
    };
    
    history.unshift(simplifiedItem);
    const limitedHistory = history.slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
};

export const getHistory = (): any[] => {
    try {
        const history = localStorage.getItem(HISTORY_KEY);
        const parsedHistory = history ? JSON.parse(history) : [];
        return Array.isArray(parsedHistory) ? parsedHistory.slice(0, 10) : [];
    } catch (e) {
        console.error("Failed to parse history", e);
        return [];
    }
};

export const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
};
