import { Component, Input, SimpleChanges } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LineController, LinearScale, Tooltip } from 'chart.js';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-temporal-trends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temporal-trends.component.html',
  styleUrl: './temporal-trends.component.css'
})
export class TemporalTrendsComponent {
  @Input() airQualityData$: Observable<{ label: string; value: number; }[]> | undefined;
  @Input() time:string | undefined;
  constructor() {
    Chart.register(BarController, BarElement, LinearScale, LineController, CategoryScale, Tooltip);
  }
  ngOnInit(): void {
    if (this.airQualityData$) {
      this.airQualityData$.subscribe(data => {
        this.createChart(data);
      });
    }
  }
  generateColors(numColors: number): string[] {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * 360) / numColors;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };

  createChart(data: { label: string, value: number }[]): void {
    const labels = data.map(d => d.label);
    const values = data.map(d => d.value);
    const backgroundColors = this.generateColors(data.length);
    const canvas = document.getElementById('airQualityChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average AQI',
          data: values,
          backgroundColor: backgroundColors,
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
              text: this.time,
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
