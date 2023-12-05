export interface Note {
    name: string;
    octave: number;
}

export interface Position {
    string: number;
    fret: number
}

export interface FretboardProps {
    numberOfFrets: number;
}

export interface FretProps {
    x: number;
    y: number;
    width: number;
    height: number;
    isActive: boolean;
}
