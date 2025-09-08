import { Project, SyntaxKind, JsxText, JsxAttribute, Node } from 'ts-morph';
import { glob } from 'glob';
import * as path from 'path';

// Skip words that are allowed to be hardcoded
const ALLOWED_HARDCODED = new Set([
  '&copy;', '©', '&nbsp;', ' ', '',
  'Sencer Film', 'SENCER FILM', 'Sencer', 'SENCER',
  'Next.js', 'React', 'TypeScript', 'JavaScript',
  'px', 'rem', 'em', '%', 'vh', 'vw',
  'true', 'false', 'null', 'undefined',
  '/', '#', '@', 
  // Common CSS values
  'auto', 'none', 'block', 'inline', 'flex', 'grid',
  // Route paths
  '/projeler', '/hakkimizda', '/iletisim', '/referanslar',
]);

// Attributes to check
const TEXT_ATTRIBUTES = ['alt', 'title', 'aria-label', 'placeholder', 'aria-description'];

interface HardcodedText {
  text: string;
  file: string;
  line: number;
  type: 'jsx-text' | 'attribute';
  attributeName?: string;
}

// Check if text is hardcoded and needs translation
function isHardcodedText(text: string): boolean {
  const trimmed = text.trim();
  
  // Skip empty or allowed
  if (!trimmed || ALLOWED_HARDCODED.has(trimmed)) return false;
  
  // Skip URLs and emails
  if (trimmed.startsWith('http://') || 
      trimmed.startsWith('https://') ||
      trimmed.includes('@') && trimmed.includes('.')) return false;
  
  // Skip if only numbers or special characters
  if (/^[\d\s\-_.,!?@#$%^&*()+=[\]{}|\\:;"'<>/]+$/.test(trimmed)) return false;
  
  // Skip single non-letter character
  if (trimmed.length === 1 && !/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(trimmed)) return false;
  
  // Skip hex colors
  if (/^#[0-9A-Fa-f]{3,8}$/.test(trimmed)) return false;
  
  // Skip CSS values
  if (/^\d+(\.\d+)?(px|rem|em|%|vh|vw|s|ms)$/.test(trimmed)) return false;
  
  // If it contains letters (especially Turkish), it's likely hardcoded text
  return /[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(trimmed);
}

// Scan a file for hardcoded texts
function scanFile(project: Project, filePath: string): HardcodedText[] {
  const sourceFile = project.addSourceFileAtPath(filePath);
  const hardcoded: HardcodedText[] = [];
  
  // Check if file imports useTranslations
  const hasTranslationImport = sourceFile.getImportDeclarations().some(imp => {
    const moduleSpecifier = imp.getModuleSpecifierValue();
    return moduleSpecifier.includes('next-intl') || 
           moduleSpecifier.includes('i18n') ||
           moduleSpecifier.includes('useTranslations');
  });
  
  // Find JSX Text nodes
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxText).forEach((node: JsxText) => {
    const text = node.getText();
    if (isHardcodedText(text)) {
      // Check if it's inside a translation call
      const parent = node.getParent();
      const grandParent = parent?.getParent();
      
      // Skip if inside t() or similar translation function
      const isInTranslation = grandParent?.getKindName().includes('CallExpression');
      
      if (!isInTranslation) {
        hardcoded.push({
          text: text.trim(),
          file: filePath,
          line: node.getStartLineNumber(),
          type: 'jsx-text',
        });
      }
    }
  });
  
  // Find JSX attributes
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((attr: JsxAttribute) => {
    const name = attr.getNameNode().getText();
    if (TEXT_ATTRIBUTES.includes(name)) {
      const initializer = attr.getInitializer();
      if (Node.isStringLiteral(initializer)) {
        const text = initializer.getLiteralValue();
        if (isHardcodedText(text)) {
          hardcoded.push({
            text: text.trim(),
            file: filePath,
            line: attr.getStartLineNumber(),
            type: 'attribute',
            attributeName: name,
          });
        }
      }
    }
  });
  
  return hardcoded;
}

// Main scan function
async function scan(): Promise<void> {
  console.log('🔍 Scanning for hardcoded texts...\n');
  
  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
  });
  
  // Find all TSX files
  const files = await glob([
    'src/app/**/*.tsx',
    'src/components/**/*.tsx',
  ], {
    ignore: [
      '**/node_modules/**',
      '**/*.d.ts',
      '**/i18n/**',      // Skip i18n config files
      '**/scripts/**',   // Skip scripts
    ],
  });
  
  let totalHardcoded = 0;
  const allHardcoded: HardcodedText[] = [];
  
  // Scan each file
  for (const file of files) {
    const hardcodedTexts = scanFile(project, file);
    if (hardcodedTexts.length > 0) {
      allHardcoded.push(...hardcodedTexts);
      totalHardcoded += hardcodedTexts.length;
    }
  }
  
  // Report results
  if (totalHardcoded === 0) {
    console.log('✅ No hardcoded texts found! All texts are properly internationalized.');
    process.exit(0);
  } else {
    console.log(`❌ Found ${totalHardcoded} hardcoded texts:\n`);
    
    // Group by file
    const byFile = allHardcoded.reduce((acc, item) => {
      if (!acc[item.file]) acc[item.file] = [];
      acc[item.file].push(item);
      return acc;
    }, {} as Record<string, HardcodedText[]>);
    
    for (const [file, texts] of Object.entries(byFile)) {
      console.log(`\n📄 ${file}:`);
      texts.forEach(({ text, line, type, attributeName }) => {
        const location = type === 'attribute' ? `[${attributeName}]` : '[text]';
        console.log(`   Line ${line} ${location}: "${text}"`);
      });
    }
    
    console.log('\n💡 Tip: Run "npm run i18n:extract" to extract these texts automatically.');
    process.exit(1);
  }
}

// Run the scanner
scan().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
