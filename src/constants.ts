import {Note} from "./types";

export const NOTE_NAMES: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const TUNINGS: { [key: string]: Note[] } = {
    Standard: [
        { name: 'E', octave: 2 },
        { name: 'A', octave: 2 },
        { name: 'D', octave: 3 },
        { name: 'G', octave: 3 },
        { name: 'B', octave: 3 },
        { name: 'E', octave: 4 }
    ],
    DropD: [
        { name: 'D', octave: 2 },
        { name: 'A', octave: 2 },
        { name: 'D', octave: 3 },
        { name: 'G', octave: 3 },
        { name: 'B', octave: 3 },
        { name: 'E', octave: 4 }
    ],
    HalfStepDown: [
        { name: 'D#', octave: 2 },
        { name: 'G#', octave: 2 },
        { name: 'C#', octave: 3 },
        { name: 'F#', octave: 3 },
        { name: 'A#', octave: 3 },
        { name: 'D#', octave: 4 }
    ]
};
