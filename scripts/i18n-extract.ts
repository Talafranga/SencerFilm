import { Project, Node, SyntaxKind, JsxAttribute, JsxText, StringLiteral } from 'ts-morph';
import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
import slugify from 'slugify';

// Skip words that shouldn't be extracted
const SKIP_WORDS = new Set([
  '&copy;', '©', '&nbsp;', ' ', '',
  'Sencer Film', 'SENCER FILM', 'Sencer', 'SENCER',
  'Next.js', 'React', 'TypeScript', 'JavaScript',
  'TR', 'EN', 'tr', 'en',
  'px', 'rem', 'em', '%',
  'true', 'false', 'null', 'undefined',
]);

// Attributes to check for text content
const TEXT_ATTRIBUTES = ['alt', 'title', 'aria-label', 'placeholder', 'aria-description'];

interface ExtractedText {
  text: string;
  file: string;
  line: number;
  type: 'jsx-text' | 'attribute';
  attributeName?: string;
  suggestedKey: string;
}

interface Report {
  extractedTexts: ExtractedText[];
  totalFiles: number;
  totalTexts: number;
  skippedTexts: string[];
}

// Check if text should be extracted
function shouldExtractText(text: string): boolean {
  const trimmed = text.trim();
  
  // Skip empty or whitespace-only
  if (!trimmed) return false;
  
  // Skip if in skip list
  if (SKIP_WORDS.has(trimmed)) return false;
  
  // Skip URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return false;
  
  // Skip if only numbers or special characters
  if (/^[\d\s\-_.,!?@#$%^&*()+=[\]{}|\\:;"'<>/]+$/.test(trimmed)) return false;
  
  // Skip single character (except Turkish characters)
  if (trimmed.length === 1 && !/[ğüşıöçĞÜŞİÖÇ]/.test(trimmed)) return false;
  
  // Must contain at least one Turkish character or be longer than 2 words
  const hasTurkishChar = /[ğüşıöçĞÜŞİÖÇ]/i.test(trimmed);
  const wordCount = trimmed.split(/\s+/).length;
  
  return hasTurkishChar || wordCount >= 2;
}

// Generate a translation key from file path and text
function generateKey(filePath: string, text: string, componentName?: string): string {
  const relativePath = filePath.replace(/\\/g, '/');
  const parts = relativePath.split('/');
  
  // Extract meaningful parts
  let prefix = '';
  
  if (parts.includes('components')) {
    const compIndex = parts.indexOf('components');
    const compName = parts[compIndex + 1]?.replace('.tsx', '').replace('.jsx', '');
    if (compName) prefix = compName.toLowerCase();
  } else if (parts.includes('app')) {
    const appIndex = parts.indexOf('app');
    const pageName = parts[appIndex + 1];
    if (pageName && pageName !== '[locale]') {
      prefix = pageName;
    } else if (parts[appIndex + 2]) {
      prefix = parts[appIndex + 2];
    }
  }
  
  // Create slug from text
  const textSlug = slugify(text.slice(0, 30), {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  }).slice(0, 20);
  
  // Combine parts
  if (!prefix) prefix = 'common';
  return `${prefix}.${textSlug}`;
}

// Extract texts from a TypeScript file
async function extractFromFile(project: Project, filePath: string): Promise<ExtractedText[]> {
  const sourceFile = project.addSourceFileAtPath(filePath);
  const extracted: ExtractedText[] = [];
  const fileName = path.basename(filePath, path.extname(filePath));
  
  // Find all JSX Text nodes
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxText).forEach((node: JsxText) => {
    const text = node.getText();
    if (shouldExtractText(text)) {
      extracted.push({
        text: text.trim(),
        file: filePath,
        line: node.getStartLineNumber(),
        type: 'jsx-text',
        suggestedKey: generateKey(filePath, text, fileName),
      });
    }
  });
  
  // Find all JSX attributes with text values
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((attr: JsxAttribute) => {
    const name = attr.getNameNode().getText();
    if (TEXT_ATTRIBUTES.includes(name)) {
      const initializer = attr.getInitializer();
      if (Node.isStringLiteral(initializer)) {
        const text = initializer.getLiteralValue();
        if (shouldExtractText(text)) {
          extracted.push({
            text: text.trim(),
            file: filePath,
            line: attr.getStartLineNumber(),
            type: 'attribute',
            attributeName: name,
            suggestedKey: generateKey(filePath, text, fileName),
          });
        }
      }
    }
  });
  
  return extracted;
}

// Main extraction function
async function extractTexts(isDryRun: boolean = false): Promise<void> {
  console.log(`🔍 Starting i18n text extraction (${isDryRun ? 'DRY RUN' : 'APPLY'})...\n`);
  
  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
  });
  
  // Find all TSX files in app and components
  const files = await glob([
    'src/app/**/*.tsx',
    'src/components/**/*.tsx',
  ], {
    ignore: ['**/node_modules/**', '**/*.d.ts'],
  });
  
  const report: Report = {
    extractedTexts: [],
    totalFiles: files.length,
    totalTexts: 0,
    skippedTexts: [],
  };
  
  // Extract from each file
  for (const file of files) {
    const texts = await extractFromFile(project, file);
    report.extractedTexts.push(...texts);
  }
  
  report.totalTexts = report.extractedTexts.length;
  
  // Generate report
  console.log(`📊 Extraction Report:`);
  console.log(`   Files scanned: ${report.totalFiles}`);
  console.log(`   Texts found: ${report.totalTexts}\n`);
  
  if (report.extractedTexts.length > 0) {
    console.log(`📝 Extracted texts:\n`);
    
    // Group by file
    const byFile = report.extractedTexts.reduce((acc, item) => {
      if (!acc[item.file]) acc[item.file] = [];
      acc[item.file].push(item);
      return acc;
    }, {} as Record<string, ExtractedText[]>);
    
    for (const [file, texts] of Object.entries(byFile)) {
      console.log(`\n📄 ${file}:`);
      texts.forEach(({ text, line, type, attributeName, suggestedKey }) => {
        const location = type === 'attribute' ? `[${attributeName}]` : '[text]';
        console.log(`   Line ${line} ${location}: "${text}"`);
        console.log(`   → Suggested key: ${suggestedKey}`);
      });
    }
  }
  
  // Save report
  const reportPath = path.join('scripts', '.i18n-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Full report saved to: ${reportPath}`);
  
  if (!isDryRun && report.extractedTexts.length > 0) {
    console.log(`\n✨ Applying changes...`);
    
    // Load existing messages
    const trMessagesPath = path.join('messages', 'tr', 'common.json');
    const enMessagesPath = path.join('messages', 'en', 'common.json');
    
    const trMessages = JSON.parse(await fs.readFile(trMessagesPath, 'utf-8'));
    const enMessages = JSON.parse(await fs.readFile(enMessagesPath, 'utf-8'));
    
    // Add new keys
    const addedKeys: string[] = [];
    
    report.extractedTexts.forEach(({ text, suggestedKey }) => {
      // Parse nested key
      const keyParts = suggestedKey.split('.');
      let trTarget = trMessages;
      let enTarget = enMessages;
      
      // Navigate to nested object
      for (let i = 0; i < keyParts.length - 1; i++) {
        const part = keyParts[i];
        if (!trTarget[part]) trTarget[part] = {};
        if (!enTarget[part]) enTarget[part] = {};
        trTarget = trTarget[part];
        enTarget = enTarget[part];
      }
      
      const finalKey = keyParts[keyParts.length - 1];
      
      // Only add if key doesn't exist
      if (!trTarget[finalKey]) {
        trTarget[finalKey] = text;
        enTarget[finalKey] = text; // Placeholder - same as TR for now
        addedKeys.push(suggestedKey);
      }
    });
    
    // Save updated messages
    await fs.writeFile(trMessagesPath, JSON.stringify(trMessages, null, 2));
    await fs.writeFile(enMessagesPath, JSON.stringify(enMessages, null, 2));
    
    console.log(`\n✅ Added ${addedKeys.length} new translation keys`);
    console.log(`\n⚠️  Note: English translations are placeholders. Please update them!`);
    console.log(`\n🔧 Next step: Update your components to use useTranslations() with these keys.`);
  }
}

// Run the script
const isDryRun = process.argv.includes('--dry');
extractTexts(isDryRun).catch(console.error);
