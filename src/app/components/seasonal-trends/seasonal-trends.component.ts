import { Component, inject } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LineController, LinearScale } from 'chart.js';
import { Tooltip } from 'chart.js';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-seasonal-trends',
  templateUrl: './seasonal-trends.component.html',
  styleUrls: ['./seasonal-trends.component.css'],
  standalone: true
})
export class SeasonalTrendsComponent {

  private service = inject(DataService);

  data$ = this.service.avgValueBySeason$;

  constructor() {
    Chart.register(BarController, BarElement, LinearScale, LineController, CategoryScale, Tooltip);
  }

  ngOnInit(): void {
    this.data$.subscribe(data => {
      this.createChart(data);
    });
  }

  createChart(data: { season: string, value: number }[]): void {
    const labels = data.map(d => d.season);
    const values = data.map(d => d.value);
  
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average AQI',
          data: values,
          backgroundColor: [
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(255, 159, 64)',
            'rgb(153, 102, 255)',
            'rgb(255, 99, 132)'
          ],
          borderColor: 'white',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Average Value',
              font: {
                size: 16
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            title: {
              display: true,
              text: 'Season',
              font: {
                size: 16
              }
            }
          }
        },
        plugins: {
          tooltip: {
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                return `Value: ${context.raw}`;
              }
            }
          }
        }
      }
    });
  }  
  
}