import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import BaseResults from "./BaseResults";

function splitTextIntoLines(text, maxLineLength) {
  const words = text.split(' ');
  let line = '';
  const lines = [];

  words.forEach(word => {
      if ((line + word).length <= maxLineLength) {
          line += word + ' ';
      } else {
          lines.push(line.trim());
          line = word + ' ';
      }
  });

  // Push the last line if there's any remaining text
  if (line.length > 0) {
      lines.push(line.trim());
  }

  return lines;
}

export default function LikertResults({ element, colors }) {
  // Calculate dynamic height based on number of rows
  const dynamicHeight = Math.max(200, element.rows.length * 50 + 100);

  const data = {
    labels: element.rows.map((o) => splitTextIntoLines(o.label, 28)),
    datasets: element.columns.map((column, i) => {
      return {
        label: column.label,
        data: element.rows.map((row) => row.summary[i].count),
        borderColor: colors[i],
        backgroundColor: colors[i],
        borderWidth: 1,
        barThickness: 35, // Controls the thickness of the bars
      };
    }),
  };

  const options: any = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
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
      <div className="flow-root px-8 my-4 mt-6 text-center" style={{minHeight: dynamicHeight}}>
        <Chart type="bar" data={data} options={options} />
      </div>
    </BaseResults>
  );
}
