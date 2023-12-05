import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface gameState {
    scoreTimeout: number
}

const initialState: gameState = {
    scoreTimeout: 10
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setScoreTimeout: (state, action: PayloadAction<number>) => {
            state.scoreTimeout = action.payload;
        }
    }
})

export const { setScoreTimeout } = gameSlice.actions;
export default gameSlice.reducer;
