#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to remove unused imports and variables
function removeUnusedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove unused imports (basic patterns)
    const unusedImports = [
      /import\s+{\s*Link\s*}\s+from\s+['"][^'"]*['"];\s*\n/g,
      /import\s+{\s*useEffect\s*}\s+from\s+['"][^'"]*['"];\s*\n/g,
      /import\s+{\s*Input\s*}\s+from\s+['"][^'"]*['"];\s*\n/g,
      /import\s+styled\s+from\s+['"][^'"]*['"];\s*\n/g,
      /import\s+{\s*notify\s*}\s+from\s+['"][^'"]*['"];\s*\n/g,
    ];
    
    unusedImports.forEach(pattern => {
      content = content.replace(pattern, '');
    });
    
    // Replace == with ===
    content = content.replace(/(\s+)([^=!])(\s*)=(\s*)=(\s*)([^=])/g, '$1$2$3===$5$6');
    
    // Add rel="noreferrer" to target="_blank" links
    content = content.replace(/target="_blank"(?!\s+rel=)/g, 'target="_blank" rel="noreferrer"');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to find all JS/JSX files
function findJSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !['node_modules', '.next', 'build', 'dist'].includes(file)) {
      findJSFiles(filePath, fileList);
    } else if (file.match(/\.(js|jsx)$/)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
const srcDir = path.join(process.cwd(), 'src');
if (fs.existsSync(srcDir)) {
  const jsFiles = findJSFiles(srcDir);
  console.log(`Found ${jsFiles.length} JS/JSX files to process...`);
  
  jsFiles.forEach(removeUnusedImports);
  
  console.log('ESLint auto-fix completed!');
  console.log('Run "npm run lint:fix" to apply additional automatic fixes.');
} else {
  console.log('src directory not found. Make sure you are in the correct project directory.');
}