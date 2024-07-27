"use client";

import { TransArt } from "@/lib/types";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ articles }: { articles: TransArt[] }) => {
  const articleData = articles.map((article) => ({
    title: article.title,
    quantity: article.quantity,
    consome: article.consome,
  }));

  const data = {
    labels: articleData.map(
      (article) => article.title.substring(0, 8) + "..."
    ),
    datasets: [
      {
        label: "Consome",
        data: articleData.map((article) => article.consome),
        borderColor: "#8884d8",
        backgroundColor: "#8884d8",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Quantite",
        data: articleData.map((article) => article.quantity),
        borderColor: "#82ca9d",
        backgroundColor: "#82ca9d",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Dernières Transactions",
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Articles",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Quantité / Consommation",
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  return (
    <div className="h-full hidden md:flex flex-1 flex-col items-start gap-4 bg-white p-4 -mt-12">
      <div style={{ height: "500px", width: "100%" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Chart;
