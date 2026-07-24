import { useState } from "react"
import { useItems } from "../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../constants/itemStatus"
import AdminLayout from "../../layouts/AdminLayout"

function Donations() {
    const { items, donateItem } = useItems()

    const [itemSelecionado, setItemSelecionado] = useState(null)
    const [destinoDoacao, setDestinoDoacao] = useState("")
    const [responsavelDoacao, setResponsavelDoacao] = useState("")
    const [observacaoDoacao, setObservacaoDoacao] = useState("")

    function calcularDias(data) {
        if (!data) return 0

        let dataItem

        if (data.includes("/")) {
            const [dia, mes, ano] = data.split("/")
            dataItem = new Date(ano, mes - 1, dia)
        } else {
            dataItem = new Date(data)
        }

        const hoje = new Date()

        dataItem.setHours(0, 0, 0, 0)
        hoje.setHours(0, 0, 0, 0)

        return Math.floor(
            (hoje - dataItem) / (1000 * 60 * 60 * 24)
        )
    }

    const itensParaDoacao = items.filter((item) => {
        const dias = calcularDias(
            item.dataEncontrado || item.data
        )

        return (
            item.status === ITEM_STATUS.ATIVO &&
            dias >= 60
        )
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
            destinoDoacao: destinoDoacao.trim(),
            responsavelDoacao: responsavelDoacao.trim(),
            observacaoDoacao: observacaoDoacao.trim(),
        })

        fecharModalDoacao()
    }

    function formatarData(data) {
        if (!data) return "Data não informada"

        if (data.includes("/")) {
            return data
        }

        const dataSemHorario = data.split("T")[0]
        const [ano, mes, dia] = dataSemHorario.split("-")

        return `${dia}/${mes}/${ano}`
    }

    return (
        <AdminLayout>
            <section className="admin-page">
                <div className="admin-page__header">
                    <div>
                        <h2>Itens para Doação</h2>

                        <p>
                            Objetos ativos há 60 dias ou mais.
                        </p>
                    </div>

                    <span className="admin-page__count">
                        {itensParaDoacao.length}
                        {itensParaDoacao.length === 1
                            ? " item"
                            : " itens"}
                    </span>
                </div>

                {itensParaDoacao.length === 0 ? (
                    <div className="active-items__empty">
                        <span>🎁</span>

                        <h3>Nenhum item para doação</h3>

                        <p>
                            Todos os objetos ainda estão dentro do prazo.
                        </p>
                    </div>
                ) : (
                    <div className="active-items__grid">
                        {itensParaDoacao.map((item) => (
                            <article
                                key={item.id}
                                className="active-item-card"
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
                                            {calcularDias(
                                                item.dataEncontrado ||
                                                item.data
                                            )}{" "}
                                            dias
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

                                    <button
                                        className="donation-card__button"
                                        type="button"
                                        onClick={() =>
                                            abrirModalDoacao(item)
                                        }
                                    >
                                        Confirmar doação
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {itemSelecionado && (
                <div
                    className="donation-modal__overlay"
                    onMouseDown={fecharModalDoacao}
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
                            onClick={fecharModalDoacao}
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
                                    Registre as informações do destino
                                    do objeto.
                                </p>
                            </div>
                        </div>

                        <div className="donation-modal__item">
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
                            className="donation-modal__form"
                            onSubmit={handleConfirmarDoacao}
                        >
                            <label>
                                Destino da doação
                                <select
                                    value={destinoDoacao}
                                    onChange={(event) =>
                                        setDestinoDoacao(
                                            event.target.value
                                        )
                                    }
                                    required
                                    autoFocus
                                >
                                    <option value="">
                                        Selecione o destino
                                    </option>

                                    <option value="ONG">
                                        ONG
                                    </option>

                                    <option value="Projeto social">
                                        Projeto social
                                    </option>

                                    <option value="Instituição beneficente">
                                        Instituição beneficente
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
                                Responsável pela doação
                                <input
                                    type="text"
                                    value={responsavelDoacao}
                                    onChange={(event) =>
                                        setResponsavelDoacao(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite o nome do responsável"
                                    required
                                />
                            </label>

                            <label>
                                Observações
                                <textarea
                                    value={observacaoDoacao}
                                    onChange={(event) =>
                                        setObservacaoDoacao(
                                            event.target.value
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
                                    onClick={fecharModalDoacao}
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