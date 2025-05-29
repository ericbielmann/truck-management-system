import { Clock, Truck, CheckCircle, XCircle, Fuel } from "lucide-react"

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Programados",
      value: stats.programados || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "En Tránsito",
      value: stats.en_transito || 0,
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Entregados",
      value: stats.entregados || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Cancelados",
      value: stats.cancelados || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Total Litros",
      value: (stats.total_litros || 0).toLocaleString(),
      icon: Fuel,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className={`${card.bgColor} ${card.borderColor} border rounded-lg p-4 transition-transform duration-200 hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <Icon className={`h-8 w-8 ${card.color}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
