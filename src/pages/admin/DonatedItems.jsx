import { useState } from "react"
import {
    FiSearch,
    FiFolder,
    FiSliders,
} from "react-icons/fi"
import { useItems } from "../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../constants/itemStatus"
import AdminLayout from "../../layouts/AdminLayout"

function DonatedItems() {
    const { items } = useItems()
    const [itemSelecionado, setItemSelecionado] = useState(null)
    const [categoriaFiltro, setCategoriaFiltro] = useState("")
    const [ordenacao, setOrdenacao] = useState("mais-recentes")
    const [pesquisa, setPesquisa] = useState("")

    const todosItensDoados = items.filter(
        (item) => item.status === ITEM_STATUS.DOADO
    )

    const categoriasDisponiveis = [
        ...new Set(
            todosItensDoados
                .map((item) => item.categoria)
                .filter(Boolean)
        ),
    ].sort((categoriaA, categoriaB) =>
        categoriaA.localeCompare(categoriaB, "pt-BR")
    )

    function converterData(data) {
        if (!data) return new Date(0)

        if (data.includes("/")) {
            const [dia, mes, ano] = data.split("/")

            return new Date(
                Number(ano),
                Number(mes) - 1,
                Number(dia)
            )
        }

        return new Date(data)
    }

    const itensDoados = todosItensDoados
        .filter((item) => {
            const termoPesquisa = pesquisa
                .trim()
                .toLowerCase()

            const correspondePesquisa =
                !termoPesquisa ||
                item.nome
                    ?.toLowerCase()
                    .includes(termoPesquisa) ||
                item.codigo
                    ?.toLowerCase()
                    .includes(termoPesquisa) ||
                item.destinoDoacao
                    ?.toLowerCase()
                    .includes(termoPesquisa) ||
                item.responsavelDoacao
                    ?.toLowerCase()
                    .includes(termoPesquisa)

            const correspondeCategoria =
                !categoriaFiltro ||
                item.categoria === categoriaFiltro

            return correspondePesquisa && correspondeCategoria
        })
        .sort((itemA, itemB) => {
            const dataA = converterData(itemA.dataDoacao)
            const dataB = converterData(itemB.dataDoacao)

            if (ordenacao === "mais-antigos") {
                return dataA - dataB
            }

            if (ordenacao === "nome-az") {
                return (itemA.nome || "").localeCompare(
                    itemB.nome || "",
                    "pt-BR"
                )
            }

            if (ordenacao === "nome-za") {
                return (itemB.nome || "").localeCompare(
                    itemA.nome || "",
                    "pt-BR"
                )
            }

            return dataB - dataA
        })

    function formatarData(data) {
        if (!data) return "Não informado"

        if (data.includes("/")) return data

        const dataSemHorario = data.split("T")[0]
        const [ano, mes, dia] = dataSemHorario.split("-")

        return `${dia}/${mes}/${ano}`
    }

    function abrirModal(item) {
        setItemSelecionado(item)
    }

    function fecharModal() {
        setItemSelecionado(null)
    }

    return (
        <AdminLayout>
            <section className="admin-page">
                <div className="admin-page__header">
                    <div>
                        <h2>Itens Doados</h2>
                        <p>
                            Histórico dos objetos que já foram destinados
                            para doação ou descarte.
                        </p>
                    </div>

                    <span className="admin-page__count">
                        {todosItensDoados.length}
                        {todosItensDoados.length === 1
                            ? " item"
                            : " itens"}
                    </span>
                </div>

                <div className="active-items__toolbar">
                    <div className="active-items__filters">
                        <label className="active-items__filter active-items__filter--search">
                            <span className="active-items__filter-label">
                                <FiSearch />
                                Pesquisar
                            </span>

                            <input
                                type="search"
                                value={pesquisa}
                                onChange={(event) =>
                                    setPesquisa(event.target.value)
                                }
                                placeholder="Nome, código, destino ou responsável"
                            />
                        </label>

                        <label className="active-items__filter">
                            <span className="active-items__filter-label">
                                <FiFolder />
                                Categoria
                            </span>

                            <select
                                value={categoriaFiltro}
                                onChange={(event) =>
                                    setCategoriaFiltro(event.target.value)
                                }
                            >
                                <option value="">
                                    Todas as categorias
                                </option>

                                {categoriasDisponiveis.map((categoria) => (
                                    <option
                                        key={categoria}
                                        value={categoria}
                                    >
                                        {categoria}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="active-items__filter">
                            <span className="active-items__filter-label">
                                <FiSliders />
                                Ordenar
                            </span>

                            <select
                                value={ordenacao}
                                onChange={(event) =>
                                    setOrdenacao(event.target.value)
                                }
                            >
                                <option value="mais-recentes">
                                    Doações mais recentes
                                </option>

                                <option value="mais-antigos">
                                    Doações mais antigas
                                </option>

                                <option value="nome-az">
                                    Nome A-Z
                                </option>

                                <option value="nome-za">
                                    Nome Z-A
                                </option>
                            </select>
                        </label>
                    </div>

                    <p className="active-items__results">
                        Exibindo <strong>{itensDoados.length}</strong> de{" "}
                        <strong>{todosItensDoados.length}</strong>{" "}
                        {todosItensDoados.length === 1 ? "item" : "itens"}
                    </p>
                </div>

                {itensDoados.length === 0 ? (
                    <div className="active-items__empty">
                        <span>📦</span>

                        <h3>
                            {todosItensDoados.length === 0
                                ? "Nenhum item doado"
                                : "Nenhum item encontrado"}
                        </h3>

                        <p>
                            {todosItensDoados.length === 0
                                ? "Os itens doados aparecerão aqui."
                                : "Nenhum item corresponde aos filtros selecionados."}
                        </p>

                        {todosItensDoados.length > 0 && (
                            <button
                                className="active-items__clear-filters"
                                type="button"
                                onClick={() => {
                                    setPesquisa("")
                                    setCategoriaFiltro("")
                                    setOrdenacao("mais-recentes")
                                }}
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="active-items__grid">
                        {itensDoados.map((item) => (
                            <article
                                key={item.id}
                                className="active-item-card donated-item-card"
                                onClick={() => abrirModal(item)}
                            >
                                <div className="active-item-card__image">
                                    {item.foto || item.fotoUrl ? (
                                        <img
                                            src={item.foto || item.fotoUrl}
                                            alt={item.nome}
                                        />
                                    ) : (
                                        <span>📷</span>
                                    )}
                                </div>

                                <div className="active-item-card__content">
                                    <div className="active-item-card__top">
                                        <span className="active-item-card__code">
                                            {item.codigo}
                                        </span>

                                        <span className="donated-item-card__status">
                                            Doado
                                        </span>
                                    </div>

                                    <h3>{item.nome}</h3>

                                    <p>
                                        <strong>Destino:</strong>{" "}
                                        {item.destinoDoacao ||
                                            "Não informado"}
                                    </p>

                                    <p>
                                        <strong>Data:</strong>{" "}
                                        {formatarData(item.dataDoacao)}
                                    </p>

                                    <button
                                        type="button"
                                        className="withdrawn-item-card__details"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            abrirModal(item)
                                        }}
                                    >
                                        Ver detalhes
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {itemSelecionado && (
                <div
                    className="withdraw-details__overlay"
                    onMouseDown={fecharModal}
                >
                    <div
                        className="withdraw-details"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="donated-details-title"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            type="button"
                            className="withdraw-details__close"
                            aria-label="Fechar detalhes"
                            onClick={fecharModal}
                        >
                            ×
                        </button>

                        <div className="withdraw-details__header">
                            <span>📦</span>

                            <div>
                                <h2 id="donated-details-title">
                                    Detalhes da doação
                                </h2>

                                <p>
                                    Informações completas sobre o destino
                                    do objeto.
                                </p>
                            </div>
                        </div>

                        <div className="withdraw-details__image">
                            {itemSelecionado.foto ||
                                itemSelecionado.fotoUrl ? (
                                <img
                                    src={
                                        itemSelecionado.foto ||
                                        itemSelecionado.fotoUrl
                                    }
                                    alt={itemSelecionado.nome}
                                />
                            ) : (
                                <span>📷</span>
                            )}
                        </div>

                        <div className="withdraw-details__title">
                            <div>
                                <span>Item</span>
                                <strong>
                                    {itemSelecionado.nome}
                                </strong>
                            </div>

                            <div>
                                <span>Código</span>
                                <strong>
                                    {itemSelecionado.codigo}
                                </strong>
                            </div>
                        </div>

                        <div className="withdraw-details__grid">
                            <div>
                                <span>Categoria</span>
                                <strong>
                                    {itemSelecionado.categoria ||
                                        "Não informada"}
                                </strong>
                            </div>

                            <div>
                                <span>Subcategoria</span>
                                <strong>
                                    {itemSelecionado.subcategoria ||
                                        "Não informada"}
                                </strong>
                            </div>

                            <div>
                                <span>Encontrado em</span>
                                <strong>
                                    {formatarData(
                                        itemSelecionado.dataEncontrado ||
                                        itemSelecionado.data
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Doado em</span>
                                <strong>
                                    {formatarData(
                                        itemSelecionado.dataDoacao
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Destino</span>
                                <strong>
                                    {itemSelecionado.destinoDoacao ||
                                        "Não informado"}
                                </strong>
                            </div>

                            <div>
                                <span>Responsável</span>
                                <strong>
                                    {itemSelecionado.responsavelDoacao ||
                                        "Não informado"}
                                </strong>
                            </div>
                        </div>

                        <div className="withdraw-details__notes">
                            <div>
                                <span>
                                    Observações do cadastro
                                </span>

                                <p>
                                    {itemSelecionado.observacoes ||
                                        "Nenhuma observação informada."}
                                </p>
                            </div>

                            <div>
                                <span>
                                    Observações da doação
                                </span>

                                <p>
                                    {itemSelecionado.observacaoDoacao ||
                                        "Nenhuma observação informada."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default DonatedItems