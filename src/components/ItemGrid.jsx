import { useState } from "react"

import { useItems } from "../contexts/ItemsContext"
import { ITEM_STATUS } from "../constants/itemStatus"

import ItemCard from "./ItemCard"
import ItemModal from "./ItemModal"

function ItemGrid(props) {
    const { items } = useItems()

    const [itemSelecionado, setItemSelecionado] =
        useState(null)

    function converterData(data) {
        if (!data) {
            return new Date(0)
        }

        // Formato atual do banco: aaaa-mm-dd
        if (data.includes("-")) {
            const [ano, mes, dia] = data.split("-")

            return new Date(
                Number(ano),
                Number(mes) - 1,
                Number(dia)
            )
        }

        // Compatibilidade com o formato antigo: dd/mm/aaaa
        if (data.includes("/")) {
            const [dia, mes, ano] = data.split("/")

            return new Date(
                Number(ano),
                Number(mes) - 1,
                Number(dia)
            )
        }

        return new Date(0)
    }

    const itensFiltrados = items
        .filter((item) => {
            const itemAtivo =
                !item.status ||
                item.status === ITEM_STATUS.ATIVO

            if (!itemAtivo) {
                return false
            }

            const pertenceCategoria =
                item.categoria === props.categoria.id

            if (props.subcategoria) {
                return (
                    pertenceCategoria &&
                    item.subcategoria ===
                    props.subcategoria.id
                )
            }

            return pertenceCategoria
        })
        .sort((itemA, itemB) => {
            const dataA = converterData(
                itemA.dataEncontrado || itemA.data
            )

            const dataB = converterData(
                itemB.dataEncontrado || itemB.data
            )

            // Mais antigos primeiro
            return dataA - dataB
        })

    const textoQuantidade =
        itensFiltrados.length === 0
            ? "Nenhum item encontrado"
            : itensFiltrados.length === 1
                ? "1 item encontrado"
                : `${itensFiltrados.length} itens encontrados`

    return (
        <>
            <section className="item-section">
                <h3 className="item-grid__title">
                    {textoQuantidade}
                </h3>

                {itensFiltrados.length === 0 ? (
                    <div className="item-grid__empty">
                        <span>
                            Sem itens cadastrados
                        </span>

                        <p>
                            Não há objetos cadastrados nesta
                            categoria.
                        </p>
                    </div>
                ) : (
                    <div className="item-grid">
                        {itensFiltrados.map((item) => (
                            <ItemCard
                                key={item.id}
                                foto={
                                    item.foto ||
                                    item.fotoUrl
                                }
                                nome={item.nome}
                                codigo={item.codigo}
                                data={
                                    item.dataEncontrado ||
                                    item.data
                                }
                                onClick={() =>
                                    setItemSelecionado(
                                        item
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </section>

            <ItemModal
                item={itemSelecionado}
                onClose={() =>
                    setItemSelecionado(null)
                }
            />
        </>
    )
}

export default ItemGrid