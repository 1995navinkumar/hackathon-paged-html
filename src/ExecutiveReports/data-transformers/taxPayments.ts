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
  let columns = [
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
  return {
    columns,
    rows: data
  };
}


function getTaxData(data) {
  const t = data.reduce((a, c) => {
    if ('tds_category' in c.tax_payment.tds) {
      if (c.tax_payment.status == "paid") {
        a.push({
          "category": c.tax_payment.tds.tds_category.name,
          "created_at": dateFormatter.format(c.tax_payment.tds.created_at * 1000),
          "total_tax_amount": c.total_tax_amount
        })
      }
    }
    return a
  }, [])

  const groupBy = (a, k) => {
    let reduceData = a.reduce((result, currentValue) => {
      result[currentValue[k]] = result[currentValue[k]] || [];
      result[currentValue[k]].push(
        currentValue
      );
      delete currentValue.category
      return result;
    }, {});
    return reduceData
  };

  const groupedData = groupBy(t, 'category')

  const tdsCategoryData = []

  for (let i in groupedData) {
    let amount = 0
    for (let j = 0; j < groupedData[i].length; j++) {
      amount += groupedData[i][j].total_tax_amount
    }
    tdsCategoryData.push({
      "category": i,
      "total_amount": amount
    })
  }

  return {
    type: 'bar',
    data: {
      labels: tdsCategoryData.map(d => d.category),
      datasets: [
        {
          data: tdsCategoryData.map(d => d.total_amount),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
    },
  };
}
