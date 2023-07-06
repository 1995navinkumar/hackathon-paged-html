import { colors, graphColorMap } from "../constants";

export function taxPaymentsTransformer(apiData) {
  const taxPayments = getTaxPayments(apiData)
  const taxData = getTaxData(apiData)
  return {
    taxTable: taxPayments,
    taxChart: taxData
  }
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});

function getTaxPayments(data) {
  const defaultHeader = (column) => column.name;
  const columns = [
    {
      name: 'tax_id',
      header: defaultHeader,
      cell: (column, row, index) => `${row.id}`,
    },
    {
      name: 'total_amount',
      header: defaultHeader,
      cell: (column, row, index) => `${row.total_amount}`,
    },
    {
      name: 'status',
      header: defaultHeader,
      cell: (column, row, index) => `${row?.tax_payment?.status}`,
    },
  ];

  const rows = data
    .sort((row1, row2) => row2.total_amount - row1.total_amount)
    .slice(0, 10);

  return {
    columns,
    rows
  };
}


function getTaxData(data) {
  const t = data.reduce((a, c) => {
    if ('tds_category' in c.tax_payment.tds) {
      if (c.tax_payment.status == "paid") {
        a.push({
          "tax_category": c.tax_payment.tds.tds_category.name,
          "code": c.tax_payment.tds.tds_category.code,
          "created_at": dateFormatter.format(c.tax_payment.tds.created_at * 1000),
          "total_tax_amount": c.total_tax_amount
        })
      }
    }
    return a
  }, [])

  const groupBy = (a, k) => {
    const reduceData = a.reduce((result, currentValue) => {
      result[currentValue[k]] = result[currentValue[k]] || [];
      result[currentValue[k]].push(
        currentValue
      );
      delete currentValue.category
      return result;
    }, {});
    return reduceData
  };

  const groupedData = groupBy(t, 'code')

  const tdsCategoryData = []

  for (const i in groupedData) {
    let amount = 0
    let tax_category = ""
    for (let j = 0; j < groupedData[i].length; j++) {
      amount += groupedData[i][j].total_tax_amount
      tax_category = groupedData[i][j].tax_category
    }
   
    tdsCategoryData.push({
      "tax_category" : tax_category,
      "code": i,
      "total_amount": amount
    })
  }

  return {
    type: 'bar',
    data: {
      labels: tdsCategoryData.map(d => d.code),
      datasets: [
        {
          barThickness : 30,
          data: tdsCategoryData.map(d => d.total_amount),
          backgroundColor: colors,
          borderColor: "white",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels : {
            generateLabels(){
              const customLabels = tdsCategoryData.reduce((e,t,index)=>{
               e.push({
                "text" : `${t.code} - ${t.tax_category}`,
                "fontColor" : "white",
                "fillStyle" : colors[index]          
               })
               return e
              },[])
              return customLabels
            }
          }
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: "hsla(229, 10%, 60%, 1)",
          font: {
            size: '14px'
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'hsla(230, 23%, 29%, 1)'
          }
        },
        y: {
          grid: {
            color: 'hsla(230, 23%, 29%, 1)'
          }
        }
      }
    }
  };
}
