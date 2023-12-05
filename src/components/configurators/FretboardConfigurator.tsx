import React from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setAmountOfFrets, setLeftHanded, setTuningName} from "../../slices/fretboardSlice";
import {RootState} from "../../app/store";
import {setUpdateInterval} from "../../slices/noteDetectorSlice";
import {TUNINGS} from "../../constants";
import { Form } from "react-bootstrap";

const FretboardConfigurator: React.FC = () => {
    const dispatch = useAppDispatch();
    const frets = useAppSelector((state: RootState) => state.fretboard.amountOfFrets);
    const isLeftHanded = useAppSelector((state: RootState) => state.fretboard.isLeftHanded);
    const updateIntervalMs = useAppSelector((state: RootState) => state.noteDetector.updateIntervalMs);
    const tuningName = useAppSelector((state: RootState) => state.fretboard.tuningName);

    return (
        <div className="fretboard-content bg-dark p-4 m-5">
            <Form.Group controlId="fretsRange">
                <Form.Label>Trastes: {frets}</Form.Label>
                <Form.Range
                    min="12"
                    max="22"
                    value={frets}
                    onChange={(e) => dispatch(setAmountOfFrets(parseInt(e.target.value, 10)))}
                />
            </Form.Group>

            <Form.Group controlId="tuningSelect">
                <Form.Label>Afinação</Form.Label>
                <Form.Select
                    value={tuningName}
                    onChange={(e) => dispatch(setTuningName(e.target.value))}
                >
                    {Object.keys(TUNINGS).map(tuningKey => (
                        <option key={tuningKey} value={tuningKey}>
                            {tuningKey}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="leftHandedCheckbox" className="mb-3">
                <Form.Check
                    type="checkbox"
                    label="Canhoto"
                    checked={isLeftHanded}
                    onChange={(e) => dispatch(setLeftHanded(e.target.checked))}
                />
            </Form.Group>
        </div>
    )
}

export default FretboardConfigurator;
