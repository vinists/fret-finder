import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveState, loadState } from "../localStorage";

interface Fretboardstate {
    amountOfFrets: number;
    tuningName: string;
    isLeftHanded: boolean;
}

let initialState: Fretboardstate = {
    amountOfFrets: 12,
    tuningName: 'Standard',
    isLeftHanded: false
};

let persistedState = loadState<Fretboardstate>('fretboard');
if(!persistedState) {
    saveState(initialState, 'fretboard');
} else {
    initialState = persistedState;
}

export const fretboardSlice = createSlice({
    name: 'fretboard',
    initialState,
    reducers: {
        setAmountOfFrets: (state, action: PayloadAction<number>) => {
          state.amountOfFrets = action.payload;
        },
        setLeftHanded: (state, action: PayloadAction<boolean>) => {
            state.isLeftHanded = action.payload;
        },
        setTuningName: ((state, action: PayloadAction<string>) => {
            state.tuningName = action.payload;
        })
    },
});

export const { setAmountOfFrets, setLeftHanded, setTuningName } = fretboardSlice.actions;
export default fretboardSlice.reducer;
