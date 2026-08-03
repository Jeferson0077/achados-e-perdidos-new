import { useState } from "react"
import {
    FiSearch,
    FiFolder,
    FiSliders,
} from "react-icons/fi"

import { useItems } from "../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../constants/itemStatus"
import AdminLayout from "../../layouts/AdminLayout"


function WithdrawnItems() {
    const { items } = useItems()
    const [itemSelecionado, setItemSelecionado] = useState(null)
    const [categoriaFiltro, setCategoriaFiltro] = useState("")
    const [ordenacao, setOrdenacao] = useState("mais-recentes")
    const [pesquisa, setPesquisa] = useState("")

    const todosItensRetirados = items.filter(
        (item) => item.status === ITEM_STATUS.RETIRADO
    )

    const categoriasDisponiveis = [
        ...new Set(
            todosItensRetirados
                .map((item) => item.categoria)
                .filter(Boolean)
        ),
    ].sort((a, b) =>
        a.localeCompare(b, "pt-BR")
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

    const itensRetirados = todosItensRetirados
        .filter((item) => {
            const termo = pesquisa
                .trim()
                .toLowerCase()

            const correspondePesquisa =
                !termo ||
                item.nome
                    ?.toLowerCase()
                    .includes(termo) ||
                item.codigo
                    ?.toLowerCase()
                    .includes(termo) ||
                item.retiradoPor
                    ?.toLowerCase()
                    .includes(termo) ||
                item.matriculaRetirada
                    ?.toLowerCase()
                    .includes(termo)

            const correspondeCategoria =
                !categoriaFiltro ||
                item.categoria === categoriaFiltro

            return (
                correspondePesquisa &&
                correspondeCategoria
            )
        })
        .sort((a, b) => {
            const dataA = converterData(a.dataRetirada)
            const dataB = converterData(b.dataRetirada)

            if (ordenacao === "mais-antigos") {
                return dataA - dataB
            }

            if (ordenacao === "nome-az") {
                return a.nome.localeCompare(
                    b.nome,
                    "pt-BR"
                )
            }

            if (ordenacao === "nome-za") {
                return b.nome.localeCompare(
                    a.nome,
                    "pt-BR"
                )
            }

            return dataB - dataA
        })

    function abrirModal(item) {
        setItemSelecionado(item)
    }

    function fecharModal() {
        setItemSelecionado(null)
    }

    function formatarData(data) {
        if (!data) return "Data não informada"

        if (data.includes("/")) {
            return data
        }

        const date = new Date(data)

        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("pt-BR")
        }

        return data
    }

    return (
        <AdminLayout>
            <section className="admin-page">
                <div className="admin-page__header">
                    <div>
                        <h2>Itens Retirados</h2>

                        <p>
                            Consulte os objetos que já foram devolvidos.
                        </p>
                    </div>

                    <span className="admin-page__count">
                        {todosItensRetirados.length}
                        {itensRetirados.length === 1
                            ? " item retirado"
                            : " itens retirados"}
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
                                placeholder="Nome, código, responsável ou matrícula"
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
                                    Nome A-Z
                                </option>

                                <option value="nome-za">
                                    Nome Z-A
                                </option>
                            </select>
                        </label>

                    </div>

                    <p className="active-items__results">
                        Exibindo <strong>{itensRetirados.length}</strong> de{" "}
                        <strong>{todosItensRetirados.length}</strong>{" "}
                        {todosItensRetirados.length === 1
                            ? "item"
                            : "itens"}
                    </p>
                </div>

                {itensRetirados.length === 0 ? (
                    <div className="active-items__empty">
                        <span>📦</span>

                        <h3>Nenhum item retirado</h3>

                        <h3>
                            {todosItensRetirados.length === 0
                                ? "Nenhum item retirado"
                                : "Nenhum item encontrado"}
                        </h3>

                        <p>
                            {todosItensRetirados.length === 0
                                ? "Os objetos devolvidos aparecerão nesta página."
                                : "Nenhum item corresponde aos filtros selecionados."}
                        </p>

                        {todosItensRetirados.length > 0 && (
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
                        {itensRetirados.map((item) => (
                            <article
                                className="active-item-card withdrawn-item-card"
                                key={item.id}
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

                                        <span className="active-item-card__status">
                                            Retirado
                                        </span>
                                    </div>

                                    <h3>{item.nome}</h3>

                                    <p>
                                        <strong>Categoria:</strong>{" "}
                                        {item.categoria}
                                    </p>

                                    {item.subcategoria && (
                                        <p>
                                            <strong>Subcategoria:</strong>{" "}
                                            {item.subcategoria}
                                        </p>
                                    )}

                                    <p>
                                        <strong>Encontrado em:</strong>{" "}
                                        {formatarData(
                                            item.dataEncontrado || item.data
                                        )}
                                    </p>

                                    <p>
                                        <strong>Retirado em:</strong>{" "}
                                        {formatarData(item.dataRetirada)}
                                    </p>

                                    <p>
                                        <strong>Matrícula:</strong>{" "}
                                        {item.matriculaRetirada || "Não informada"}
                                    </p>

                                    <button
                                        className="withdrawn-item-card__details"
                                        type="button"
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
                        aria-labelledby="withdraw-details-title"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            className="withdraw-details__close"
                            type="button"
                            aria-label="Fechar modal"
                            onClick={fecharModal}
                        >
                            ×
                        </button>

                        <div className="withdraw-details__header">
                            <span>✅</span>

                            <div>
                                <h2 id="withdraw-details-title">
                                    Detalhes da retirada
                                </h2>

                                <p>
                                    Informações registradas na devolução
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

                        <div className="withdraw-details__item">
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
                                    {itemSelecionado.categoria}
                                </strong>
                            </div>

                            {itemSelecionado.subcategoria && (
                                <div>
                                    <span>Subcategoria</span>
                                    <strong>
                                        {itemSelecionado.subcategoria}
                                    </strong>
                                </div>
                            )}

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
                                <span>Retirado em</span>
                                <strong>
                                    {formatarData(
                                        itemSelecionado.dataRetirada
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Retirado por</span>
                                <strong>
                                    {itemSelecionado.retiradoPor ||
                                        "Não informado"}
                                </strong>
                            </div>

                            <div>
                                <span>Matrícula</span>
                                <strong>
                                    {itemSelecionado.matriculaRetirada ||
                                        "Não informada"}
                                </strong>
                            </div>
                        </div>

                        {itemSelecionado.observacoes && (
                            <div className="withdraw-details__observation">
                                <span>Observações do item</span>

                                <p>
                                    {itemSelecionado.observacoes}
                                </p>
                            </div>
                        )}

                        {itemSelecionado.observacaoRetirada && (
                            <div className="withdraw-details__observation">
                                <span>Observações da retirada</span>

                                <p>
                                    {
                                        itemSelecionado.observacaoRetirada
                                    }
                                </p>
                            </div>
                        )}

                        <button
                            className="withdraw-details__finish"
                            type="button"
                            onClick={fecharModal}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default WithdrawnItems