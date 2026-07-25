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
        (item) => item.status === ITEM_STATUS.ATIVO
    )

    const withdrawnItems = items.filter(
        (item) => item.status === ITEM_STATUS.RETIRADO
    )

    const donatedItems = items.filter(
        (item) => item.status === ITEM_STATUS.DOADO
    )

    const itemsForDonation = activeItems.filter((item) => {
        if (!item.dataEncontrado) {
            return false
        }

        const foundDate = new Date(item.dataEncontrado)
        const currentDate = new Date()

        const differenceInMilliseconds =
            currentDate.getTime() - foundDate.getTime()

        const differenceInDays =
            differenceInMilliseconds /
            (1000 * 60 * 60 * 24)

        return differenceInDays >= 60
    })

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
                subtitle="Mais de 60 dias"
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