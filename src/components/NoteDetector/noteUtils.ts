import {Note} from "../../types";
import {NOTE_NAMES} from "../../constants";

const referenceFrequency: number = 440;

export function getNoteFromPitch(frequency: number): Note {
    let n: number = 12 * (Math.log(frequency / referenceFrequency) / Math.log(2));
    let noteNumber: number = Math.round(n) + 57;
    let noteName: string = NOTE_NAMES[noteNumber % 12];
    let octave: number = Math.floor(noteNumber / 12);
    return { name: noteName, octave: octave };
}

export function calculateVolume(input: Float32Array): number {
    const sumOfSquares = input.reduce((sum, val) => sum + val * val, 0);
    const rms = Math.sqrt(sumOfSquares / input.length);
    return Math.round(rms * 1000);
}
