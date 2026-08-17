import {
    FiPackage,
    FiCheckCircle,
    FiGift,
    FiArchive,
} from "react-icons/fi"

import DashboardCard from "./DashboardCard"
import { useItems } from "../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../constants/itemStatus"

function DashboardCards() {
    const { items } = useItems()

    const activeItems = items.filter(
        (item) =>
            item.status === ITEM_STATUS.ATIVO
    )

    const withdrawnItems = items.filter(
        (item) =>
            item.status === ITEM_STATUS.RETIRADO
    )

    const itemsForDonation = items.filter(
        (item) =>
            item.status === ITEM_STATUS.PARA_DOACAO
    )

    const donatedItems = items.filter(
        (item) =>
            item.status === ITEM_STATUS.DOADO
    )

    return (
        <section className="dashboard-cards">
            <DashboardCard
                title="Itens Ativos"
                value={activeItems.length}
                subtitle="Disponíveis"
                icon={<FiPackage />}
                variant="active"
            />

            <DashboardCard
                title="Itens Retirados"
                value={withdrawnItems.length}
                subtitle="Entregues"
                icon={<FiCheckCircle />}
                variant="withdrawn"
            />

            <DashboardCard
                title="Para Doação"
                value={itemsForDonation.length}
                subtitle="60 dias ou mais"
                icon={<FiGift />}
                variant="donation"
            />

            <DashboardCard
                title="Itens Doados"
                value={donatedItems.length}
                subtitle="Histórico"
                icon={<FiArchive />}
                variant="donated"
            />
        </section>
    )
}

export default DashboardCards