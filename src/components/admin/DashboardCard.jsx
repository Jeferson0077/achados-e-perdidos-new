function DashboardCard(props) {
    return (

        <article className="dashboard-card">

            <span className="dashboard-card__title">
                {props.title}
            </span>

            <strong className="dashboard-card__number">
                {props.value}
            </strong>

        </article>

    )
}

export default DashboardCard