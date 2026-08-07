import SubcategoryCard from "./SubcategoryCard"

import { useItems } from "../contexts/ItemsContext"
import { ITEM_STATUS } from "../constants/itemStatus"

function SubcategoryGrid(props) {
    const { items } = useItems()

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

                                const pertenceCategoria =
                                    item.categoria ===
                                    props.categoriaId

                                const pertenceSubcategoria =
                                    item.subcategoria ===
                                    subcategory.id

                                return (
                                    itemAtivo &&
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