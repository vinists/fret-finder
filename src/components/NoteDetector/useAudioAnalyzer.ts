import { useEffect } from 'react';
import {PitchDetector} from "pitchy";

export const useAudioAnalyzer = (audioContext: AudioContext | null, updatePitch: Function) => {
    useEffect(() => {
        if (!audioContext) return;

        let mediaStream: MediaStream | null = null;
        let source: MediaStreamAudioSourceNode | null = null;

        const stopMediaTracks = (stream: MediaStream) => {
            stream.getTracks().forEach(track => track.stop());
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                audioContext.suspend();
                if (mediaStream) stopMediaTracks(mediaStream);
            } else if (document.visibilityState === 'visible') {
                audioContext.resume();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        const constraints = {
            audio: {
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: false,
                channelCount: 1
            }
        };

        const analyserNode = audioContext.createAnalyser();

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            mediaStream = stream;
            source = audioContext.createMediaStreamSource(stream);
            source.connect(analyserNode);
            //source.connect(audioContext.destination);

            const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
            const input = new Float32Array(detector.inputLength);

            updatePitch(detector, input, audioContext.sampleRate, analyserNode);
        }).catch(error => {
            console.error('Error accessing media devices.', error);
        });

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (mediaStream) stopMediaTracks(mediaStream);
        };
    }, [audioContext, updatePitch]);
};
