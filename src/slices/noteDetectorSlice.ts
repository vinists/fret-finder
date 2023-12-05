import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Note} from "../types";

interface NoteState {
    isRunning: boolean,
    note: Note,
    updateIntervalMs: number
}


const initialState: NoteState = {
    isRunning: false,
    note: {name: "", octave: 0},
    updateIntervalMs: 10
}

export const noteDetectorSlice = createSlice({
    name: "noteDetector",
    initialState,
    reducers: {
        setIsRunning: (state, action: PayloadAction<boolean>) => {
          state.isRunning = action.payload;
        },
        setNote: (state, action: PayloadAction<Note>) => {
            state.note = action.payload
        },
        setUpdateInterval: (state, action: PayloadAction<number>) => {
            state.updateIntervalMs = action.payload
        }
    }
})

export const { setIsRunning, setNote, setUpdateInterval } = noteDetectorSlice.actions;
export default noteDetectorSlice.reducer;
