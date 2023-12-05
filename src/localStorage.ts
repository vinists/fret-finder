export const loadState = <T>(name: string): T | null => {
    try {
        const serializedState = localStorage.getItem(`state-${name}`);
        if(serializedState === null){
            return null;
        }
        return JSON.parse(serializedState) as T;
    } catch (err) {
        return null;
    }
};

export const saveState = <T>(state: T, name: string): void => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(`state-${name}`, serializedState);
    } catch(err) {

    }
}

export const getItem = (key: string): string | null => {
    try {
        return localStorage?.getItem(key);
    } catch(e) { return null }
}

export const setItem = (key: string, value: string): void => {
    try {
        localStorage?.setItem(key, value);
    } catch(e) { }
}
