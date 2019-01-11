const glob = require('glob');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../src/pages');

const getEntriesObjByFileType = fileType => {
  let testStr = '';
  switch (fileType) {
    case 'js':
      testStr = '/**/index.{js,jsx}';
      break;
    case 'html':
      testStr = '/**/index.html';
      break;
    default:
      testStr = '/**/index.{js,jsx}';
  }
  const targetFiles = glob.sync(pagesDir + testStr);
  const entriesObj = {};
  targetFiles.forEach(filePath => {
    const filePathArr = filePath.split('/');
    entriesObj[filePathArr[filePathArr.length - 2]] = filePath;
  });
  return entriesObj;
};

module.exports = {
  entriesJs: getEntriesObjByFileType('js'),
  entriesHtml: getEntriesObjByFileType('html'),
};
