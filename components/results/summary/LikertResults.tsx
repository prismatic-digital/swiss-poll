import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import BaseResults from "./BaseResults";

export default function LikertResults({ element, colors }) {
  const data = {
    labels: element.rows.map((o) => o.label),
    datasets: element.columns.map((column, i) => {
      return {
        label: column.label,
        data: element.rows.map((row) => row.summary[i].count),
        borderColor: colors[i],
        backgroundColor: colors[i],
        borderWidth: 1,
      };
    }),
  };

  const options: any = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          display: true,
          autoSkip: false,
          font: function (context) {
            var width = context.chart.width;
            var size = Math.round(width / 32);
            
            return {
              size: size > 12 ? 12 : (size < 8 ? 8 : size),
            };
          },
        },
      },
      x: {
        ticks: {
          display: true,
          precision: 0,
          autoSkip: false,
        },
      },
    },
  };

  return (
    <BaseResults element={element}>
      <div className="flow-root px-8 my-4 mt-6 text-center">
        <Chart type="bar" data={data} options={options} />
      </div>
    </BaseResults>
  );
}
