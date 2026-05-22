import { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function GraphPlotter({ title, xLabel, yLabel, datasets, xData, yData }) {
  const chartData = datasets ? {
    labels: datasets[0]?.data.map((_, i) => i),
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color || ['#4f8cff', '#00e676', '#ff6eb4', '#ffab00'][i % 4],
      backgroundColor: (ds.color || ['#4f8cff', '#00e676', '#ff6eb4', '#ffab00'][i % 4]) + '15',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: ds.color || '#4f8cff',
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      tension: 0.3,
      fill: true,
    }))
  } : {
    labels: xData || [],
    datasets: [{
      label: title || 'Data',
      data: yData || [],
      borderColor: '#4f8cff',
      backgroundColor: 'rgba(79,140,255,0.1)',
      borderWidth: 2,
      pointRadius: 5,
      pointBackgroundColor: '#4f8cff',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      tension: 0.3,
      fill: true,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'rgba(255,255,255,0.7)', font: { family: 'Inter', size: 12 } }
      },
      tooltip: {
        backgroundColor: 'rgba(10,14,39,0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleFont: { family: 'Inter' },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        title: { display: true, text: xLabel || 'X', color: 'rgba(255,255,255,0.5)', font: { family: 'Inter', size: 12 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'JetBrains Mono', size: 10 } },
      },
      y: {
        title: { display: true, text: yLabel || 'Y', color: 'rgba(255,255,255,0.5)', font: { family: 'Inter', size: 12 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'JetBrains Mono', size: 10 } },
      },
    },
    animation: { duration: 800, easing: 'easeInOutQuart' },
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>{title || 'Graph'}</h4>
      <div style={styles.chartWrap}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.03)', borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.06)', padding: 18,
  },
  title: {
    fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: 14,
  },
  chartWrap: {
    height: 280, position: 'relative',
  },
};
