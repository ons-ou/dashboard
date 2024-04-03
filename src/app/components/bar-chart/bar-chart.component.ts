import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LineController, LinearScale, Tooltip } from 'chart.js';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  standalone: true
})
export class BarChartComponent implements OnInit {
  @Input() chartData$: Observable<{ label: string; value: number }[]> | undefined;
  @Input() timeOrSeason: string | undefined;
  @Input() chartTitle: string = 'Average AQI';
  @Input() xAxisLabel: string = 'Time/Season';
  /* @ViewChild('barChart', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
 */
  constructor() {
    Chart.register(BarController, BarElement, LinearScale, LineController, CategoryScale, Tooltip);
  }

  ngOnInit(): void {
    if (this.chartData$) {
      this.chartData$.subscribe(data => {
        this.createChart(data);
      });
    }
  }

  transformData(data: { label: string; value: number }[]): any {
    return data.map(item => ({ label: item.label, value: item.value }));
  }

  createChart(data: { label: string; value: number }[]): void {
    const labels = data.map(d => d.label);
    const values = data.map(d => d.value);
    const backgroundColors = this.generateColors(data.length);

    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: this.chartTitle,
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
              text: this.xAxisLabel,
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

  generateColors(numColors: number): string[] {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * 360) / numColors;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };
}
