import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { Chart, ChartTypeRegistry, LegendItem, registerables } from 'chart.js';
import { categoryColors } from '../../utils/categories';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  @Input() canvasId!: string;
  @Input() labels!: string[];
  @Input() values!: number[];
  @Input() colors!: string[];
  @Input() title!: string;
  @Input() chartType: keyof ChartTypeRegistry = 'pie';
  @Input() legendDisplay = true;
  @Input() axis?: { x?: string; y?: string } = undefined;
  @ViewChild('chart') canvas!: ElementRef;

  renderer = inject(Renderer2);

  generateLabels = (chart: Chart) : LegendItem[] => {
    const datasets = chart.data.datasets;
    const uniqueColors = new Map<string, string>();
  
    datasets.forEach((dataset) => {
      const backgroundColor = dataset.backgroundColor;
      if (Array.isArray(backgroundColor)) {
        backgroundColor.forEach((color) => {
          if (!uniqueColors.has(color)) {
            const category = Object.keys(categoryColors).find(
              (key) => categoryColors[key] === color
            );
            if (category) {
              uniqueColors.set(color, category);
            }
          }
        });
      } else if (typeof backgroundColor === 'string') {
        if (!uniqueColors.has(backgroundColor)) {
          const category = Object.keys(categoryColors).find(
            (key) => categoryColors[key] === backgroundColor
          );
          if (category) {
            uniqueColors.set(backgroundColor, category);
          }
        }
      }
    });
  
    return Array.from(uniqueColors.entries()).map(([color, category]) => ({
      text: category,
      fillStyle: color,
      lineCap: 'round',
      lineDashOffset: 0,
      lineJoin: 'round',
      lineWidth: 0,
      pointStyle: 'circle',
    }));
  };
  

  constructor() {
    Chart.register(...registerables);
  }

  ngOnChanges(): void {
    let chart = Chart.getChart(this.canvasId);
    if (chart !== undefined) chart.destroy();
    this.createChart();

  }

  createChart(): void {
    if (!this.canvas) return;
  
    const canvasElement = this.canvas.nativeElement;
  
    const parentElement = canvasElement.parentElement;
  
    if (!parentElement) return;
  
    const parentComputedStyle = window.getComputedStyle(parentElement);
    const parentWidth = parseFloat(
      parentComputedStyle.getPropertyValue('width')
    );
    const parentHeight = parseFloat(
      parentComputedStyle.getPropertyValue('height')
    );
    const canvasWidth = parentWidth * 0.7;
    const canvasHeight = parentHeight * 0.7;
  
    this.renderer.setStyle(canvasElement, 'width', canvasWidth + 'px');
    this.renderer.setStyle(canvasElement, 'height', canvasHeight + 'px');
  
    const ctx = this.canvas.nativeElement.getContext('2d');
  
    const scales: any = {};
    if (this.axis !== undefined) {
      if (this.axis?.x !== undefined) {
        scales.x = {
          title: {
            display: true,
            text: this.axis.x,
          },
        };
      }
  
      if (this.axis?.y !== undefined) {
        scales.y = {
          title: {
            display: true,
            text: this.axis.y,
          },
        };
      }
    }
  
    let labels: any= {}
    if (!this.legendDisplay)
      labels.generateLabels = this.generateLabels

    new Chart(ctx, {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.values,
            backgroundColor: this.colors,
            borderColor: 'white',
            hoverOffset: 4,
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                return `Value: ${context.raw}`;
              },
            },
          },
          legend: {
            labels
          }
        },
        scales: scales,
      },
    });
  }
  
}
