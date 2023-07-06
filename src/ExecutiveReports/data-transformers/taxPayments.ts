export function taxPaymentsTransformer(apiData) {
  let columns = [
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
  return {
    columns,
    rows: apiData,
  };
}
