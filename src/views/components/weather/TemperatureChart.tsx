import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const placeholderChartData = {
  labels: [] as string[],
  datasets: [
    {
      label: 'Temperature',
      data: [] as number[],
      borderColor: 'rgb(14, 165, 233)',
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
    },
  ],
}

export function TemperatureChart() {
  return (
    <section className="rounded-xl border border-gray-200 p-4">
      <Line data={placeholderChartData} />
    </section>
  )
}
