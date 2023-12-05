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

