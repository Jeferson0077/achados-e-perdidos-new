import { useState } from "react"
import {
    FiSearch,
    FiFolder,
    FiSliders,
} from "react-icons/fi"

import { useItems } from "../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../constants/itemStatus"
import AdminLayout from "../../layouts/AdminLayout"

function Donations() {
    const { items, donateItem } = useItems()

    const [itemSelecionado, setItemSelecionado] =
        useState(null)

    const [destinoDoacao, setDestinoDoacao] =
        useState("")

    const [responsavelDoacao, setResponsavelDoacao] =
        useState("")

    const [observacaoDoacao, setObservacaoDoacao] =
        useState("")

    const [categoriaFiltro, setCategoriaFiltro] =
        useState("")

    const [ordenacao, setOrdenacao] =
        useState("mais-recentes")

    const [pesquisa, setPesquisa] =
        useState("")

    function calcularDias(data) {
        if (!data) return 0

        let dataItem

        if (data.includes("/")) {
            const [dia, mes, ano] = data.split("/")

            dataItem = new Date(
                Number(ano),
                Number(mes) - 1,
                Number(dia)
            )
        } else {
            dataItem = new Date(data)
        }

        const hoje = new Date()

        dataItem.setHours(0, 0, 0, 0)
        hoje.setHours(0, 0, 0, 0)

        return Math.floor(
            (hoje - dataItem) /
            (1000 * 60 * 60 * 24)
        )
    }

    const todosItensParaDoacao = items.filter(
        (item) => {
            const dias = calcularDias(
                item.dataEncontrado || item.data
            )

            return (
                item.status === ITEM_STATUS.ATIVO &&
                dias >= 60
            )
        }
    )

    const categoriasDisponiveis = [
        ...new Set(
            todosItensParaDoacao
                .map((item) => item.categoria)
                .filter(Boolean)
        ),
    ].sort((categoriaA, categoriaB) =>
        categoriaA.localeCompare(
            categoriaB,
            "pt-BR"
        )
    )

    const itensParaDoacao =
        todosItensParaDoacao
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
                        .includes(termoPesquisa)

                const correspondeCategoria =
                    !categoriaFiltro ||
                    item.categoria ===
                    categoriaFiltro

                return (
                    correspondePesquisa &&
                    correspondeCategoria
                )
            })
            .sort((itemA, itemB) => {
                const diasA = calcularDias(
                    itemA.dataEncontrado ||
                    itemA.data
                )

                const diasB = calcularDias(
                    itemB.dataEncontrado ||
                    itemB.data
                )

                if (
                    ordenacao ===
                    "mais-antigos"
                ) {
                    return diasB - diasA
                }

                if (ordenacao === "nome-az") {
                    return (
                        itemA.nome || ""
                    ).localeCompare(
                        itemB.nome || "",
                        "pt-BR"
                    )
                }

                if (ordenacao === "nome-za") {
                    return (
                        itemB.nome || ""
                    ).localeCompare(
                        itemA.nome || "",
                        "pt-BR"
                    )
                }

                return diasA - diasB
            })

    function abrirModalDoacao(item) {
        setItemSelecionado(item)
        setDestinoDoacao("")
        setResponsavelDoacao("")
        setObservacaoDoacao("")
    }

    function fecharModalDoacao() {
        setItemSelecionado(null)
        setDestinoDoacao("")
        setResponsavelDoacao("")
        setObservacaoDoacao("")
    }

    function handleConfirmarDoacao(event) {
        event.preventDefault()

        if (!itemSelecionado) return

        if (
            !destinoDoacao.trim() ||
            !responsavelDoacao.trim()
        ) {
            return
        }

        donateItem(itemSelecionado.id, {
            destinoDoacao:
                destinoDoacao.trim(),

            responsavelDoacao:
                responsavelDoacao.trim(),

            observacaoDoacao:
                observacaoDoacao.trim(),
        })

        fecharModalDoacao()
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

        const dataSemHorario =
            data.split("T")[0]

        const [ano, mes, dia] =
            dataSemHorario.split("-")

        return `${dia}/${mes}/${ano}`
    }

    return (
        <AdminLayout>
            <section className="admin-page">
                <div className="admin-page__header">
                    <div>
                        <h2>
                            Itens para Doação
                        </h2>

                        <p>
                            Objetos ativos há 60
                            dias ou mais.
                        </p>
                    </div>

                    <span className="admin-page__count">
                        {
                            todosItensParaDoacao.length
                        }

                        {todosItensParaDoacao.length ===
                            1
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
                                    setPesquisa(
                                        event.target
                                            .value
                                    )
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
                                value={
                                    categoriaFiltro
                                }
                                onChange={(event) =>
                                    setCategoriaFiltro(
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="">
                                    Todas as
                                    categorias
                                </option>

                                {categoriasDisponiveis.map(
                                    (categoria) => (
                                        <option
                                            key={
                                                categoria
                                            }
                                            value={
                                                categoria
                                            }
                                        >
                                            {
                                                categoria
                                            }
                                        </option>
                                    )
                                )}
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
                                    setOrdenacao(
                                        event.target
                                            .value
                                    )
                                }
                            >
                                <option value="mais-recentes">
                                    Mais próximos da
                                    doação
                                </option>

                                <option value="mais-antigos">
                                    Mais antigos
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
                        Exibindo{" "}
                        <strong>
                            {
                                itensParaDoacao.length
                            }
                        </strong>{" "}
                        de{" "}
                        <strong>
                            {
                                todosItensParaDoacao.length
                            }
                        </strong>{" "}
                        {todosItensParaDoacao.length ===
                            1
                            ? "item"
                            : "itens"}
                    </p>
                </div>

                {itensParaDoacao.length ===
                    0 ? (
                    <div className="active-items__empty">
                        <FiCheckCircle />

                        <h3>
                            {todosItensParaDoacao.length ===
                                0
                                ? "Nenhum item para doação"
                                : "Nenhum item encontrado"}
                        </h3>

                        <p>
                            {todosItensParaDoacao.length ===
                                0
                                ? "Todos os objetos ainda estão dentro do prazo."
                                : "Nenhum item corresponde aos filtros selecionados."}
                        </p>

                        {todosItensParaDoacao.length >
                            0 && (
                                <button
                                    className="active-items__clear-filters"
                                    type="button"
                                    onClick={
                                        limparFiltros
                                    }
                                >
                                    Limpar filtros
                                </button>
                            )}
                    </div>
                ) : (
                    <div className="active-items__grid">
                        {itensParaDoacao.map(
                            (item) => (
                                <article
                                    key={item.id}
                                    className="active-item-card"
                                >
                                    <div className="active-item-card__image">
                                        {item.foto ||
                                            item.fotoUrl ? (
                                            <img
                                                src={
                                                    item.foto ||
                                                    item.fotoUrl
                                                }
                                                alt={
                                                    item.nome
                                                }
                                            />
                                        ) : (
                                            <span>
                                                📷
                                            </span>
                                        )}
                                    </div>

                                    <div className="active-item-card__content">
                                        <div className="active-item-card__top">
                                            <span className="active-item-card__code">
                                                {
                                                    item.codigo
                                                }
                                            </span>

                                            <span className="active-item-card__status">
                                                {calcularDias(
                                                    item.dataEncontrado ||
                                                    item.data
                                                )}{" "}
                                                dias
                                            </span>
                                        </div>

                                        <h3>
                                            {
                                                item.nome
                                            }
                                        </h3>

                                        <p>
                                            <strong>
                                                Categoria:
                                            </strong>{" "}
                                            {
                                                item.categoria
                                            }
                                        </p>

                                        {item.subcategoria && (
                                            <p>
                                                <strong>
                                                    Subcategoria:
                                                </strong>{" "}
                                                {
                                                    item.subcategoria
                                                }
                                            </p>
                                        )}

                                        <p>
                                            <strong>
                                                Encontrado
                                                em:
                                            </strong>{" "}
                                            {formatarData(
                                                item.dataEncontrado ||
                                                item.data
                                            )}
                                        </p>

                                        {item.observacoes && (
                                            <p className="active-item-card__observations">
                                                {
                                                    item.observacoes
                                                }
                                            </p>
                                        )}

                                        <button
                                            className="donation-card__button"
                                            type="button"
                                            onClick={() =>
                                                abrirModalDoacao(
                                                    item
                                                )
                                            }
                                        >
                                            Confirmar
                                            doação
                                        </button>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                )}
            </section>

            {itemSelecionado && (
                <div
                    className="donation-modal__overlay"
                    onMouseDown={
                        fecharModalDoacao
                    }
                >
                    <div
                        className="donation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="donation-modal-title"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            className="donation-modal__close"
                            type="button"
                            aria-label="Fechar modal"
                            onClick={
                                fecharModalDoacao
                            }
                        >
                            ×
                        </button>

                        <div className="donation-modal__header">
                            <span>🎁</span>

                            <div>
                                <h2 id="donation-modal-title">
                                    Confirmar doação
                                </h2>

                                <p>
                                    Registre as
                                    informações do destino
                                    do objeto.
                                </p>
                            </div>
                        </div>

                        <div className="donation-modal__item">
                            <div>
                                <span>Item</span>

                                <strong>
                                    {
                                        itemSelecionado.nome
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Código</span>

                                <strong>
                                    {
                                        itemSelecionado.codigo
                                    }
                                </strong>
                            </div>
                        </div>

                        <form
                            className="donation-modal__form"
                            onSubmit={
                                handleConfirmarDoacao
                            }
                        >
                            <label>
                                Destino da doação

                                <select
                                    value={
                                        destinoDoacao
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setDestinoDoacao(
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                    autoFocus
                                >
                                    <option value="">
                                        Selecione o
                                        destino
                                    </option>

                                    <option value="ONG">
                                        ONG
                                    </option>

                                    <option value="Projeto social">
                                        Projeto social
                                    </option>

                                    <option value="Instituição beneficente">
                                        Instituição
                                        beneficente
                                    </option>

                                    <option value="Descarte">
                                        Descarte
                                    </option>

                                    <option value="Outro">
                                        Outro
                                    </option>
                                </select>
                            </label>

                            <label>
                                Responsável pela
                                doação

                                <input
                                    type="text"
                                    value={
                                        responsavelDoacao
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setResponsavelDoacao(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Digite o nome do responsável"
                                    required
                                />
                            </label>

                            <label>
                                Observações

                                <textarea
                                    value={
                                        observacaoDoacao
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setObservacaoDoacao(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Informe o local, instituição ou detalhes adicionais"
                                    rows="4"
                                />
                            </label>

                            <div className="donation-modal__actions">
                                <button
                                    className="donation-modal__cancel"
                                    type="button"
                                    onClick={
                                        fecharModalDoacao
                                    }
                                >
                                    Cancelar
                                </button>

                                <button
                                    className="donation-modal__confirm"
                                    type="submit"
                                >
                                    Confirmar doação
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default Donations