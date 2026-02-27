import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PARENT_DIR = path.resolve(PROJECT_ROOT, '..'); // Taleem Ai folder

function scanForMismatches() {
    const classes = ['Class6', 'Class7', 'Class8'];
    const subjects = ['Algebra', 'Sets'];

    console.log("Checking for mismatches between Filename and Content Page Number...");
    console.log("---------------------------------------------------------------");

    classes.forEach(cls => {
        subjects.forEach(sub => {
            const dirName = `${cls}${sub}`;
            const fullPath = path.join(PARENT_DIR, dirName, 'Phase_1a_Analysis');

            if (fs.existsSync(fullPath)) {
                const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.md'));

                files.forEach(file => {
                    const filePath = path.join(fullPath, file);
                    const content = fs.readFileSync(filePath, 'utf-8');

                    // Extract number from filename: Class6_Sets_73.png.md -> 73
                    const filenameMatch = file.match(/_(\d+)\.png\.md$/);

                    if (filenameMatch) {
                        const filenameNum = parseInt(filenameMatch[1], 10);
                        const contentLines = content.split('\n');
                        let foundNum = null;

                        // Strategy: Look for "Sub-Domain-X: ... NUMBER" at end of line
                        // Matches: "Sub-Domain-6: ALGEBRAIC EXPRESSIONS **93**" or "Sub-Domain-5: SETS 69"
                        // The regex [\D] ensures we don't match the digit in "Sub-Domain-6" or "Part-2" unless it is the last number
                        const subDomainRegex = /Sub-Domain.*?[\D](\d+)(?:(?:\s*\*\*)|(?:\s*))?$/i;

                        // Scan the whole file, but prioritize the end
                        for (let i = contentLines.length - 1; i >= 0; i--) {
                            const line = contentLines[i].trim();
                            // Clean line of simple markdown bolding for easier matching check
                            const match = line.match(subDomainRegex);
                            if (match) {
                                foundNum = parseInt(match[1], 10);
                                break;
                            }
                        }

                        if (foundNum !== null) {
                            if (foundNum !== filenameNum) {
                                console.error(`[MISMATCH] ${dirName}/${file}`);
                                console.error(`   -> Filename says: ${filenameNum}`);
                                console.error(`   -> Content says:  ${foundNum}`);
                                console.error(`   -> Diff: ${filenameNum - foundNum}`);
                            }
                        } else {
                            // console.warn(`[WARNING] Could not find page number in content for ${file}`);
                        }
                    }
                });
            }
        });
    });
    console.log("---------------------------------------------------------------");
    console.log("Scan complete.");
}

scanForMismatches();
