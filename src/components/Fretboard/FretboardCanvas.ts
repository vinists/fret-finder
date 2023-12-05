import {Note, Position} from "../../types";
import {TUNINGS} from "../../constants";

export class FretboardCanvas {
    private readonly STRINGS_WIDTH: number[] = [2, 1.75, 1.5, 1.25, 1, .75];
    private readonly STRINGS_WIDTH_MULT = 3.25;


    canvas: CanvasRenderingContext2D;
    width: number;
    height: number
    strings: number;
    frets: number;
    isLeftHanded: boolean;
    tuningName: string;

    constructor(canvas: CanvasRenderingContext2D, width: number, height: number, strings: number, frets: number, tuningName: string = 'Standard', isLeftHanded: boolean = false) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.strings = strings;
        this.frets = frets;
        this.isLeftHanded = isLeftHanded;
        this.tuningName = tuningName;
    }

    drawFretboard(): void {
        this.clear();

        this.applyTransformations();
        this.canvas.fillStyle = '#9b643f';
        this.canvas.fillRect(0, 0, this.width, this.height);

        this.drawFrets();
        this.drawStrings();
        this.drawFretMarkers();
        this.resetTransformations();
    };

    highlightNotes(note: Note){
        if(note.octave !== 0) {
            const positions = this.noteToStringAndFret(note);
            positions.forEach(position => {
                this.drawHighlight(position.string, position.fret, note);
            })
        }
    }

    setConfiguration(newFrets: number, isLeftHanded: boolean, tuningName: string){
        this.frets = newFrets;
        this.isLeftHanded = isLeftHanded;
        this.tuningName = tuningName;
    }

    clear(): void {
        this.canvas.clearRect(0, 0, this.width, this.height);
    }

    private noteToStringAndFret(note: Note): Position[] {
        const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteIndex = chromaticScale.indexOf(note.name) + (note.octave * 12);
        const positions: Position[] = [];

        TUNINGS[this.tuningName].forEach((openStringNote, stringIndex) => {
            const openNoteIndex = chromaticScale.indexOf(openStringNote.name) + (openStringNote.octave * 12);
            for (let fret = 0; fret <= this.frets; fret++) {
                if (openNoteIndex + fret === noteIndex) {
                    positions.push({ string: stringIndex + 1, fret: fret });
                }
            }
        });

        return positions;
    };

    private drawHighlight(string: number, fret: number, note: Note): void {

        const fretWidth = this.width / this.frets;
        const stringHeight = this.height / this.strings;
        let x = fretWidth * fret - fretWidth / 2;
        const y = stringHeight * (string - 0.5);
        const radius = Math.min(fretWidth, stringHeight) / 4;
        const lineWidth = 4;

        if (this.isLeftHanded) {
            x = this.width - x;
        }


        if (fret === 0) {
            this.canvas.fillStyle = 'rgba(255, 215, 0, 0.5)';
            this.canvas.fillRect(0, y - (lineWidth / 2), this.width, lineWidth);
        }

        this.canvas.fillStyle = 'yellow';
        this.canvas.beginPath();
        this.canvas.arc(x, y, radius, 0, 2 * Math.PI);
        this.canvas.fill();

        this.canvas.fillStyle = 'black';
        this.canvas.font = `${radius}px Arial`;
        this.canvas.textAlign = 'center';
        this.canvas.textBaseline = 'middle';

        this.canvas.fillText(`${note.name}${note.octave}`, x, y);
    };

    private drawFrets(): void {
        for (let i = 0; i <= this.frets; i++) {
            const x = (this.width / this.frets) * i;
            this.canvas.beginPath();
            this.canvas.moveTo(x, 0);
            this.canvas.lineTo(x, this.height);
            this.canvas.strokeStyle = '#000';
            this.canvas.lineWidth = .7;
            this.canvas.stroke();
        }
    }

    private drawStrings(): void {
        for (let i = 0; i < this.STRINGS_WIDTH.length; i++) {
            const y = (this.height / this.STRINGS_WIDTH.length) * (i + 0.5);
            this.canvas.beginPath();
            this.canvas.moveTo(0, y);
            this.canvas.lineTo(this.width, y);
            this.canvas.strokeStyle = '#8a8a8a';
            this.canvas.lineWidth = this.STRINGS_WIDTH[i] * this.STRINGS_WIDTH_MULT;
            this.canvas.stroke();
        }
    }

    private drawFretMarkers(): void {
        const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21];
        const fretWidth = this.width / this.frets;
        const stringHeight = this.height / this.strings;
        const radius = 11;
        this.canvas.fillStyle = 'rgba(255, 255, 255, 0.8)';

        markerFrets.forEach(fret => {
            const x = fretWidth * fret - fretWidth / 2;
            if (fret === 12) {
                this.canvas.beginPath();
                this.canvas.arc(x, this.height / 2 - stringHeight, radius, 0, Math.PI * 2);
                this.canvas.fill();
                this.canvas.beginPath();
                this.canvas.arc(x, this.height / 2 + stringHeight, radius, 0, Math.PI * 2);
                this.canvas.fill();
            } else {
                this.canvas.beginPath();
                this.canvas.arc(x, this.height / 2, radius, 0, Math.PI * 2);
                this.canvas.fill();
            }
        });
    };

    private applyTransformations(): void {
        if (this.isLeftHanded) {
            this.canvas.save();
            this.canvas.scale(-1, 1);
            this.canvas.translate(-this.width, 0);
        }
    }

    private resetTransformations(): void {
        if (this.isLeftHanded) {
            this.canvas.restore();
        }
    }
}
