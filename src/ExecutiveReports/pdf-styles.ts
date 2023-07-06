import { bladeTokens } from './blade-tokens';

export const styles = `
    ${bladeTokens}

  /*
    body {
        background : var(--colors-surface-background-level1-low-contrast);
    }
  */

    a {
        all: unset;
    }

    table {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    td,
    th {
        border: 1px solid #ddd;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    tr:hover {
        background-color: #ddd;
    }

    th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #04aa6d;
        color: white;
    }

    .section {
        font-size: 24px;
        font-weight: bold;
        color: gray;
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
        color: gray;
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
        color: gray;
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
`;
