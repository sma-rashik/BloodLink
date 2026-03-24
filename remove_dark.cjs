const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
    if (filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf-8');
        
        let newContent = content.replace(/\bdark:([a-zA-Z0-9\-\/]+)\b\s*/g, '');
        newContent = newContent.replace(/\s+className="/g, ' className="');
        newContent = newContent.replace(/className="\s+/g, 'className="');
        newContent = newContent.replace(/\s+"/g, '"');
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf-8');
            console.log('Cleaned:', filePath);
        }
    }
});
