import { useState } from "react"
import {
    FiCheckCircle,
    FiSearch,
    FiFolder,
    FiSliders,
    FiPackage,
} from "react-icons/fi"

import { useItems } from "../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../constants/itemStatus"
import AdminLayout from "../../layouts/AdminLayout"

function ActiveItems() {
    const { items, withdrawItem } = useItems()

    const [itemSelecionado, setItemSelecionado] = useState(null)
    const [retiradoPor, setRetiradoPor] = useState("")
    const [matricula, setMatricula] = useState("")
    const [observacaoRetirada, setObservacaoRetirada] =
        useState("")

    const [categoriaFiltro, setCategoriaFiltro] = useState("")
    const [ordenacao, setOrdenacao] = useState("mais-recentes")
    const [pesquisa, setPesquisa] = useState("")

    const todosItensAtivos = items.filter(
        (item) => item.status === ITEM_STATUS.ATIVO
    )

    const categoriasDisponiveis = [
        ...new Set(
            todosItensAtivos
                .map((item) => item.categoria)
                .filter(Boolean)
        ),
    ].sort((categoriaA, categoriaB) =>
        categoriaA.localeCompare(categoriaB, "pt-BR")
    )

    function converterData(data) {
        if (!data) {
            return new Date(0)
        }

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

    const itensAtivos = todosItensAtivos
        .filter((item) => {
            const termoPesquisa = pesquisa
                .trim()
                .toLowerCase()

            const correspondeCategoria =
                !categoriaFiltro ||
                item.categoria === categoriaFiltro

            const correspondePesquisa =
                !termoPesquisa ||
                item.nome
                    ?.toLowerCase()
                    .includes(termoPesquisa) ||
                item.codigo
                    ?.toLowerCase()
                    .includes(termoPesquisa)

            return correspondeCategoria && correspondePesquisa
        })
        .sort((itemA, itemB) => {
            const dataA = converterData(
                itemA.dataEncontrado || itemA.data
            )

            const dataB = converterData(
                itemB.dataEncontrado || itemB.data
            )

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

    function abrirModalRetirada(item) {
        setItemSelecionado(item)
        setRetiradoPor("")
        setMatricula("")
        setObservacaoRetirada("")
    }

    function fecharModalRetirada() {
        setItemSelecionado(null)
        setRetiradoPor("")
        setMatricula("")
        setObservacaoRetirada("")
    }

    function handleConfirmarRetirada(event) {
        event.preventDefault()

        if (!itemSelecionado) {
            return
        }

        if (!retiradoPor.trim() || !matricula.trim()) {
            return
        }

        withdrawItem(itemSelecionado.id, {
            retiradoPor: retiradoPor.trim(),
            matriculaRetirada: matricula.trim(),
            observacaoRetirada: observacaoRetirada.trim(),
        })

        fecharModalRetirada()
    }

    function limparFiltros() {
        setPesquisa("")
        setCategoriaFiltro("")
        setOrdenacao("mais-recentes")
    }

    function formatarData(data) {
        if (!data) {
            return "Data não informada"
        }

        if (data.includes("/")) {
            return data
        }

        if (data.includes("-")) {
            const dataSemHorario = data.split("T")[0]
            const [ano, mes, dia] = dataSemHorario.split("-")

            return `${dia}/${mes}/${ano}`
        }

        return data
    }

    return (
        <AdminLayout>
            <section className="admin-page">
                <div className="admin-page__header">
                    <div>
                        <h2>Itens Ativos</h2>

                        <p>
                            Visualize os objetos que ainda aguardam
                            retirada.
                        </p>
                    </div>

                    <span className="admin-page__count">
                        {todosItensAtivos.length}
                        {todosItensAtivos.length === 1
                            ? " item ativo"
                            : " itens ativos"}
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
                                placeholder="Nome ou código do item"
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
                                    setCategoriaFiltro(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Todas as categorias
                                </option>

                                {categoriasDisponiveis.map(
                                    (categoria) => (
                                        <option
                                            key={categoria}
                                            value={categoria}
                                        >
                                            {categoria}
                                        </option>
                                    )
                                )}
                            </select>
                        </label>

                        <label className="active-items__filter">
                            <span className="active-items__filter-label">
                                <FiSliders />
                                Ordenar por
                            </span>

                            <select
                                value={ordenacao}
                                onChange={(event) =>
                                    setOrdenacao(event.target.value)
                                }
                            >
                                <option value="mais-recentes">
                                    Mais recentes
                                </option>

                                <option value="mais-antigos">
                                    Mais antigos
                                </option>

                                <option value="nome-az">
                                    Nome de A a Z
                                </option>

                                <option value="nome-za">
                                    Nome de Z a A
                                </option>
                            </select>
                        </label>
                    </div>

                    <p className="active-items__results">
                        Exibindo{" "}
                        <strong>{itensAtivos.length}</strong> de{" "}
                        <strong>{todosItensAtivos.length}</strong>{" "}
                        {todosItensAtivos.length === 1
                            ? "item"
                            : "itens"}
                    </p>
                </div>

                {itensAtivos.length === 0 ? (
                    <div className="active-items__empty">
                        <span><FiPackage /></span>

                        <h3>
                            {todosItensAtivos.length === 0
                                ? "Nenhum item ativo"
                                : "Nenhum item encontrado"}
                        </h3>

                        <p>
                            {todosItensAtivos.length === 0
                                ? "Os novos objetos cadastrados aparecerão nesta página."
                                : "Não há itens ativos que correspondam aos filtros selecionados."}
                        </p>

                        {todosItensAtivos.length > 0 && (
                            <button
                                className="active-items__clear-filters"
                                type="button"
                                onClick={limparFiltros}
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="active-items__grid">
                        {itensAtivos.map((item) => (
                            <article
                                className="active-item-card"
                                key={item.id}
                            >
                                <div className="active-item-card__image">
                                    {item.foto || item.fotoUrl ? (
                                        <img
                                            src={
                                                item.foto ||
                                                item.fotoUrl
                                            }
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

                                        <span className="active-item-card__status">
                                            Ativo
                                        </span>
                                    </div>

                                    <h3>{item.nome}</h3>

                                    <p>
                                        <strong>Categoria:</strong>{" "}
                                        {item.categoria}
                                    </p>

                                    {item.subcategoria && (
                                        <p>
                                            <strong>
                                                Subcategoria:
                                            </strong>{" "}
                                            {item.subcategoria}
                                        </p>
                                    )}

                                    <p>
                                        <strong>
                                            Encontrado em:
                                        </strong>{" "}
                                        {formatarData(
                                            item.dataEncontrado ||
                                            item.data
                                        )}
                                    </p>

                                    {item.observacoes && (
                                        <p className="active-item-card__observations">
                                            {item.observacoes}
                                        </p>
                                    )}

                                    <button
                                        className="active-item-card__withdraw"
                                        type="button"
                                        onClick={() =>
                                            abrirModalRetirada(item)
                                        }
                                    >
                                        <FiCheckCircle />
                                        Confirmar retirada
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {itemSelecionado && (
                <div
                    className="withdraw-modal__overlay"
                    onMouseDown={fecharModalRetirada}
                >
                    <div
                        className="withdraw-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="withdraw-modal-title"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            className="withdraw-modal__close"
                            type="button"
                            aria-label="Fechar modal"
                            onClick={fecharModalRetirada}
                        >
                            ×
                        </button>

                        <div className="withdraw-modal__header">
                            <FiCheckCircle />

                            <div>
                                <h2 id="withdraw-modal-title">
                                    Confirmar retirada
                                </h2>

                                <p>
                                    Registre os dados de quem está
                                    retirando o objeto.
                                </p>
                            </div>
                        </div>

                        <div className="withdraw-modal__item">
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

                        <form
                            className="withdraw-modal__form"
                            onSubmit={handleConfirmarRetirada}
                        >
                            <label>
                                Nome de quem retirou

                                <input
                                    type="text"
                                    value={retiradoPor}
                                    onChange={(event) =>
                                        setRetiradoPor(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite o nome completo"
                                    required
                                    autoFocus
                                />
                            </label>

                            <label>
                                Matrícula

                                <input
                                    type="text"
                                    value={matricula}
                                    onChange={(event) =>
                                        setMatricula(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite a matrícula"
                                    required
                                />
                            </label>

                            <label>
                                Observações da retirada

                                <textarea
                                    value={observacaoRetirada}
                                    onChange={(event) =>
                                        setObservacaoRetirada(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Informações adicionais, se necessário"
                                    rows="4"
                                />
                            </label>

                            <div className="withdraw-modal__actions">
                                <button
                                    className="withdraw-modal__cancel"
                                    type="button"
                                    onClick={fecharModalRetirada}
                                >
                                    Cancelar
                                </button>

                                <button
                                    className="withdraw-modal__confirm"
                                    type="submit"
                                >
                                    Confirmar retirada
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default ActiveItems