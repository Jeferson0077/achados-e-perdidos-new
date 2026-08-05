import SubcategoryCard from "./SubcategoryCard"
import { useItems } from "../contexts/ItemsContext"

function SubcategoryGrid(props) {
    const { items } = useItems()

    return (
        <section className="subcategory-section">
            <div className="subcategory-grid">
                {props.subcategorias.map(
                    (subcategory) => {
                        const quantidadeItens =
                            items.filter(
                                (item) =>
                                    item.categoria ===
                                    props.categoriaId &&
                                    item.subcategoria ===
                                    subcategory.id
                            ).length

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