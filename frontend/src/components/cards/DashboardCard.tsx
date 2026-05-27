import "../../css/DashboardCard.css"

export interface DashboardCardProps {
    cardTitle: string
    cardValue: number | string
    cardDescription: string
    cardTrend: string
}

export const DashboardCard = ({ cardTitle, cardValue, cardDescription, cardTrend }: DashboardCardProps) => {
    const isPositive = typeof cardTrend === "string" && cardTrend.startsWith("+")
    const isNegative = typeof cardTrend === "string" && cardTrend.startsWith("-")

    return (
        <div className="dashboard-card">
            <span className="dashboard-card__title">{cardTitle}</span>
            <span className="dashboard-card__value">{cardValue}</span>
            <div className="dashboard-card__footer">
                <span className="dashboard-card__description">{cardDescription}</span>
                <span
                    className={`dashboard-card__trend ${
                        isPositive ? "trend--positive" : isNegative ? "trend--negative" : ""
                    }`}
                >
                    {cardTrend}
                </span>
            </div>
        </div>
    )
}