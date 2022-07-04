const shell = require('shelljs');

// User Input (process.argv)
const addParams = process.argv;
let file = '';
if (addParams[2] === 'file' && addParams[3]) {
    file += addParams[3];
}

// Execute Custom Command (30 Second)
shell.exec(`npx mocha --timeout=30000 ${file}`)