import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const ignoreDirs = ['node_modules', 'dist', 'build', '.git', '.vscode'];

function removeComments(content) {
  // Remove single-line comments (but keep URLs with //)
  content = content.replace(/^(\s*)\/\/.*$/gm, '');
  
  // Remove multi-line comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove JSX comments
  content = content.replace(/{\s*\/\*[\s\S]*?\*\/\s*}/g, '');
  
  // Remove consecutive empty lines (keep max 1)
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return content;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalLength = content.length;
    const newContent = removeComments(content);
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      const saved = originalLength - newContent.length;
      console.log(`✅ ${path.basename(filePath)} (saved ${saved} chars)`);
      return 1;
    }
    return 0;
  } catch (error) {
    console.error(`❌ Error: ${path.basename(filePath)} - ${error.message}`);
    return 0;
  }
}

function walkDirectory(dir) {
  let fileCount = 0;
  let totalFiles = 0;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file) && !file.startsWith('.')) {
        const result = walkDirectory(filePath);
        fileCount += result.cleaned;
        totalFiles += result.total;
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        totalFiles++;
        fileCount += processFile(filePath);
      }
    }
  }
  
  return { cleaned: fileCount, total: totalFiles };
}

console.log('🚀 Starting comment removal...\n');
console.log('📁 Scanning src directory...\n');

const srcDir = path.join(__dirname, 'src');

if (!fs.existsSync(srcDir)) {
  console.error('❌ src directory not found!');
  process.exit(1);
}

const result = walkDirectory(srcDir);

console.log('\n' + '='.repeat(50));
console.log(`✨ Done! Cleaned ${result.cleaned} out of ${result.total} files.`);
console.log('='.repeat(50));
