function SubcategoryCard(props) {
    const textoQuantidade =
        props.quantidadeItens === 0
            ? 'Nenhum item'
            : props.quantidadeItens === 1
                ? '1 item'
                : `${props.quantidadeItens} itens`

    return (
        <button
            type="button"
            className="subcategory-card"
            onClick={props.onClick}
        >
            <span className="subcategory-card__icon">
                <img
                    src={props.icone}
                    alt=""
                />
            </span>

            <span className="subcategory-card__content">
                <span className="subcategory-card__name">
                    {props.nome}
                </span>

                <span className="subcategory-card__count">
                    {textoQuantidade}
                </span>
            </span>
        </button>
    )
}

export default SubcategoryCard