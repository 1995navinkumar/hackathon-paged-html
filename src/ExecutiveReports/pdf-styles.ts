import { bladeTokens } from "./blade-tokens";

export const styles = `
    ${bladeTokens}

    #pdf-root, body {
        background : var(--colors-surface-background-level1-low-contrast);
        color : var(--colors-brand-gray-500-high-contrast);
    }
  

    a {
        all: unset;
    }

    table {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
        margin-top: 24px;
    }

    td {
        border-right : 1px solid var(--colors-brand-gray-500-high-contrast);
        padding : 8px;
    }

    th {
        border-right : 1px solid var(--colors-brand-gray-500-high-contrast);
        border-bottom : 1px solid var(--colors-brand-gray-500-high-contrast);
        padding: 8px;
    }

    th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        // background-color: #04aa6d;
        // color: white;
    }

    .section {
        font-size: 24px;
        font-weight: bold;
        // color: gray;
        opacity: 0.9;
        margin-top: 24px;
        margin-bottom: 4px;
    }

    .section[depth='1'] {
        margin-top: 0;
        border-bottom: 1px solid gray;
        padding-bottom: 4px;
    }

    .toc-section {
        display: flex;
        font-size: 22px;
        // color: gray;
        /* font-weight: bold; */
        padding: 8px 0px;
        cursor: pointer;
    }

    .toc-dotted {
        flex: 1;
        border-bottom: 1px dotted;
        position: relative;
        bottom: 6px;
        margin: 0px 8px
    }

    .toc-title {
        font-size: 24px;
        // color: gray;
        font-weight: bold;
        padding: 8px 0px;
    }

    .count-card-container {
        display : flex;
        justify-content : space-between;
        padding : 12px;
    }

    .count-card {
        height: 100px;
        width: 100px;
        border-radius : 16px;
        border: 1px solid #dedede;
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        align-items: center;
        justify-content: center;
    }

    .count-value {
        font-weight : bold;
        font-size : 36px;
        color : var(--colors-feedback-background-negative-high-contrast);
    }

    .vp_contacts {
        display : flex;
        justify-content : center;
    }

    .labels-legend {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .legend-element {
        display: flex;
        gap: 16px;
        font-size: 16px;
    }

    .legend-element .box {
        width: 16px;
        height: 16px;
        background-color: var(--box-color); /* pass using style on the legend box div */
    }
`;
