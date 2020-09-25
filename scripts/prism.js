const fs = require('fs');
const path = require('path');
const glob = require('glob');
const jsdom = require('jsdom');
const Prism = require('../assets/js/vendor/prism.min');

require('../assets/js/prism');

async function main() {
  const pattern = path.join(__dirname, '..', 'public', '**', '*.html');

  glob(pattern, async (error, files) => {
    for (const file of files) {
      const dom = await jsdom.JSDOM.fromFile(file);

      Prism.highlightAllUnder(dom.window.document);

      fs.writeFileSync(file, dom.serialize());
    }
  });
}

main();
