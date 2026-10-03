const fs = require('fs');
const path = require('path');

function stripComments(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove block comments /* ... */ (but not JSX ones if they are inside {})
  // Wait, regex for JS/JSX comments is tricky.
  // For JSX, comments are {/* ... */}
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  
  // Remove single line JS comments // ...
  // Be careful not to remove urls like http://
  content = content.replace(/(?<![:"'])\/\/.*/g, '');
  
  // Remove multi-line block comments /* ... */
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove empty lines that might have been left
  content = content.replace(/^\s*[\r\n]/gm, '');

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath);
    } else {
      if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx')) {
        stripComments(dirPath);
      }
    }
  });
}

walkDir(path.join(__dirname, 'src'));
console.log('Comments removed.');
