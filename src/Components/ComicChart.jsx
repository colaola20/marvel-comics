import { useComics } from '../ComicsContext.jsx';
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ComicChart = () => {
  const { comics, loading } = useComics();
  const [activeChart, setActiveChart] = useState('price-distribution');

  if (loading) return <div>Loading charts...</div>;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      },
      title: {
        display: true,
        color: '#ffffff'
      }
    },
    scales: {
      x: {
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  // Chart data calculations
  const getPriceDistribution = () => {
    const ranges = { '$0-2': 0, '$2-5': 0, '$5-10': 0, '$10-15': 0, '$15+': 0 };
    comics.forEach(comic => {
      const price = comic.prices[0]?.price || 0;
      if (price < 2) ranges['$0-2']++;
      else if (price < 5) ranges['$2-5']++;
      else if (price < 10) ranges['$5-10']++;
      else if (price < 15) ranges['$10-15']++;
      else ranges['$15+']++;
    });

    return {
      labels: Object.keys(ranges),
      datasets: [{
        label: 'Number of Comics',
        data: Object.values(ranges),
        backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    };
  };

  const getTopSeries = () => {
    const seriesCounts = comics.reduce((acc, comic) => {
      const series = comic.series?.name || 'Unknown';
      acc[series] = (acc[series] || 0) + 1;
      return acc;
    }, {});

    const topSeries = Object.entries(seriesCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);

    return {
      labels: topSeries.map(([name]) => name),
      datasets: [{
        label: 'Number of Comics',
        data: topSeries.map(([,count]) => count),
        backgroundColor: 'rgba(78, 205, 196, 0.8)',
        borderColor: '#4ecdc4',
        borderWidth: 1
      }]
    };
  };

  return (
    <div className="comic-chart-container">
        <Bar data={getPriceDistribution()} options={chartOptions} />;
        <Bar data={getTopSeries()} options={{...chartOptions, indexAxis: 'y'}} />
    </div>
  );
}



export default ComicChart;