import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './InfoModal.scss';

interface InfoModalProps {
    show: boolean;
    onHide: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ show, onHide }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="bg-dark">
                <Modal.Title id="contained-modal-title-vcenter">
                    Fret Finder
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark">
                <p>
                    Este site foi criado para ajudar guitarristas a localizar notas no braço da guitarra. Utilizando a entrada de áudio do seu microfone, o sistema reconhece a nota tocada e destaca todas as posições correspondentes na escala da guitarra.
                </p>
                <h5>Funcionalidades:</h5>
                <ul className="list-group">
                    <li className="list-group-item list-group-item-dark"><h6 className="fw-bold">Detecção de Nota</h6> Toca uma nota na guitarra e o site ilumina onde essa nota pode ser encontrada em cada corda.</li>
                    <li className="list-group-item list-group-item-dark"><h6 className="fw-bold">Mini-Game de Notas</h6> Exibe uma nota aleatória para você encontrar na sua guitarra. Se acertar, ganha um ponto e o contador é reiniciado. Se o tempo acabar, a pontuação retorna a zero. Clique no contador para pausa-lo.</li>
                    <li className="list-group-item list-group-item-dark"><h6 className="fw-bold">Opção 'Ignorar Oitava'</h6> No mini-game, ative esta opção para que o site considere qualquer oitava da nota tocada como correta, facilitando o acerto e a pontuação.</li>
                    <li className="list-group-item list-group-item-dark"><h6 className="fw-bold">Configurações de Usuário</h6> Permite ajustar o número de trastes e a afinação entre as opções pré-estabelecidas. Há também uma opção para adaptar a visualização para canhotos.</li>
                </ul>
            </Modal.Body>
            <Modal.Footer className="bg-dark">
                <p className="fst-italic">Desenvolvido por Vinicius Chaves, combinando paixão por música com inovação tecnológica para enriquecer a prática musical.</p>
            </Modal.Footer>
        </Modal>
    );
};

export default InfoModal;
