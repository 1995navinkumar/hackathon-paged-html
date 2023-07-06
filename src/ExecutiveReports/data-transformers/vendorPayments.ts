export function vendorPaymentsTransformer(apiData) {
  const topVendorPayments = getTopVendorPayments(apiData);
  const monthVsAmount = getMonthVsAmount(apiData);
  const groupByStatus = getGroupByStatus(apiData);
  
  return {
    vpTable: topVendorPayments,
    vpChart: monthVsAmount,
    groupByStatus
  };
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthVsAmount(data) {
  const payoutAmount = data.reduce((a, c) => {
    const createdDate = new Date(c.created_at * 1000);
    const month = months[createdDate.getMonth()];
    a[month] = month in a ? a[month] + c.total_amount : 0;
    return a;
  }, {});

  const sortedAmount = months.reduce((a, c) => {
    if (c in payoutAmount) {
      a.push({ [c]: payoutAmount[c] });
    }
    return a;
  }, []);

  return {
    type: 'bar',
    data: {
      labels: sortedAmount.map((c) => Object.keys(c)[0]),
      datasets: [
        {
          label: 'Vendor Payments by Months',
          data: sortedAmount.map((c) => Object.values(c)[0] / 100),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
      ],
    },
  };
}

function getTopVendorPayments(data) {
  const defaultHeader = (column) => column.name;
  const defaultCell = (column, row, index) => row[column.name];
  const columns = [
    {
      name: 'created_at',
      header: defaultHeader,
      cell: (column, row) => dateFormatter.format(row[column.name] * 1000),
    },
    {
      name: 'vendor',
      header: defaultHeader,
      cell: (column, row) => row.contact.name,
    },
    {
      name: 'total_amount',
      header: defaultHeader,
      cell: (column, row) => row.total_amount / 100,
    },
  ];

  const rows = [...data].sort((row1, row2) => row2.total_amount - row1.total_amount).slice(0, 10);

  return {
    columns,
    rows,
  };
}

function getGroupByStatus(data){
  return data.reduce((a,c) => {
    const key = c.status;
    if(key in a) {
      a[key] += 1;
    } else {
      a[key] = 1;
    }
    return a;
  },{});  
}
