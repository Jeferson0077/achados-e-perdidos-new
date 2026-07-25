import { FiPackage } from "react-icons/fi"

import { useItems } from "../../contexts/ItemsContext"

function RecentItems() {
    const { items } = useItems()

    const recentItems = [...items]
        .filter((item) => item.dataEncontrado)
        .sort(
            (firstItem, secondItem) =>
                new Date(secondItem.dataEncontrado) -
                new Date(firstItem.dataEncontrado)
        )
        .slice(0, 5)

    function formatDate(date) {
        return new Intl.DateTimeFormat("pt-BR").format(
            new Date(date)
        )
    }

    return (
        <section className="dashboard-panel">
            <div className="dashboard-panel__header">
                <div>
                    <span className="dashboard-panel__eyebrow">
                        Movimentação recente
                    </span>

                    <h2 className="dashboard-panel__title">
                        Últimos cadastros
                    </h2>
                </div>

                <span className="dashboard-panel__icon">
                    <FiPackage />
                </span>
            </div>

            {recentItems.length > 0 ? (
                <div className="recent-items">
                    {recentItems.map((item) => (
                        <article
                            className="recent-item"
                            key={item.id}
                        >
                            <div className="recent-item__image">
                                {item.foto ? (
                                    <img
                                        src={item.foto}
                                        alt={item.nome}
                                    />
                                ) : (
                                    <FiPackage />
                                )}
                            </div>

                            <div className="recent-item__content">
                                <strong className="recent-item__name">
                                    {item.nome}
                                </strong>

                                <span className="recent-item__category">
                                    {item.categoria}
                                    {item.subcategoria
                                        ? ` • ${item.subcategoria}`
                                        : ""}
                                </span>
                            </div>

                            <div className="recent-item__details">
                                <strong>{item.codigo}</strong>

                                <span>
                                    {formatDate(
                                        item.dataEncontrado
                                    )}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="dashboard-panel__empty">
                    <FiPackage />

                    <p>Nenhum item cadastrado.</p>
                </div>
            )}
        </section>
    )
}

export default RecentItems