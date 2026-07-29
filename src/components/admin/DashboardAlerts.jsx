import {
    FiAlertTriangle,
    FiClock,
    FiPlusCircle,
    FiCheckCircle,
} from "react-icons/fi"

import { useItems } from "../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../constants/itemStatus"

function DashboardAlerts() {

    // esta importando tudo que esta no ItemsContext
    const { items } = useItems()
    // cria um data nova para todos os items e começa uma contagem de 60 dias e cria um alerta para 7 dias antes
    const today = new Date()
    const donationLimit = 60
    const warnigPeriod = 7

    function getDifferenceInDays(date) {
        const itemDate = new Date(date)
        // ela recebe uma data e devolve com 53 dias
        const todayWithoutTime = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        )
        // aqui é para apenas recebemos as data e ignorar as horas
        const itemDateWithoutTime = new Date(
            itemDate.getFullYear(),
            itemDate.getMonth(),
            itemDate.getDate()
        )

        const differenceInMilliseconds =
            todayWithoutTime - itemDateWithoutTime

        // Math.floor ela recebe uma data ele verica se é a de hoje ou não
        return Math.floor(
            differenceInMilliseconds / (1000 * 60 * 60 * 24)
        )
    }

    // ela compara com a data e faz as comparações com a data do dia
    function isToday(date) {
        if (!date) return false

        const comparedDate = new Date(date)

        return (
            comparedDate.getDate() === today.getDate() &&
            comparedDate.getMonth() === today.getMonth() &&
            comparedDate.getFullYear() === today.getFullYear()
        )
    }
    // ele filtrar os item que se encaixa a os requisitos e verifica o status, se estiver ativo ele filtra e alerta o item
    const overdueItems = items.filter((item) => {
        if (
            item.status !== ITEM_STATUS.ATIVO ||
            !item.dataEncontrado
        ) {
            return false
        }

        return getDifferenceInDays(item.dataEncontrado) >= donationLimit

    })

    // aqui apenas analisa os items que estão no prazo de alertas, mas antes ele procura por itens do dia e retirados 
    const approachingDonationItems = items.filter((item) => {
        if (
            item.status !== ITEM_STATUS.ATIVO ||
            !item.dataEncontrado
        ) {
            return false
        }

        const days = getDifferenceInDays(item.dataEncontrado)

        return (
            days >= donationLimit - warningPeriod &&
            days < donationLimit
        )
    })


    const registeredToday = items.filter((item) =>
        isToday(item.dataEncontrado)
    )

    const withdrawnToday = items.filter(
        (item) =>
            item.status === ITEM_STATUS.RETIRADO &&
            isToday(item.dataRetirada)
    )


    const alerts = [
        {
            title: "Disponíveis para doação",
            value: overdueItems.length,
            description:
                overdueItems.length === 1
                    ? "item completou 60 dias"
                    : "itens completaram 60 dias",
            icon: <FiAlertTriangle />,
            variant: "danger",
        },
        {
            title: "Próximos do prazo",
            value: approachingDonationItems.length,
            description: "completam 60 dias em até 7 dias",
            icon: <FiClock />,
            variant: "warning",
        },
        {
            title: "Cadastrados hoje",
            value: registeredToday.length,
            description:
                registeredToday.length === 1
                    ? "novo item cadastrado"
                    : "novos itens cadastrados",
            icon: <FiPlusCircle />,
            variant: "info",
        },
        {
            title: "Retirados hoje",
            value: withdrawnToday.length,
            description:
                withdrawnToday.length === 1
                    ? "item devolvido"
                    : "itens devolvidos",
            icon: <FiCheckCircle />,
            variant: "success",
        },
    ]

    // o .map cria um react e pega todo conteudo que esta no <article> e apenas replica todos os alertas escritos dentro dele
    return (
        <section className="dashboard-panel dashboard-panel--alerts">
            <div className="dashboard-panel__header">
                <div>
                    <span className="dashboard-panel__eyebrow">
                        Acompanhamento
                    </span>

                    <h2 className="dashboard-panel__title">
                        Alertas operacionais
                    </h2>
                </div>
            </div>

            <div className="dashboard-alerts">
                {alerts.map((alert) => (
                    <article
                        key={alert.title}
                        className={`dashboard-alert dashboard-alert--${alert.variant}`}
                    >
                        <span className="dashboard-alert__icon">
                            {alert.icon}
                        </span>

                        <div className="dashboard-alert__content">
                            <strong className="dashboard-alert__value">
                                {alert.value}
                            </strong>

                            <span className="dashboard-alert__title">
                                {alert.title}
                            </span>

                            <span className="dashboard-alert__description">
                                {alert.description}
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default DashboardAlerts