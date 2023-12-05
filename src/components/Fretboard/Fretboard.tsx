import React, {useEffect, useRef, useState} from 'react';
import {RootState} from "../../app/store";
import { useAppSelector } from "../../app/hooks";
import './Fretboard.scss';
import {FretboardCanvas} from "./FretboardCanvas";
import FretboardConfigurator from "../configurators/FretboardConfigurator";
import { ReactComponent as GearIcon } from '../../assets/icons/gear-solid.svg';
import { ReactComponent as ExpandIcon } from '../../assets/icons/expand-solid.svg';
import { ReactComponent as InfoIcon } from '../../assets/icons/circle-info-solid.svg';
import NoteDetector from "../NoteDetector/NoteDetector";
import {Col, Container, Row} from "react-bootstrap";
import InfoModal from "../InfoModal/InfoModal";


const Fretboard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fretboardRef = useRef<FretboardCanvas | null>(null);

    const [showConfigurator, setShowConfigurator] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const hasVisited = Number(localStorage?.getItem('hasVisited') || 0);
    const [infoModalShow, setInfoModalShow] = useState(!hasVisited);

    const note = useAppSelector((state: RootState) => state.noteDetector.note);
    const frets = useAppSelector((state: RootState) => state.fretboard.amountOfFrets)
    const isLeftHanded = useAppSelector((state: RootState) => state.fretboard.isLeftHanded)
    const tuning = useAppSelector((state: RootState) => state.fretboard.tuningName);

    const toggleFullscreen = () => {
        const element = document.querySelector('.fretboard-container'); // Adjust the selector to target the fretboard specifically

        if (element && !document.fullscreenElement) {
            setIsFullscreen(true);
            element.requestFullscreen();
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleInfoModalShow = () => {
        if (!hasVisited) localStorage?.setItem('hasVisited', '1');
        setInfoModalShow(!infoModalShow);
    }

    useEffect(() => {
        const updateFretboard = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                const container = canvas.parentElement;
                if (context && container) {
                    canvas.width = container.offsetWidth;
                    canvas.height = container.offsetHeight;

                    if (!fretboardRef.current) {
                        fretboardRef.current = new FretboardCanvas(context, canvas.width, canvas.height, 6, frets, tuning);
                    } else {
                        fretboardRef.current.width = canvas.width;
                        fretboardRef.current.height = canvas.height;
                    }

                    const fretboard = fretboardRef.current;

                    fretboard.setConfiguration(frets, isLeftHanded, tuning);
                    fretboard.drawFretboard();
                    fretboard.highlightNotes(note);
                }
            }
        }

        updateFretboard();
        window.addEventListener('resize', updateFretboard)
        document.addEventListener('fullscreenchange', updateFretboard)


        return () => {
            window.removeEventListener('resize', updateFretboard);
            document.removeEventListener('fullscreenchange', updateFretboard);
        }
    }, [note, frets, isLeftHanded]);

    return (
        <Container fluid className="fretboard-container">
            <Row className="align-items-stretch justify-content-center">
                <Col xxl={1} xl={2} md={2} className={`d-flex flex-column p-0 ${isFullscreen ? 'fullscreen-col' : ''}`}>
                    <NoteDetector></NoteDetector>
                </Col>
                <Col xl={8} md={10} className={`p-0 ${isFullscreen ? 'fullscreen-col' : ''}`}>
                    <div className="canvas-container">
                        <canvas ref={canvasRef} className="fretboard-canvas"/>
                    </div>
                    <div className={`fretboard-configurator ${showConfigurator ? 'open' : ''}`}>
                        {<FretboardConfigurator />}
                    </div>
                </Col>
            </Row>
            <button onClick={toggleFullscreen} className="icon fullscreen-toggle">
                <ExpandIcon />
            </button>
            <button className="icon configurator-toggle" onClick={() => setShowConfigurator(!showConfigurator)}>
                <GearIcon />
            </button>
            <button className="icon info-toggle" onClick={handleInfoModalShow}>
                <InfoIcon/>
            </button>
            <InfoModal
                show={infoModalShow}
                onHide={handleInfoModalShow}
            />
        </Container>
    );


};

export default Fretboard;
