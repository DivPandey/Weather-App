window.temperatureChartInstance = null;
window.sevenDayTempChartInstance = null;

window.updateCharts = function(data) {
  const hourlyLabels = data.list.slice(0, 8).map(item => new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }));
  const hourlyTemperatures = data.list.slice(0, 8).map(item => item.main.temp);

  const dailyLabels = data.list.filter(item => item.dt_txt.includes('12:00:00')).map(item => new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }));
  const dailyTemperatures = data.list.filter(item => item.dt_txt.includes('12:00:00')).map(item => item.main.temp);

  updateTemperatureChart(hourlyLabels, hourlyTemperatures);
  updateSevenDayTempChart(dailyLabels, dailyTemperatures);
}


function updateCharts(data) {
  const hourlyLabels = data.list.slice(0, 8).map(item => new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }));
  const hourlyTemperatures = data.list.slice(0, 8).map(item => item.main.temp);

  const dailyLabels = data.list.filter(item => item.dt_txt.includes('12:00:00')).map(item => new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }));
  const dailyTemperatures = data.list.filter(item => item.dt_txt.includes('12:00:00')).map(item => item.main.temp);

  updateTemperatureChart(hourlyLabels, hourlyTemperatures);
  updateSevenDayTempChart(dailyLabels, dailyTemperatures);
}

function updateTemperatureChart(labels, temperatures) {
  const ctx = document.getElementById('temperatureChart').getContext('2d');

  if (temperatureChartInstance) {
    temperatureChartInstance.destroy();
  }

  temperatureChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temperatures,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        title: {
          display: true,
          text: '24-Hour Temperature Forecast'
        }
      }
    }
  });
}

function updateSevenDayTempChart(labels, temperatures) {
  const ctx = document.getElementById('sevenDayTempChart').getContext('2d');

  if (sevenDayTempChartInstance) {
    sevenDayTempChartInstance.destroy();
  }

  sevenDayTempChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temperatures,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        title: {
          display: true,
          text: '5-Day Temperature Forecast'
        }
      }
    }
  });
}

function updateChartsTheme(isDarkMode) {
  const textColor = isDarkMode ? '#f3f4f6' : '#1f2937';

  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  if (temperatureChartInstance) {
    temperatureChartInstance.options.scales.x.ticks.color = textColor;
    temperatureChartInstance.options.scales.y.ticks.color = textColor;
    temperatureChartInstance.update();
  }

  if (sevenDayTempChartInstance) {
    sevenDayTempChartInstance.options.scales.x.ticks.color = textColor;
    sevenDayTempChartInstance.options.scales.y.ticks.color = textColor;
    sevenDayTempChartInstance.update();
  }
}
