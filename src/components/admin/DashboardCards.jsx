import DashboardCard from "./DashboardCard"

function DashboardCards() {

    return (

        <section className="dashboard-cards">

            <DashboardCard
                title="Itens Ativos"
                value="128"
            />

            <DashboardCard
                title="Retirados"
                value="42"
            />

            <DashboardCard
                title="Para Doação"
                value="18"
            />

            <DashboardCard
                title="Hoje"
                value="6"
            />

        </section>

    )
}

export default DashboardCards