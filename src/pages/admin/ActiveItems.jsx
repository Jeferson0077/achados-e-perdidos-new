import { useState } from "react"
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

    const itensAtivos = items.filter(
        (item) => item.status === ITEM_STATUS.ATIVO
    )

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

        if (!itemSelecionado) return

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

    function formatarData(data) {
        if (!data) return "Data não informada"

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
                        {itensAtivos.length}
                        {itensAtivos.length === 1
                            ? " item ativo"
                            : " itens ativos"}
                    </span>
                </div>

                {itensAtivos.length === 0 ? (
                    <div className="active-items__empty">
                        <span>📦</span>

                        <h3>Nenhum item ativo</h3>

                        <p>
                            Os novos objetos cadastrados aparecerão
                            nesta página.
                        </p>
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
                            <span>📦</span>

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