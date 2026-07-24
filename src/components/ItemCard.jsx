function ItemCard(props) {
    function formatarData(data) {
        if (!data) return ""

        // Se já estiver no formato dd/mm/aaaa
        if (data.includes("/")) {
            return data
        }

        // Se estiver no formato aaaa-mm-dd
        if (data.includes("-")) {
            const [ano, mes, dia] = data.split("-")
            return `${dia}/${mes}/${ano}`
        }

        return data
    }

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
                    {formatarData(props.data)}
                </p>
            </div>
        </button>
    )
}

export default ItemCard