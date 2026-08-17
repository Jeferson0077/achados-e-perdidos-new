import SubcategoryCard from "./SubcategoryCard"

import { useItems } from "../contexts/ItemsContext"
import { ITEM_STATUS } from "../constants/itemStatus"

function SubcategoryGrid(props) {
    const { items } = useItems()
    function converterData(data) {
        if (!data) {
            return new Date(0)
        }

        if (data.includes("-")) {
            const [ano, mes, dia] =
                data.split("-")

            return new Date(
                Number(ano),
                Number(mes) - 1,
                Number(dia)
            )
        }

        if (data.includes("/")) {
            const [dia, mes, ano] =
                data.split("/")

            return new Date(
                Number(ano),
                Number(mes) - 1,
                Number(dia)
            )
        }

        return new Date(0)
    }

    return (
        <section className="subcategory-section">
            <div className="subcategory-grid">
                {props.subcategorias.map(
                    (subcategory) => {
                        const quantidadeItens =
                            items.filter((item) => {
                                const itemAtivo =
                                    !item.status ||
                                    item.status ===
                                    ITEM_STATUS.ATIVO

                                const dataEncontrado =
                                    item.dataEncontrado ||
                                    item.data

                                const dataDoItem =
                                    converterData(dataEncontrado)

                                const hoje =
                                    new Date()

                                dataDoItem.setHours(0, 0, 0, 0)
                                hoje.setHours(0, 0, 0, 0)

                                const dias =
                                    Math.floor(
                                        (hoje - dataDoItem) /
                                        (1000 * 60 * 60 * 24)
                                    )

                                const dentroDoPrazo =
                                    dias < 60

                                const pertenceCategoria =
                                    item.categoria ===
                                    props.categoriaId

                                const pertenceSubcategoria =
                                    item.subcategoria ===
                                    subcategory.id

                                return (
                                    itemAtivo &&
                                    dentroDoPrazo &&
                                    pertenceCategoria &&
                                    pertenceSubcategoria
                                )
                            }).length

                        return (
                            <SubcategoryCard
                                key={subcategory.id}
                                nome={subcategory.nome}
                                icone={subcategory.icone}
                                quantidadeItens={
                                    quantidadeItens
                                }
                                onClick={() =>
                                    props.onSelectSubcategory(
                                        subcategory
                                    )
                                }
                            />
                        )
                    }
                )}
            </div>
        </section>
    )
}

export default SubcategoryGrid