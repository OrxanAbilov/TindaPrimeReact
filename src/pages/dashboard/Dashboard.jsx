import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { GET_COUNT_DOCUMENTS } from '../../features/dashboard/services/api';

function Dashboard() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await GET_COUNT_DOCUMENTS();
        const data = response.data;
        const parsedData = JSON.parse(data);

        const labels = parsedData.map(item => item.description);
        const counts = parsedData.map(item => item.count);

        const documentStyle = getComputedStyle(document.documentElement);

        const chartData = {
          labels: labels,
          datasets: [
            {
              data: counts,
              backgroundColor: [
                '#0288d1',
                '#689f38',
                '#fbc02d'
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue('--blue-400'),
                documentStyle.getPropertyValue('--green-400'),
                documentStyle.getPropertyValue('--yellow-400')
              ]
            }
          ]
        };

        const chartOptions = {
          cutout: '60%'
        };
        setChartData(chartData);
        setChartOptions(chartOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="card flex justify-content-center align-items-center mx-auto">
      <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
    </div>
  );
}

export default Dashboard;
