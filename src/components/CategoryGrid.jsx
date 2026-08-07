import CategoryCard from "./CategoryCard"

import { useItems } from "../contexts/ItemsContext"
import { ITEM_STATUS } from "../constants/itemStatus"

function CategoryGrid(props) {
    const { items } = useItems()

    return (
        <section className="category-section">
            <div className="category-grid">
                {props.categories.map((category) => {
                    const quantidadeItens = items.filter(
                        (item) => {
                            const itemAtivo =
                                !item.status ||
                                item.status ===
                                    ITEM_STATUS.ATIVO

                            const pertenceCategoria =
                                item.categoria ===
                                category.id

                            return (
                                itemAtivo &&
                                pertenceCategoria
                            )
                        }
                    ).length

                    return (
                        <CategoryCard
                            key={category.id}
                            nome={category.nome}
                            icone={category.icone}
                            quantidadeItens={
                                quantidadeItens
                            }
                            onClick={() =>
                                props.onSelectCategory(
                                    category
                                )
                            }
                        />
                    )
                })}
            </div>
        </section>
    )
}

export default CategoryGrid