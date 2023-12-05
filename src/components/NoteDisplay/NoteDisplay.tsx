import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import {Note} from "../../types";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {TUNINGS} from "../../constants";
import './NoteDisplay.scss';

const NoteDisplay: React.FC = () => {
    let [score, setScore] = useState(0);
    const [hasScored, setHasScored] = useState(false);
    const [currentNote, setCurrentNote] = useState<Note>({ name: 'Placeholder', octave: -1 });
    const [ignoreOctave, setIgnoreOctave] = useState(false);
    const [countdownState, setCountdownState] = useState(true);

    const isRunning = useAppSelector((state: RootState) => state.noteDetector.isRunning);
    const userPlayedNote = useAppSelector((state: RootState) => state.noteDetector.note);
    const maxFrets = useAppSelector((state: RootState) => state.fretboard.amountOfFrets);
    const tuningName = useAppSelector((state: RootState) => state.fretboard.tuningName);

    const scoreTimeout = useAppSelector((state: RootState) => state.game.scoreTimeout);
    const [countdown, setCountdown] = useState(scoreTimeout);


    const spawnNewNote = () => {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        const randomStringIndex = Math.floor(Math.random() * TUNINGS[tuningName].length);
        const note = TUNINGS[tuningName][randomStringIndex];

        const randomFret = Math.floor(Math.random() * (maxFrets + 1));

        let noteIndex = (notes.indexOf(note.name) + randomFret) % notes.length;
        let newOctave = note.octave + Math.floor((notes.indexOf(note.name) + randomFret) / notes.length);

        const newNote = { name: notes[noteIndex], octave: newOctave };

        setCurrentNote(newNote);
        setHasScored(false);
    };

    const compareNotes = () => {
        if (!hasScored && userPlayedNote.name === currentNote.name && (ignoreOctave || userPlayedNote.octave === currentNote.octave)) {
            setScore(score + 1);
            spawnNewNote();
            setHasScored(true);
            setCountdown(scoreTimeout);
        } else {
            setHasScored(false);
        }
    };

    const handleCountdownState = () => {
        setCountdownState(!countdownState);
        setCountdown(scoreTimeout);
        if (countdownState){
            setScore(0);
        }

    }

    useEffect(() => {
        spawnNewNote();
    }, []);

    useEffect(() => {
        compareNotes();
    }, [userPlayedNote]);

    useEffect(() => {
        if (isRunning && countdownState){
            let timer: NodeJS.Timer;
            if (countdown > 0) {
                console.log(countdown);
                timer = setInterval(() => setCountdown(countdown - 1), 1000);
            } else {
                setScore(0);
                setCountdown(scoreTimeout);
                spawnNewNote();
            }
            return () => clearInterval(timer);
        }
    }, [countdown, isRunning, countdownState]);

    return (
        <div className="container-fluid h-100 p-0 d-flex flex-column">
            <div className="row justify-content-center align-items-center h-100 m-0">
                <div className="col-auto p-0">
                    <div className="card game-container text-dark">
                        <div className="card-body">
                            <p className="card-title text-white">Toque a nota:</p>
                            <div className="bg-primary text-white fw-bold rounded text-center p-2 mb-3">{currentNote.name}{!ignoreOctave && currentNote.octave}</div>
                            <p className="card-subtitle mb-2 text-white">Pontos: {score}</p>
                            <div className="progress w-100 my-3" onClick={handleCountdownState}>
                                <div className="progress-bar text-center" role="progressbar" style={{ width: `${(countdown / scoreTimeout) * 100}%` }}>{countdownState ? countdown : ""}</div>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="ignoreOctave" checked={ignoreOctave} onChange={() => setIgnoreOctave(!ignoreOctave)} />
                                <label className="form-check-label text-white" htmlFor="ignoreOctave">Ignorar oitava    </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default NoteDisplay;

