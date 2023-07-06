import PagedHTML, { components, utils } from 'paged-html';
import { fetchQuarterlyReportData } from '../fetchQuarterlyReport';
import { pdfChart } from './components';
import {
  vendorPaymentsTransformer,
  taxPaymentsTransformer,
  payoutLinksTransformer,
  payoutsTransformer,
} from './data-transformers';
import { styles } from './pdf-styles';

const { Table, Section, TOC } = components;

export default async function generateExecutiveReport() {
  const el = utils.htmlToElement(
    `<div id="pdf-container" style="height:1px; overflow:scroll;"> 

    </div>`,
  );
  document.body.appendChild(el);

  const shadow = el.attachShadow({ mode: 'closed' });

  shadow.appendChild(
    utils.htmlToElement(`
      <div>
          <style>${styles}</style>
      </div>
    `),
  );

  const root = shadow.firstElementChild;

  const instance = PagedHTML.create({
    root,
    events: {
      onPageEnd: (page, instance) => {
        const topLeft = page.querySelector('.top-left');
        const bottomRight = page.querySelector('.bottom-right');
        const style = `
            position: relative;
            top: 10px;
            width: 156px;
            height: 32px;
        `;
        topLeft.innerHTML = `<img src='/dist/assets/img/RazorpayX-logo.svg' style='${style}'/>`;
        bottomRight.innerHTML = `<span style='position: relative; top: 10px;'>Page no ${page.pageNumber}</span>`;
      },
      onPageStart: () => {},
    },
  });

  const { payoutsData, taxPaymentsData, vendorPaymentsData, payoutLinksData } =
    await fetchQuarterlyReportData();

  const vpData = vendorPaymentsTransformer(vendorPaymentsData);

  const taxData = taxPaymentsTransformer(taxPaymentsData);

  const plData = payoutLinksTransformer(payoutLinksData);

  const pData = payoutsTransformer(payoutsData);

  const vendorPaymentSection = Section({
    name: 'vendorPayment',
    newPage: true,
    displayName: 'Vendor Payments',
    templates: [
      Section({
        name: 'Top10VendorPayments',
        displayName: 'Top 10 Vendor Payments',
        templates: [
          Table({
            ...vpData.vpTable,
          }),
        ],
      }),
      Section({
        name: 'Vendor_Payments_by_Months',
        displayName: 'Vendor Payments by Months',
        templates: [
          pdfChart({
            chartData: vpData.vpChart,
            height: 300,
            width: 500,
          }),
        ],
      }),
    ],
  });
  const TaxSection = Section({
    newPage: true,
    name: 'TaxPayments',
    displayName: 'Tax Payments',
    templates: [
      Section({
        name: 'tax_summary',
        displayName: 'Tax Summary',
        templates: [Table({ ...taxData })],
      }),
    ],
  });

  await instance.render([vendorPaymentSection, TaxSection, TOC]);

  printPage(shadow.innerHTML);
  document.body.removeChild(el);
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
  const hideFrame = document.createElement('iframe');
  hideFrame.onload = setPrint;
  hideFrame.style.position = 'fixed';
  hideFrame.style.right = '0';
  hideFrame.style.bottom = '0';
  hideFrame.style.width = '0';
  hideFrame.style.height = '0';
  hideFrame.style.border = '0';
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
</head>
<body>
    ${htmlString}
</body>
</html>
`;