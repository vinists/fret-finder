import {AnyAction, Dispatch, Middleware, MiddlewareAPI} from 'redux';
import {saveState} from "../localStorage";

type SlicesToPersist<State> = {
    [sliceName: string]: {
        stateSelector?: (state: State) => unknown;
    };
};

export const createSaveStateMiddleware = <State>(slicesToPersist: SlicesToPersist<State>): Middleware => {
    return (api: MiddlewareAPI<Dispatch, State>) => (next: Dispatch) => (action: AnyAction) => {
        let result = next(action);

        const state = api.getState();

        Object.keys(slicesToPersist).forEach(sliceName => {
            const {stateSelector} = slicesToPersist[sliceName];
            const sliceState = stateSelector ? stateSelector(state) : (state as any)[sliceName];
            saveState<typeof sliceState>(sliceState, sliceName);
        });

        return result;
    };
};
