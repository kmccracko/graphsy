/**
 * Console logs a label. If provided, any additional values will be logged out unless blank
 * @param {string} label The heading of your log. Typically a variable name. ex: "Count" | "Users Object"
 * @param {string} type Informs the formatting of the log.
 * * header
 * * label
 * * warn
 * * instructions
 * * spacesmall
 * * spacebig
 * @param  {...any} values Any extra values will be console logged individually.
 */
const prettyLog = (label = '', type: any = undefined, ...values: any) => {
  let style = `font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;`;
  switch (type) {
    case 'header':
      style += `
        background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
        background-color: #245047;
        padding: 20px;
        color: black;
        border: 7px solid black;
        border-radius: 20px;
        font-size: x-large;
        font-weight: bold;`;
      break;
    case 'label':
      style += `
        color: white;
        font-size: larger;
        background-color: #245047;
        padding: 3px 15px;
        border-radius: 7px;
          `;
      break;
    case 'warn':
      style += `
        color: white;
        background-color: darkred;
        padding: 10px;
        font-weight: bold;
        `;
      break;
    case 'instructions':
      style += `
        font-size: small;
        padding: 10px;
        border-width: 2px;
        border-style: solid;
        `;
      break;
    case 'spacebig':
      style += `
        padding: 0px 100%;
        margin: 20px 0px;
        color: rgb(0,0,0,0);
        background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);`;
      break;
    default:
      style = '';
      break;
  }
  console.log('%c' + label, style);
  for (let el of values) if (el !== '') console.log(el);
};

export { prettyLog };
