import { Chart } from 'chart.js/auto';

const data = {
  "terminals": [
    {
      "terminal": 1,
      "flights": 27
    },
    {
      "terminal": 2,
      "flights": 22
    },
    {
      "terminal": 3,
      "flights": 31  
    },
    {
      "terminal": 4,
      "flights": 20
    }
  ]
}

export function createBarChart(canvas: HTMLCanvasElement) {
  const labels = data.terminals.map((terminal) => terminal.terminal);
  const flightsData = data.terminals.map((terminal) => terminal.flights);

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Flights per Terminal',
        data: flightsData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}