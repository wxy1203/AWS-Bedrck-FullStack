import { Chart } from 'chart.js/auto';

export function createBarChart(canvas: HTMLCanvasElement) {

  return new Chart(canvas, { type: 'bar', data: { labels: ['Terminal 1', 'Terminal 2', 'Terminal 3', 'Terminal 4'], datasets: [{ label: 'Flights per Terminal', data: [27, 20, 33, 12], backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] }, options: { scales: { y: { beginAtZero: true } } } });

}