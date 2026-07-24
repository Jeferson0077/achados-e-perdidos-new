function DashboardCard({
    title,
    value,
    icon,
    variant = "default",
    subtitle,
}) {
    return (
        <article className={`dashboard-card dashboard-card--${variant}`}>
            <div className="dashboard-card__icon">
                {icon}
            </div>

            <div className="dashboard-card__content">
                <strong className="dashboard-card__number">
                    {value}
                </strong>

                <span className="dashboard-card__title">
                    {title}
                </span>

                {subtitle && (
                    <span className="dashboard-card__subtitle">
                        {subtitle}
                    </span>
                )}
            </div>
        </article>
    )
}

export default DashboardCard