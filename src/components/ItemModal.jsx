import {
    TransformWrapper,
    TransformComponent
} from 'react-zoom-pan-pinch'

function ItemModal(props) {
    if (!props.item) {
        return null
    }

    return (
        <div className="item-modal">
            <div className="item-modal__content">
                <div className="item-modal__header">
                    <h2>{props.item.nome}</h2>

                    <button
                        className="item-modal__close"
                        type="button"
                        onClick={props.onClose}
                    >
                        Fechar
                    </button>
                </div>

                <TransformWrapper
                    initialScale={1}
                    minScale={1}
                    maxScale={5}
                    centerOnInit
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            <div className="item-modal__controls">
                                <button type="button" onClick={() => zoomOut()}>
                                    −
                                </button>

                                <button type="button" onClick={() => resetTransform()}>
                                    Restaurar
                                </button>

                                <button type="button" onClick={() => zoomIn()}>
                                    +
                                </button>
                            </div>

                            <TransformComponent
                                wrapperClass="item-modal__zoom-wrapper"
                                contentClass="item-modal__zoom-content"
                            >
                                {props.item.foto ? (
                                    <img
                                        className="item-modal__photo"
                                        src={props.item.foto}
                                        alt={props.item.nome}
                                    />
                                ) : (
                                    <div className="item-modal__placeholder">

                                    </div>
                                )}
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>

                <div className="item-modal__details">
                    <p>
                        <strong>Data:</strong> {props.item.data}
                    </p>

                    <p>
                        <strong>Código:</strong> {props.item.codigo}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ItemModal