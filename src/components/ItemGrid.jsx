import { useState } from 'react'
import { items } from '../data/items'
import ItemCard from './ItemCard'
import ItemModal from './ItemModal'

function ItemGrid(props) {
    const [itemSelecionado, setItemSelecionado] = useState(null)

    const itensFiltrados = items
        .filter((item) => {
            if (props.subcategoria) {
                return (
                    item.categoria === props.categoria.id &&
                    item.subcategoria === props.subcategoria.id
                )
            }

            return item.categoria === props.categoria.id
        })
        .sort((itemA, itemB) => {
            const [diaA, mesA, anoA] = itemA.data.split('/')
            const [diaB, mesB, anoB] = itemB.data.split('/')

            const dataA = new Date(anoA, mesA - 1, diaA)
            const dataB = new Date(anoB, mesB - 1, diaB)

            return dataA - dataB
        })

    const textoQuantidade =
        itensFiltrados.length === 0
            ? 'Nenhum item encontrado'
            : itensFiltrados.length === 1
                ? '1 item encontrado'
                : `${itensFiltrados.length} itens encontrados`

    return (
        <>
            <section className="item-section">
                <h3 className="item-grid__title">
                    {textoQuantidade}
                </h3>

                {itensFiltrados.length === 0 ? (
                    <div className="item-grid__empty">
                        <span>Sem itens cadastrados</span>
                        <p>Não há objetos cadastrados nesta categoria.</p>
                    </div>
                ) : (
                    <div className="item-grid">
                        {itensFiltrados.map((item) => (
                            <ItemCard
                                key={item.id}
                                foto={item.foto}
                                data={item.data}
                                codigo={item.codigo}
                                onClick={() => setItemSelecionado(item)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <ItemModal
                item={itemSelecionado}
                onClose={() => setItemSelecionado(null)}
            />
        </>
    )
}

export default ItemGrid