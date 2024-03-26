import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

function Dashboard() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
      const documentStyle = getComputedStyle(document.documentElement);
      const data = {
          labels: ['Gözləmədə', 'Tamamlandı', 'İmtina edildi', 'İlkin qeydiyyat'],
          datasets: [
              {
                  data: [30, 13, 24, 7],
                  backgroundColor: [
                      '#0288d1',
                      '#689f38',
                      '#d32f2f',
                      '#fbc02d' 
                  ],
                  hoverBackgroundColor: [
                      documentStyle.getPropertyValue('--blue-400'),
                      documentStyle.getPropertyValue('--green-400'),
                      documentStyle.getPropertyValue('--red-500'),
                      documentStyle.getPropertyValue('--yellow-400')
                  ]
              }
          ]
      };
      const options = {
          cutout: '60%'
      };

      setChartData(data);
      setChartOptions(options);
  }, []);

  return (
    <>
    <div className="card flex justify-content-center align-items-center mx-auto">
          <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
    </div>
    </>
  )


}

export default Dashboard;
