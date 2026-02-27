import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PARENT_DIR = path.resolve(PROJECT_ROOT, '..'); // Taleem Ai folder
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'errata_data.json');

function parseMarkdownDeep(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const result = {
        editorial: [],
        factual: [],
        pedagogical: [],
        qualityAuditIssues: []
    };

    // 1. Extract Errors (Standard Logic)
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

    const headerPatterns = [
        { key: 'editorial', regex: /\(i\)\s*(?:\*\*)?Editorial Errors(?:\*\*)?(:)?/i },
        { key: 'factual', regex: /\(ii\)\s*(?:\*\*)?Factual Errors(?:\*\*)?(:)?/i },
        { key: 'pedagogical', regex: /\(iii\)\s*(?:\*\*)?Pedagogical & Conceptual Flaws(?:\*\*)?(:)?/i }
    ];

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
            const startPos = current.index + current.length;
            let endPos = content.length;

            for (let j = 0; j < matches.length; j++) {
                if (i === j) continue;
                if (matches[j].index > current.index && matches[j].index < endPos) {
                    endPos = matches[j].index;
                }
            }
            const nextSection = /\n###\s*\*\*3\./.exec(content.slice(startPos));
            if (nextSection) {
                const absoluteNext = startPos + nextSection.index;
                if (absoluteNext < endPos) endPos = absoluteNext;
            }

            const sectionText = content.substring(startPos, endPos);
            result[current.key] = extractList(sectionText);
        }
    }

    // 2. Extract Quality Audit Issues (The "Missing" Link)
    // Look for table rows containing "Rewrite" or "Discard"
    const auditTableRegex = /\|(.*?)\|(.*?)\|(.*?)\|/g;
    let tableMatch;
    let inAuditSection = false;

    const lines = content.split('\n');
    for (const line of lines) {
        if (line.includes('4. Question Quality Audit Report')) {
            inAuditSection = true;
            continue;
        }
        if (inAuditSection && line.startsWith('###')) {
            inAuditSection = false; // Next section started
        }

        if (inAuditSection) {
            // Check for pipe table rows
            if (line.trim().startsWith('|')) {
                const cols = line.split('|').map(c => c.trim()).filter(c => c !== '');
                if (cols.length >= 3) {
                    const status = cols[1].toLowerCase(); // Status column
                    if (status.includes('rewrite') || status.includes('discard')) {
                        result.qualityAuditIssues.push({
                            status: cols[1].trim(), // Keep original case
                            question: cols[0].trim(),
                            reason: cols[2].trim()
                        });
                    }
                }
            }
        }
    }

    return result;
}

function generateData() {
    const classes = ['Class6', 'Class7', 'Class8'];
    const subjects = ['Algebra', 'Sets'];
    const allData = [];

    classes.forEach(cls => {
        subjects.forEach(sub => {
            const dirName = `${cls}${sub}`;
            const fullPath = path.join(PARENT_DIR, dirName, 'Phase_1a_Analysis');

            if (fs.existsSync(fullPath)) {
                const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.md'));

                // Sort files numerically
                files.sort((a, b) => {
                    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                    return numA - numB;
                });

                files.forEach(file => {
                    const filePath = path.join(fullPath, file);
                    const data = parseMarkdownDeep(filePath);
                    const totalErrors = data.editorial.length + data.factual.length + data.pedagogical.length;

                    // Page Number Logic
                    const content = fs.readFileSync(filePath, 'utf-8');
                    let pageNumber = 'N/A';

                    // Priority 1: Extract from Filename (e.g., ..._101.png.md)
                    const filenameMatch = file.match(/_(\d+)\.png\.md$/);
                    if (filenameMatch) {
                        pageNumber = filenameMatch[1];
                    } else {
                        // Priority 2: Extract from Content (Fallback)
                        const contentLines = content.split('\n');
                        const subDomainRegex = /Sub-Domain.*?[\D](\d+)(?:(?:\s*\*\*)|(?:\s*))?$/i;
                        for (let i = contentLines.length - 1; i >= 0; i--) {
                            const match = contentLines[i].trim().match(subDomainRegex);
                            if (match) { pageNumber = match[1]; break; }
                        }
                    }

                    // Only add if there are actual issues or stats
                    if (totalErrors > 0 || data.qualityAuditIssues.length > 0) {
                        allData.push({
                            id: `${cls}_${sub}_${file}`,
                            class: cls,
                            subject: sub,
                            image: file,
                            page: pageNumber,
                            stats: {
                                total: totalErrors,
                                editorial: data.editorial.length,
                                factual: data.factual.length,
                                pedagogical: data.pedagogical.length
                            },
                            errors: {
                                editorial: data.editorial,
                                factual: data.factual,
                                pedagogical: data.pedagogical
                            },
                            audit_issues: data.qualityAuditIssues
                        });
                    }
                });
            }
        });
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData, null, 2));
    console.log(`JSON Data generated at: ${OUTPUT_FILE}`);
    console.log(`Total records: ${allData.length}`);
}

generateData();
