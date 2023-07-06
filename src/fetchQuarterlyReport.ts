import { fetchedData } from './ExecutiveReports/fetched-data';

export const fetchQuarterlyReportData = async () => {
    /*
      const [payoutsResponse, taxPaymentsResponse, vendorPaymentsResponse, payoutLinksResponse] =
        await Promise.all([
          api.pdfReport.getPayouts(),
          api.pdfReport.getTaxPayments(),
          api.pdfReport.getVendorPayments(),
          api.pdfReport.getPayoutLinks(),
        ]);
  
      const result = {
        payoutsData: payoutsResponse.data.items,
        taxPaymentsData: taxPaymentsResponse.data.items,
        vendorPaymentsData: vendorPaymentsResponse.data.items,
        payoutLinksData: payoutLinksResponse.data.items,
      };
    */
  
    console.log(fetchedData);
  
    return fetchedData;
};