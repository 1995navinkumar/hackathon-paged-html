import Chart from 'chart.js/auto';
import { utils } from 'paged-html';
import { PagedComponent, PagedeComponentCreator, PagedHTMLInstance } from 'paged-html/build/types';


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
  chartData,
  height = 500,
}: {
  chartData: Record<string, any>;
  height?: number;
  width?: number;
}): PagedeComponentCreator {
  return function render(pagedInstance: PagedHTMLInstance): PagedComponent {
    function init() {
      const remainingHeight = pagedInstance.getRemainingHeight();
      if (remainingHeight < height) {
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
        `<img src=${imageUri} style="height : ${height}; width : 100%"/>`,
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
