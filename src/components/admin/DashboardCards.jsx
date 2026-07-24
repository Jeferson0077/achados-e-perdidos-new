import {
    FiPackage,
    FiCheckCircle,
    FiGift,
    FiArchive,
} from "react-icons/fi"

import DashboardCard from "./DashboardCard"

function DashboardCards() {
    return (
        <section className="dashboard-cards">

            <DashboardCard
                title="Itens Ativos"
                value="128"
                subtitle="Disponíveis"
                icon={<FiPackage />}
                variant="active"
            />

            <DashboardCard
                title="Itens Retirados"
                value="42"
                subtitle="Entregues"
                icon={<FiCheckCircle />}
                variant="withdrawn"
            />

            <DashboardCard
                title="Para Doação"
                value="18"
                subtitle="Mais de 60 dias"
                icon={<FiGift />}
                variant="donation"
            />

            <DashboardCard
                title="Itens Doados"
                value="6"
                subtitle="Histórico"
                icon={<FiArchive />}
                variant="donated"
            />

        </section>
    )
}

export default DashboardCards