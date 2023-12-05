import React, {useState, useCallback, useRef} from 'react';
import { Card, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import {setIsRunning, setNote} from "../../slices/noteDetectorSlice";
import './NoteDetector.scss';
import {calculateVolume, getNoteFromPitch} from "./noteUtils";
import {useAudioAnalyzer} from "./useAudioAnalyzer";
import {Note} from "../../types";
import NoteDisplay from "../NoteDisplay/NoteDisplay";


const CLARITY_THRESHOLD = 95;
const MIN_PITCH = 80;
const VOLUME_THRESHOLD = 2.5;

const NoteDetector: React.FC = () => {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [pitch, setPitch] = useState<number | null>(null);
    const [clarity, setClarity] = useState<number | null>(null);
    const isRunning = useAppSelector((state: RootState) => state.noteDetector.isRunning);
    const note = useAppSelector((state: RootState) => state.noteDetector.note);
    const updateInterval = useAppSelector((state: RootState) => state.noteDetector.updateIntervalMs);
    const dispatch = useAppDispatch();

    function updateState(note: Note = { name: "", octave: 0 }, pitch: number | null = null, clarity: number | null = null){
        dispatch(setNote(note));
        setPitch(pitch);
        setClarity(clarity);
    }

    const controlAudioProcessing = useCallback(() => {
        if (!audioContext) {
            const newAudioContext = new window.AudioContext();
            setAudioContext(newAudioContext);
            dispatch(setIsRunning(true));
        } else if (audioContext.state === "suspended") {
            audioContext.resume();
            dispatch(setIsRunning(true));
        } else {
            audioContext.suspend();
            dispatch(setIsRunning(false));
        }
    }, [audioContext]);

    const updatePitch = useCallback((detector: any, input: Float32Array, sampleRate: number, analyserNode: AnalyserNode) => {
        const now = performance.now();
        if (!lastUpdateTime.current || now - lastUpdateTime.current >= updateInterval) {
            lastUpdateTime.current = now;

            analyserNode.getFloatTimeDomainData(input);
            const volume = calculateVolume(input);

            let pitch = null;
            let clarity = null;

            if(volume > VOLUME_THRESHOLD){
                const [detectedPitch, detectedClarity] = detector.findPitch(input, sampleRate);

                pitch = Math.round(detectedPitch * 10) / 10;
                clarity = Math.round(detectedClarity * 100);

                if (clarity >= CLARITY_THRESHOLD && pitch >= MIN_PITCH) {
                    const currentNote = getNoteFromPitch(detectedPitch);
                    updateState(currentNote, pitch, clarity);
                }
                else {
                    updateState()
                }
            } else {
                updateState()
            }
        }
        requestAnimationFrame(() => updatePitch(detector, input, sampleRate, analyserNode));
    }, [dispatch]);

    const lastUpdateTime = useRef<number | null>(null);

    useAudioAnalyzer(audioContext, updatePitch);

    return (
        <div className="note-detector d-flex flex-column justify-content-between bg-dark text-white justify-content-center align-items-center">
            <div className="top-block d-flex flex-column h-50 w-100 justify-content-center align-items-center">
                <NoteDisplay></NoteDisplay>
            </div>

            <div className="bottom-block d-flex flex-column justify-content-end h-40 w-100 p-3">
                <div className="text-nowrap mb-2">Nota: {note.octave !== 0 ? `${note.name}${note.octave}` : 'N/A'}</div>
                <div className="text-nowrap mb-3">Freq.: {pitch ? pitch.toFixed(2) : 'N/A'} Hz</div>
                <Button variant="danger" onClick={controlAudioProcessing} className="w-100">{!isRunning ? "Iniciar" : "Pausar"}</Button>
            </div>
        </div>
    );
}

export default NoteDetector;
