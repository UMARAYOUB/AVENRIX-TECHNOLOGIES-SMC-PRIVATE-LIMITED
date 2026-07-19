const fs = require('fs');
const path = require('path');

// Target Directories
const PAGES_DIR = path.join(__dirname, 'pages');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const OUTPUT_DIR = path.resolve(__dirname, '..');

// Helper: Read a template file
const readTemplate = (filename) => {
  return fs.readFileSync(path.join(TEMPLATES_DIR, filename), 'utf-8');
};

// Helper: Copy directory recursively
const copyDirectorySync = (src, dest) => {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  fs.readdirSync(src).forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

const compilePages = () => {
  console.log('Starting page compilation...');

  try {
    // Copy assets from src/assets to root/assets
    const srcAssets = path.join(__dirname, 'assets');
    const destAssets = path.join(OUTPUT_DIR, 'assets');
    copyDirectorySync(srcAssets, destAssets);
    console.log('Successfully copied assets to root directory.');

    // Read shared templates
    const layout = readTemplate('layout.html');
    const header = readTemplate('header.html');
    const footer = readTemplate('footer.html');

    // Read all pages in pages directory
    const files = fs.readdirSync(PAGES_DIR);

    files.forEach(file => {
      if (!file.endsWith('.html')) return;

      const filePath = path.join(PAGES_DIR, file);
      const rawContent = fs.readFileSync(filePath, 'utf-8');

      let pageMeta = {
        title: "Building Intelligent Digital Solutions",
        description: "Premium software and automation company in Pakistan.",
        canonical: file,
        schema: {}
      };
      
      let pageContent = rawContent;

      // Extract metadata block if it exists
      // Formatted as: <!-- { "title": "...", "description": "..." } -->
      const metaStart = rawContent.indexOf('<!--');
      const metaEnd = rawContent.indexOf('-->');

      if (metaStart !== -1 && metaEnd !== -1 && metaStart < metaEnd) {
        const metaText = rawContent.substring(metaStart + 4, metaEnd).trim();
        try {
          const parsedMeta = JSON.parse(metaText);
          pageMeta = { ...pageMeta, ...parsedMeta };
          // Content is everything after the comment block
          pageContent = rawContent.substring(metaEnd + 3).trim();
        } catch (e) {
          console.warn(`Warning: Failed to parse metadata JSON in ${file}. Using defaults. Error: ${e.message}`);
        }
      }

      // Default fallback schema if none specified
      if (!pageMeta.schema || Object.keys(pageMeta.schema).length === 0) {
        pageMeta.schema = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `${pageMeta.title} | AVENRIX TECHNOLOGIES`,
          "description": pageMeta.description,
          "publisher": {
            "@type": "Organization",
            "name": "AVENRIX TECHNOLOGIES (SMC-PRIVATE) LIMITED",
            "logo": {
              "@type": "ImageObject",
              "url": "https://avenrix.com/assets/img/logo.svg"
            }
          }
        };
      }

      // Replace placeholders in layout
      let compiledHtml = layout
        .replace(/{{META_TITLE}}/g, pageMeta.title)
        .replace(/{{META_DESCRIPTION}}/g, pageMeta.description)
        .replace(/{{CANONICAL_PATH}}/g, pageMeta.canonical)
        .replace(/{{STRUCTURED_DATA}}/g, JSON.stringify(pageMeta.schema, null, 2))
        .replace('{{HEADER}}', header)
        .replace('{{FOOTER}}', footer)
        .replace('{{CONTENT}}', pageContent);

      // Write compiled page to output directory
      const outputFilePath = path.join(OUTPUT_DIR, file);
      fs.writeFileSync(outputFilePath, compiledHtml, 'utf-8');
      console.log(`Successfully compiled: ${file} -> ${outputFilePath}`);
    });

    console.log('Compilation finished successfully!');

  } catch (error) {
    console.error('Error during page compilation:', error);
    process.exit(1);
  }
};

compilePages();
