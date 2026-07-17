function ItemCard(props) {
    return (
        <button
            className="item-card"
            onClick={props.onClick}
        >
            <div className="item-card__image">
                {props.foto ? (
                    <img src={props.foto} alt={props.nome} />
                ) : (
                    <span>📷</span>
                )}
            </div>

            <div className="item-card__info">
                <span className="item-card__code">
                    {props.codigo}
                </span>

                <p className="item-card__date">
                    {props.data}
                </p>
            </div>
        </button>
    )
}

export default ItemCard