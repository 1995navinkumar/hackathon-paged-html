import PagedHTML, { components, utils } from "paged-html";
import { fetchQuarterlyReportData } from "../fetchQuarterlyReport";
import { countCard, pdfChart } from "./components";
import {
  vendorPaymentsTransformer,
  taxPaymentsTransformer,
  payoutLinksTransformer,
  payoutsTransformer,
} from "./data-transformers";
import { styles } from "./pdf-styles";

const { Table, Section, TOC } = components;

export default async function generateExecutiveReport() {
  const el = utils.htmlToElement(
    `<div id="pdf-container"> 

    </div>`
  );
  document.body.appendChild(el);

  const shadow = el.attachShadow({ mode: "closed" });

  shadow.appendChild(
    utils.htmlToElement(`
      <div id="pdf-root">
          <style>${styles}</style>
      </div>
    `)
  );

  const root = shadow.firstElementChild;

  const instance = PagedHTML.create({
    root,
    events: {
      onPageEnd: (page, instance) => {
        const topLeft = page.querySelector(".top-left");
        const bottomRight = page.querySelector(".bottom-right");
        const style = `
            position: relative;
            top: 10px;
            width: 156px;
            height: 32px;
        `;
        topLeft.innerHTML = `<img src='/dist/assets/img/RazorpayX-logo.svg' style='${style}'/>`;
        bottomRight.innerHTML = `<span style='position: relative; top: 10px;'>Page no ${page.pageNumber}</span>`;
      },
      onPageStart: () => { },
    },
  });

  const { payoutsData, taxPaymentsData, vendorPaymentsData, payoutLinksData } =
    await fetchQuarterlyReportData();

  const vpData = vendorPaymentsTransformer(vendorPaymentsData);

  const taxData = taxPaymentsTransformer(taxPaymentsData);

  const plData = payoutLinksTransformer(payoutLinksData);

  const payouts = payoutsTransformer(payoutsData);

  const vendorPaymentSection = Section({
    name: "vendorPayment",
    newPage: true,
    displayName: "Vendor Payments",
    templates: [
      Section({
        name: "groupByStatus",
        displayName: "Payments Summary",
        templates: [countCard({ data: vpData.groupByStatus })],
      }),
      Section({
        name: "amountByContacts",
        threshold: 500,
        displayName: "Payments by contact",
        templates: [
          pdfChart({
            name: "vp_contacts",
            chartData: vpData.amountByContacts,
            threshold: 500,
            height: "400px",
            width: "400px",
          }),
        ],
      }),
      Section({
        name: "Top10VendorPayments",
        threshold: 300,
        displayName: "Top 10 Vendor Payments",
        templates: [
          Table({
            ...vpData.vpTable,
          }),
        ],
      }),
      Section({
        name: "Vendor_Payments_by_Months",
        threshold: 500,
        displayName: "Vendor Payments by Months",
        templates: [
          pdfChart({
            name: "vp_month",
            chartData: vpData.vpChart,
            threshold: 500,
            height: "350px",
            width: "100%",
          }),
        ],
      }),
    ],
  });

  const TaxSection = Section({
    newPage: true,
    name: "TaxPayments",
    displayName: "Tax Payments",
    templates: [
      Section({
        name: "tax_summary",
        displayName: "Tax Summary",
        templates: [Table({ ...taxData.taxTable })],
      }),
      Section({
        name: 'TDS',
        threshold: 500,
        displayName: 'TDS Payments by Months',
        templates: [
          pdfChart({
            chartData: taxData.taxChart,
            height: "350px",
            width: "100%",
          }),
        ],
      }),
    ],
  });

  const payoutsSection = Section({
    newPage: true,
    name: "Payouts",
    displayName: "Payouts",
    templates: [
      Section({
        name: "payouts_mode",
        displayName: "Payouts Mode",
        templates: [
          pdfChart({
            name: 'payouts_mode',
            chartData: payouts.payoutsModeChart.chartConfig,
            height: "400px",
            width: "400px",
          }),
        ],
      }),
      Section({
        name: "payouts_ranges",
        displayName: "Payout Ranges",
        templates: [
          pdfChart({
            chartData: payouts.payoutRangesChart.chartConfig,
            height: "300px",
            width: "100%",
          }),
        ],
      }),
    ],
  });

  const payoutLinksSection = Section({
    name: "payoutLinks",
    newPage: true,
    displayName: "Payout Links",
    templates: [
      Table({
        ...plData.plTable,
      }),
      Section({
        name: "PayoutLinkslineChart",
        displayName: "Trend for Number of Payments on each day",
        templates: [
          pdfChart({
            chartData: plData.plLineChart,
            height: "350px",
            width: "100%",
          }),
        ],
      }),
      Section({
        name: "PayoutLinksChart",
        threshold: 300,
        displayName: "Amount vs User for each payment",
        templates: [
          pdfChart({
            chartData: plData.plChart,
            height: "350px",
            width: "100%",
          }),
        ],
      }),
    ],
  });
  await instance.render([
    payoutsSection,
    vendorPaymentSection,
    TaxSection,
    payoutLinksSection,
  ]);

  instance.events.onPageEnd = () => { };

  await instance.render([TOC()]);

  printPage(shadow.innerHTML);
  // document.body.removeChild(el);
}
// In order to print just the report contents, we would need a new document. Hence used Iframe.
// window.print will print entire page which is not needed.

function closePrint() {
  document.body.removeChild(this.__container__);
}

function setPrint() {
  this.contentWindow.__container__ = this;
  this.contentWindow.onbeforeunload = closePrint;
  this.contentWindow.onafterprint = closePrint;
  this.contentWindow.focus(); // Required for IE
  this.contentWindow.print();
}

function printPage(srcDoc) {
  const hideFrame = document.createElement("iframe");
  hideFrame.onload = setPrint;
  hideFrame.style.position = "fixed";
  hideFrame.style.right = "0";
  hideFrame.style.bottom = "0";
  hideFrame.style.width = "0";
  hideFrame.style.height = "0";
  hideFrame.style.border = "0";
  hideFrame.srcdoc = getHtml(srcDoc);
  document.body.appendChild(hideFrame);
}

const getHtml = (htmlString) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href='https://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
</head>
<body>
    ${htmlString}
</body>
</html>
`;
