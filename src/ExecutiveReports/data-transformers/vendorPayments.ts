export function vendorPaymentsTransformer(apiData) {
  const topVendorPayments = getTopVendorPayments(apiData);
  const monthVsAmount = getMonthVsAmount(apiData);
  const groupByStatus = getGroupByStatus(apiData);
  const amountByContacts = getAmountByContacts(apiData);
  return {
    vpTable: topVendorPayments,
    vpChart: monthVsAmount,
    groupByStatus,
    amountByContacts
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
  const defaultHeader = (column) => column.name.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
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

function getAmountByContacts(data){
    const groupByContacts = data.reduce((a,c) => {
      const key = c.contact.name;
      if(key in a) {
        a[key] = [a[key][0] + c.total_amount, a[key][1] + 1];
      } else {
        a[key] = [ c.total_amount, 1]
      }
      return a;
    },{});  

    
    const sortByAmount = Object.entries(groupByContacts).sort((entry1,entry2) => entry2[1][0] - entry1[1][0]);

    const top5Contacts = sortByAmount.slice(0,5);

    const contactsByAmount = Object.fromEntries(top5Contacts);

    
    const keys = Object.keys(contactsByAmount);
    const values = Object.values(contactsByAmount);

    return {
      type : 'doughnut',
      data : {
        labels : keys,
        datasets : [{
          label: 'Total Amount',
          data : values.map(d => d[0] / 100)
        }],
        radius : '40%'
      },
      options : {
        plugins : {
          datalabels : {
            font : {
              size : '18px',
            }
          },
          legend : {
            position : 'right',
            labels : {
              padding : 64,
              boxWidth : 64,
              boxHeight : 32,
              font : {
                size : 18
              }
            }
          }
        }
      }
    };
    
}