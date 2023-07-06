import { colors, graphColorMap } from "../constants";

export function payoutLinksTransformer(apiData) {
  const defaultHeader = (column) => column.label;

  const columns = [
    {
      label: 'Name',
      header: defaultHeader,
      cell: (column, row) => row.contact.name,
    },
    {
      label: 'Amount',
      header: defaultHeader,
      cell: (column, row) => row.amount,
    },
    {
      label: 'Status',
      header: defaultHeader,
      cell: (column, row) => row.status,
    },
    {
      label: 'Date',
      header: defaultHeader,
      cell: (column, row) => formatDate(row.created_at),
    },
  
  ];

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  }
  const rows = [...apiData]
  .sort((row1,row2) => row2.amount - row1.amount)
  .slice(0,10);

  const chartData = {
    type: 'bar',
    data: {
      labels: apiData.map((item) => item.contact.name),
      datasets: [
        {
          label: 'Payout Amount',
          data: apiData.map((item) => item.amount),
          backgroundColor: colors,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    },
    options : {
      plugins : {
        legend : {
          display : false,
        },
        datalabels : {
          anchor : 'end',
          align : 'top',
          color : "hsla(229, 10%, 60%, 1)",
          font : {
            size : '14px'
          }
        }
      },
      scales : {
        x : {
          grid : {
            color : 'hsla(230, 23%, 29%, 1)'
          },
        },
        y : {
          grid : {
            color : 'hsla(230, 23%, 29%, 1)'
          }
        }
      }
    }
  };

  function countPaymentsPerDay(data) {
    const paymentsPerDay = {};
    for (const item of data) {
      const date = formatDate(item.created_at);
      if (paymentsPerDay[date]) {
        paymentsPerDay[date]++;
      } else {
        paymentsPerDay[date] = 1;
      }
    }
    return Object.values(paymentsPerDay);
  }
  
  const lineData = {
    type: 'line',
    data: {
      labels: Array.from(new Set(apiData.map(item => formatDate(item.created_at)))),
      datasets: [
        {
          label: 'Number of Payments',
          data: countPaymentsPerDay(apiData),
          backgroundColor: graphColorMap.A,
          borderColor: graphColorMap.A,
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins : {
        legend : {
          display : false,
        },
        datalabels : {
          anchor : 'end',
          align : 'top',
          color : "hsla(229, 10%, 60%, 1)",
          font : {
            size : '14px'
          }
        }
      },
      scales : {
        x : {
          grid : {
            color : 'hsla(230, 23%, 29%, 1)'
          }
        },
        y : {
          grid : {
            color : 'hsla(230, 23%, 29%, 1)'
          },
          beginAtZero: true,
          precision: 0,
        }
      }
    },
  };

  return {
    plTable: {
      columns,
      rows,
    },
    plChart: chartData,
    plLineChart: lineData,
  };
}