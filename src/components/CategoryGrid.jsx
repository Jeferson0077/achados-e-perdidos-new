import CategoryCard from './CategoryCard'
import { items } from '../data/items'

function CategoryGrid(props) {
    return (
        <section className="category-section">
            <div className="category-grid">
                {props.categories.map((category) => {
                    const quantidadeItens = items.filter(
                        (item) => item.categoria === category.id
                    ).length

                    return (
                        <CategoryCard
                            key={category.id}
                            nome={category.nome}
                            icone={category.icone}
                            quantidadeItens={quantidadeItens}
                            onClick={() => props.onSelectCategory(category)}
                        />
                    )
                })}
            </div>
        </section>
    )
}

export default CategoryGrid