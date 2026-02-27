import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PARENT_DIR = path.resolve(PROJECT_ROOT, '..'); // Taleem Ai folder
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'data.json');
const IMAGES_SOURCE_DIR = path.join(PARENT_DIR, 'images');
const PUBLIC_IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images');

// Ensure public images dir exists
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

// Regex to find sections
const ERROR_SECTIONS = {
    editorial: {
        regex: /\(i\) Editorial Errors:\*\*(.*?)(?=\*\*|$)/s,
        cleanRegex: /\* (.*)/g
    },
    factual: {
        regex: /\(ii\) Factual Errors:\*\*(.*?)(?=\*\*|$)/s,
        cleanRegex: /\* (.*)/g
    },
    pedagogical: {
        regex: /\(iii\) Pedagogical & Conceptual Flaws:\*\*(.*?)(?=\*\*|$)/s,
        cleanRegex: /\* (.*)/g
    }
};

function parseMarkdown(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const result = {
        editorial: [],
        factual: [],
        pedagogical: []
    };

    const extractList = (sectionContent) => {
        const items = [];
        const lines = sectionContent.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('*')) {
                items.push(trimmed.slice(1).trim());
            }
        }
        return items;
    };

    // Regex to find headers, accounting for optional bolding (**), casing, and colons
    // Matches: (i) Editorial Errors:, (i) **Editorial Errors**:, **(i) Editorial Errors:**, etc.
    const headerPatterns = [
        { key: 'editorial', regex: /\(i\)\s*(?:\*\*)?Editorial Errors(?:\*\*)?(:)?/i },
        { key: 'factual', regex: /\(ii\)\s*(?:\*\*)?Factual Errors(?:\*\*)?(:)?/i },
        { key: 'pedagogical', regex: /\(iii\)\s*(?:\*\*)?Pedagogical & Conceptual Flaws(?:\*\*)?(:)?/i }
    ];

    // Find indices
    const matches = headerPatterns.map(h => {
        const match = h.regex.exec(content);
        return {
            key: h.key,
            index: match ? match.index : -1,
            length: match ? match[0].length : 0
        };
    });

    for (let i = 0; i < matches.length; i++) {
        const current = matches[i];
        if (current.index !== -1) {
            // Start reading AFTER the header
            const startPos = current.index + current.length;

            // Find the next section or end of file
            let endPos = content.length;

            // 1. Check against other headers
            for (let j = 0; j < matches.length; j++) {
                if (i === j) continue;
                if (matches[j].index > current.index && matches[j].index < endPos) {
                    endPos = matches[j].index;
                }
            }

            // 2. Check against other common section headers like "3. Cognitive"
            // Using a simple regex for the next numerical main section
            const nextSection = /\n###\s*\*\*3\./.exec(content.slice(startPos)); // relative search
            if (nextSection) {
                const absoluteNext = startPos + nextSection.index;
                if (absoluteNext < endPos) endPos = absoluteNext;
            }

            const sectionText = content.substring(startPos, endPos);
            result[current.key] = extractList(sectionText);
        }
    }

    return result;
}

function scanDirectories() {
    const classes = ['Class6', 'Class7', 'Class8'];
    const subjects = ['Algebra', 'Sets'];

    const db = {};

    classes.forEach(cls => {
        db[cls] = {};
        subjects.forEach(sub => {
            const dirName = `${cls}${sub}`;
            const fullPath = path.join(PARENT_DIR, dirName, 'Phase_1a_Analysis');

            if (fs.existsSync(fullPath)) {
                console.log(`Scanning ${dirName}...`);
                const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.md'));

                const imageData = [];

                files.forEach(file => {
                    const filePath = path.join(fullPath, file);
                    const errors = parseMarkdown(filePath);
                    const totalErrors = errors.editorial.length + errors.factual.length + errors.pedagogical.length;

                    const imageName = file.slice(0, -3); // Remove .md extension

                    // Extract internal page number
                    const content = fs.readFileSync(filePath, 'utf-8');
                    let pageNumber = null;
                    const contentLines = content.split('\n');
                    // Regex strategy from verification script
                    const subDomainRegex = /Sub-Domain.*?[\D](\d+)(?:(?:\s*\*\*)|(?:\s*))?$/i;

                    for (let i = contentLines.length - 1; i >= 0; i--) {
                        const line = contentLines[i].trim();
                        const match = line.match(subDomainRegex);
                        if (match) {
                            pageNumber = match[1];
                            break;
                        }
                    }

                    if (totalErrors > 0) {
                        imageData.push({
                            id: imageName,
                            fileName: imageName,
                            pageNumber: pageNumber || 'N/A',
                            errors: errors,
                            totalErrors: totalErrors
                        });
                    }
                });

                imageData.sort((a, b) => b.totalErrors - a.totalErrors);

                const top5 = imageData.slice(0, 5);
                db[cls][sub] = top5;

                if (!fs.existsSync(path.join(PUBLIC_IMAGES_DIR, cls, sub))) {
                    fs.mkdirSync(path.join(PUBLIC_IMAGES_DIR, cls, sub), { recursive: true });
                }

                top5.forEach(img => {
                    const src = path.join(IMAGES_SOURCE_DIR, img.fileName);
                    const dest = path.join(PUBLIC_IMAGES_DIR, cls, sub, img.fileName);
                    if (fs.existsSync(src)) {
                        fs.copyFileSync(src, dest);
                    } else {
                        console.warn(`Warning: Image not found at ${src}`);
                    }
                });
            } else {
                console.warn(`Directory not found: ${fullPath}`);
                db[cls][sub] = [];
            }
        });
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(db, null, 2));
    console.log(`Data generated at ${OUTPUT_FILE}`);
}

scanDirectories();
