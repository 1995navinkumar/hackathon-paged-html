export function taxPaymentsTransformer(apiData) {
  const columns = [
    {
      name: 'Tax Id',
      header: () => 'Tax Id',
      cell: (column, row, index) => `${row.id}`,
    },
    {
      name: 'Total amount',
      header: () => 'Total amount',
      cell: (column, row, index) => `${row.total_amount}`,
    },
    {
      name: 'Status',
      header: () => 'Status',
      cell: (column, row, index) => `${row?.tax_payment?.status}`,
    },
  ];

  const rows = apiData
  .sort((row1,row2) => row2.total_amount - row1.total_amount)
  .slice(0,10)

  return {
    columns,
    rows: rows,
  };
}
