import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import BaseResults from "./BaseResults";
import React from "react";

export default function ChoiceResults({ element, colors }) {
  const data = {
    //labels: element.data.options,
    labels: element.options.map((o) => o.label),
    datasets: [
      {
        //data: getDataset(element, elementAnswers),
        data: element.options.map((o) => o.summary || 0),
        borderColor: colors,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          display: true,
        },
      },
      x: {
        ticks: {
          display: true,
          precision: 0,
        },
      }
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
