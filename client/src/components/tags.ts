const challenge = `
  challenge {
    color: #f5f5f5; 
    font-size: 30px;
    font-family: "Georgia", "serif"; 
  }
`;

const ds = `
  ds{
    color: #f0f0f0;
    font-size: 20px;
    font-family: 'Georgia', serif;

  }
`;

const example = `
example{
  color: f0f0f0;
  font-size: 20px;
  font-family: "Georgia", "serif";

}

`;
const sub_title = `
sub-title{
  color: #b0b0b0;
  font-size: 25px;
  font-family: "Georgia", "serif";

}

`;

const more = `
  more {
    color: #f0f0f0;
    font-size: 18px;
    font-family: "Georgia", "serif";
  }
`;

const constrain = `
  constrain {
    color: red;
    color: #f0f0f0;
    font-size: 18px;
    font-family: "Georgia", "serif";
  }
`;

const variable = `
  variable {
    color: #b0b0b0;
    font-size: 18px;
    font-style: italic;
    font-family: 'Cambria Math', 'STIX Math', 'Latin Modern Math', serif;
  }
`;

const line = `
  line {
      font-family: "Courier New", Courier, monospace;
      background-color: #b0b0b0;
      color: #000000;
      font-weight: bold;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 0.95em;}
`;

const combinedStyles = `<style>
          ${challenge}
          ${ds}
          ${example}
          ${more}
          ${constrain}
          ${variable}
          ${line}
          ${sub_title}


</style>
`;

export default combinedStyles;

// export default `<style>challenge {
//   color: red;
//   font-size: 50px;
// }

// ds {
//   color: green;
// }
//  </style>`;
