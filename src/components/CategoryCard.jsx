function CategoryCard(props) {
    const textoQuantidade =
        props.quantidadeItens === 0
            ? 'Nenhum item'
            : props.quantidadeItens === 1
                ? '1 item'
                : `${props.quantidadeItens} itens`

    return (
        <button
            type="button"
            className="category-card"
            onClick={props.onClick}
        >
            <span className="category-card__icon">
                <img src={props.icone} alt="" />
            </span>

            <span className="category-card__content">
                <span className="category-card__name">
                    {props.nome}
                </span>

                <span className="category-card__count">
                    {textoQuantidade}
                </span>
            </span>
        </button>
    )
}

export default CategoryCard