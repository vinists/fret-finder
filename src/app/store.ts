import {configureStore, ThunkAction, Action, getDefaultMiddleware, combineReducers} from '@reduxjs/toolkit';
import fretboardReducer from '../slices/fretboardSlice';
import noteDetectorReducer from '../slices/noteDetectorSlice';
import gameReducer from '../slices/gameSlice';
import {createSaveStateMiddleware} from "./saveStateMiddleware";

const rootReducer = combineReducers({
  fretboard: fretboardReducer,
  noteDetector: noteDetectorReducer,
  game: gameReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        createSaveStateMiddleware<RootState>({
          fretboard: {
            stateSelector: (state) => state.fretboard
          }
        })
    )
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
