import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { utils } from 'paged-html';
import { PagedComponent, PagedeComponentCreator, PagedHTMLInstance } from 'paged-html/build/types';

Chart.register(ChartDataLabels);

export function countCard({ data = {} }){
  return function render(pagedInstance: PagedHTMLInstance): PagedComponent {
    const entries = Object.entries(data);
    async function* renderer() {
      const countContainer = utils.htmlToElement(`
        <div class="count-card-container">
          ${
            entries
              .map(entry => `
                  <div class="count-card">
                    <span class="count-value">${entry[1]}</span>
                    <span class="count-label">${entry[0]}</span>
                  </div>
              `)
              .join("")
          }
        </div>
      `);
      const contentArea = pagedInstance.getCurrentPage().contentArea;
      contentArea.appendChild(countContainer);
      yield countContainer;
    }

    return {
      renderer,
    };
  };
}

export function pdfChart({
  name = '',
  chartData,
  threshold = 500,
  height = "inherit",
  width = "100%",
}: {
  name?: string;
  chartData: Record<string, any>;
  threshold?: number;
  height?: string;
  width?: string;
}): PagedeComponentCreator {
  return function render(pagedInstance: PagedHTMLInstance): PagedComponent {
    function init() {
      const remainingHeight = pagedInstance.getRemainingHeight();
      if (remainingHeight < threshold) {
        pagedInstance.insertNewPage();
      }
    }

    async function* renderer() {
      const chartEl = utils.htmlToElement(`
                <div>
                    <canvas></canvas>
                </div>
            `);

      const pageContent = pagedInstance.getCurrentPage().contentArea;
      pageContent.appendChild(chartEl);

      const canvasEl = chartEl.querySelector('canvas');

      await renderChart(canvasEl, chartData);

      const imageUri = canvasEl?.toDataURL();

      pageContent.removeChild(chartEl);

      const imageEl = utils.htmlToElement(
        `<div class='${name}'>
            <img src=${imageUri} style="height : ${height}; width : ${width}"/>
          </div>
        `,
      );

      pageContent.appendChild(imageEl);

      yield imageEl;
    }

    return {
      init,
      renderer,
    };
  };
}

function renderChart(canvas, chartData) {
  return new Promise((res) => {
    new Chart(canvas, {
      ...chartData,
      options: {
        ...chartData.options,
        animation: {
          onComplete : res
        }
      },
    });
  });
}
