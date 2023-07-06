import { utils } from "paged-html";

const legendElement = (label) => {
  return `<div class="legend-element">
            <div class="box" style="--box-color: ${label.color};"/>
            <div class="legend-text">
            ${label.text}
            </div>
        </div>`;
};

const LabelsLegend = ({ labels = [] }) => {
  const labelsRender = labels.map((label) => legendElement(label)).join("");
  return utils.htmlToElement(labelsRender);
};

export default LabelsLegend;
