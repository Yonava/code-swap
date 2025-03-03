const challengeTitle = `
  challengeTitle {
    color: #b0b0b0; 
    font-size: 30px;
    font-family: "Georgia", "serif"; 
  }
`;

const description = `
  description{
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
const sectionHeader= `
sectionHeader{
  color: #b0b0b0;
  font-size: 25px;
  font-family: "Georgia", "serif";

}

`;

const explain = `
  explain {
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
          ${challengeTitle}
          ${description}
          ${example}
          ${explain}
          ${constrain}
          ${variable}
          ${line}
          ${sectionHeader}


</style>
`;

export default combinedStyles;

// export default `<style>challengeTitle {
//   color: red;
//   font-size: 50px;
// }

// description {
//   color: green;
// }
//  </style>`;
