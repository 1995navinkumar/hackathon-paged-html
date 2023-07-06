import { graphColorMap } from "../constants";

export function payoutsTransformer(apiData) {
  const payoutsModeChart = getPayoutsModeChart(apiData);
  const payoutRangesChart = getPayoutRangesChart(apiData);
  return {
    payoutsModeChart,
    payoutRangesChart,
  };
}

function getPayoutsModeChart(payoutsData) {
  const upi = payoutsData.filter((payout) => payout.mode === "UPI");
  const imps = payoutsData.filter((payout) => payout.mode === "IMPS");
  const neft = payoutsData.filter((payout) => payout.mode === "NEFT");
  const amazonPay = payoutsData.filter((payout) => payout.mode === "amazonpay");

  const upiAmount = upi.reduce((total, payout) => total + payout.amount, 0);
  const impsAmount = upi.reduce((total, payout) => total + payout.amount, 0);
  const neftAmount = upi.reduce((total, payout) => total + payout.amount, 0);
  const amazonPayAmount = upi.reduce((total, payout) => total + payout.amount, 0);

  const upiCount = upi.length;
  const impsCount = imps.length;
  const neftCount = neft.length;
  const amazonPayCount = amazonPay.length;

  const data = {
    labels: ["UPI", "IMPS", "NEFT", "amazonpay"],
    datasets: [
      {
        label: "Mode",
        data: [upiCount, impsCount, neftCount, amazonPayCount],
        backgroundColor: [graphColorMap.A, graphColorMap.B, graphColorMap.C, graphColorMap.D],
      },
    ],
  };

  const chartConfig = {
    type: "doughnut",
    data,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: false,
        },
        legend: {
          position: "right",
        },
      },
    },
  };

  const modeAmountMap = {
    upi: upiAmount,
    neft: neftAmount,
    imps: impsAmount,
    amazonPay: amazonPayAmount,
  };

  return { chartConfig, modeAmountMap };
}

function getPayoutRangesChart(payoutsData) {
  const ranges = getPayoutRangesCount(payoutsData, { divisionCount: 4 });
  const labels = ranges.map(
    (range) => `₹${range.lowerRange / 100} - ₹${range.upperRange / 100} : ${range.count}`
  );
  const datasetData = ranges.map((range) => range.count);

  const data = {
    labels,
    datasets: [
      {
        label: "Amount per payout",
        data: datasetData,
        backgroundColor: [graphColorMap.A, graphColorMap.B, graphColorMap.C, graphColorMap.D],
      },
    ],
  };

  const chartConfig = {
    type: "bar",
    data,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: false,
        },
        legend: {
          position: "right",
        },
      },
    },
  };

  return { chartConfig, ranges };
}

function getPayoutRangesCount(payoutsData, options = {}) {
  const divisionCount = options.divisionCount || 4;
  const highestAmount = payoutsData.reduce(
    (highest, payout) => (payout.amount > highest ? payout.amount : highest),
    0
  );
  const lowestAmount = payoutsData.reduce(
    (lowest, payout) => (payout.amount < lowest ? payout.amount : lowest),
    Number.MAX_VALUE
  );

  const divisionAmount = (highestAmount - lowestAmount) / divisionCount;
  const divisionRanges = [];
  for (let i = 0; i < divisionCount; i++) {
    const lowerRange = lowestAmount + divisionAmount * i;
    const upperRange = lowerRange + divisionAmount;
    const payoutsInRange = payoutsData.filter(
      (payout) => payout.amount >= lowerRange && payout.amount <= upperRange
    );
    const count = payoutsInRange.length;
    const amount = payoutsInRange.reduce((total, payout) => total + payout.amount, 0);

    divisionRanges.push({
      lowerRange,
      upperRange,
      count,
      amount,
    });
  }
  return divisionRanges;
}
