import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PARENT_DIR = path.resolve(PROJECT_ROOT, '..'); // Taleem Ai folder
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'Audit Report', 'Audit_Report.md');

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

    // Simple state machine to detect if we are in section 4. Question Quality Audit Report
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
                        result.qualityAuditIssues.push(`[${cols[1]}] ${cols[0]}: ${cols[2]}`);
                    }
                }
            }
        }
    }

    return result;
}

function generateReport() {
    const classes = ['Class6', 'Class7', 'Class8'];
    const subjects = ['Algebra', 'Sets'];

    let reportMarkdown = `# Deep Audit Report - Errata Of Smart Education\n\n`;
    reportMarkdown += `> Generated on: ${new Date().toLocaleString()}\n\n`;

    classes.forEach(cls => {
        reportMarkdown += `## ${cls}\n`;

        subjects.forEach(sub => {
            const dirName = `${cls}${sub}`;
            const fullPath = path.join(PARENT_DIR, dirName, 'Phase_1a_Analysis');

            if (fs.existsSync(fullPath)) {
                reportMarkdown += `### ${sub}\n\n`;

                // Table Header
                reportMarkdown += `| Image / Page | Error Stats | Critical Issues (Rewrite/Discard) | Key Identified Errors |\n`;
                reportMarkdown += `|---|---|---|---|\n`;

                const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.md'));

                // Sort files numerically if possible
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
                    const contentLines = content.split('\n');
                    const subDomainRegex = /Sub-Domain.*?[\D](\d+)(?:(?:\s*\*\*)|(?:\s*))?$/i;
                    for (let i = contentLines.length - 1; i >= 0; i--) {
                        const match = contentLines[i].trim().match(subDomainRegex);
                        if (match) { pageNumber = match[1]; break; }
                    }

                    // Formatting for Table
                    const imageName = file.slice(0, -3);
                    const location = `**${imageName}**<br>Page: ${pageNumber}`;
                    const stats = `Total: ${totalErrors}<br>Ed: ${data.editorial.length}, Fac: ${data.factual.length}, Ped: ${data.pedagogical.length}`;

                    // Format Audit Issues (The "Missing" ones)
                    let auditIssues = data.qualityAuditIssues.length > 0
                        ? `<ul>${data.qualityAuditIssues.map(i => `<li>${i}</li>`).join('')}</ul>`
                        : 'None';

                    // Format Key Errors (Top 1 from each category to keep table readable)
                    let keyErrors = '<ul>';
                    if (data.factual.length > 0) keyErrors += `<li><b>Factual:</b> ${data.factual[0].slice(0, 100)}...</li>`;
                    if (data.pedagogical.length > 0) keyErrors += `<li><b>Pedagogy:</b> ${data.pedagogical[0].slice(0, 100)}...</li>`;
                    if (data.editorial.length > 0) keyErrors += `<li><b>Editorial:</b> ${data.editorial[0].slice(0, 100)}...</li>`;
                    keyErrors += '</ul>';

                    // Only add row if there are issues
                    if (totalErrors > 0 || data.qualityAuditIssues.length > 0) {
                        reportMarkdown += `| ${location} | ${stats} | ${auditIssues} | ${keyErrors} |\n`;
                    }
                });

                reportMarkdown += `\n`; // Spacing between tables
            }
        });
    });

    // Generate Markdown
    fs.writeFileSync(OUTPUT_FILE, reportMarkdown);
    console.log(`Markdown Report generated at: ${OUTPUT_FILE}`);

    // Generate HTML
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deep Audit Report - Errata Of Smart Education</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f6f8; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 15px; }
        h2 { color: #34495e; margin-top: 30px; background: #eef2f7; padding: 10px; border-radius: 6px; }
        h3 { color: #16a085; margin-top: 25px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 0.95rem; }
        th, td { padding: 12px 15px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
        th { background: #f8f9fa; font-weight: 600; color: #555; }
        tr:nth-child(even) { background: #fcfcfc; }
        tr:hover { background: #f1f1f1; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; }
        .badge-rewrite { background: #fff3cd; color: #856404; }
        .badge-discard { background: #f8d7da; color: #721c24; }
        .badge-retain { background: #d4edda; color: #155724; }
        .stats-block { font-size: 0.85rem; color: #666; }
        .page-num { display: inline-block; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; margin-top: 5px; }
        ul { margin: 0; padding-left: 20px; }
        li { margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Deep Audit Report</h1>
        <p style="color: #666;">Generated on: ${new Date().toLocaleString()}</p>
        ${generateHTMLBody(classes, subjects)}
    </div>
</body>
</html>`;

    const HTML_OUTPUT_FILE = path.join(PROJECT_ROOT, 'Audit Report', 'Audit_Report.html');
    fs.writeFileSync(HTML_OUTPUT_FILE, htmlContent);
    console.log(`HTML Report generated at: ${HTML_OUTPUT_FILE}`);
}

function generateHTMLBody(classes, subjects) {
    let html = '';
    classes.forEach(cls => {
        html += `<h2>${cls}</h2>`;
        subjects.forEach(sub => {
            const dirName = `${cls}${sub}`;
            const fullPath = path.join(PARENT_DIR, dirName, 'Phase_1a_Analysis');

            if (fs.existsSync(fullPath)) {
                html += `<h3>${sub}</h3>`;
                html += `
                <table>
                    <thead>
                        <tr>
                            <th style="width: 15%">Image / Page</th>
                            <th style="width: 15%">Stats</th>
                            <th style="width: 25%">Critical Issues</th>
                            <th style="width: 45%">Key Identified Errors</th>
                        </tr>
                    </thead>
                    <tbody>`;

                const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.md'));
                files.sort((a, b) => {
                    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                    return numA - numB;
                });

                files.forEach(file => {
                    const filePath = path.join(fullPath, file);
                    const data = parseMarkdownDeep(filePath);
                    const totalErrors = data.editorial.length + data.factual.length + data.pedagogical.length;

                    // Page Logic
                    const content = fs.readFileSync(filePath, 'utf-8');
                    let pageNumber = 'N/A';
                    const contentLines = content.split('\n');
                    const subDomainRegex = /Sub-Domain.*?[\D](\d+)(?:(?:\s*\*\*)|(?:\s*))?$/i;
                    for (let i = contentLines.length - 1; i >= 0; i--) {
                        const match = contentLines[i].trim().match(subDomainRegex);
                        if (match) { pageNumber = match[1]; break; }
                    }

                    if (totalErrors > 0 || data.qualityAuditIssues.length > 0) {
                        // Audits
                        let auditHtml = 'None';
                        if (data.qualityAuditIssues.length > 0) {
                            auditHtml = '<ul>' + data.qualityAuditIssues.map(issue => {
                                let badgeClass = 'badge-retain';
                                if (issue.toLowerCase().includes('rewrite')) badgeClass = 'badge-rewrite';
                                if (issue.toLowerCase().includes('discard')) badgeClass = 'badge-discard';
                                // Extract status from string like "[Rewrite] Question: Reason"
                                const parts = issue.split(']');
                                const tag = parts[0].replace('[', '');
                                const text = parts.slice(1).join(']');
                                return `<li><span class="badge ${badgeClass}">${tag}</span> ${text}</li>`;
                            }).join('') + '</ul>';
                        }

                        // Errors
                        let errorHtml = '<ul>';
                        if (data.factual.length > 0) errorHtml += `<li><strong style="color:#e74c3c">Factual:</strong> ${data.factual[0].slice(0, 150)}...</li>`;
                        if (data.pedagogical.length > 0) errorHtml += `<li><strong style="color:#f39c12">Pedagogical:</strong> ${data.pedagogical[0].slice(0, 150)}...</li>`;
                        if (data.editorial.length > 0) errorHtml += `<li><strong>Editorial:</strong> ${data.editorial[0].slice(0, 100)}...</li>`;
                        errorHtml += '</ul>';

                        html += `
                        <tr>
                            <td>
                                <strong>${file.slice(0, -3)}</strong><br>
                                <span class="page-num">Page ${pageNumber}</span>
                            </td>
                            <td>
                                <div class="stats-block">Total: <strong>${totalErrors}</strong></div>
                                <div class="stats-block">Ed: ${data.editorial.length}</div>
                                <div class="stats-block">Fac: ${data.factual.length}</div>
                                <div class="stats-block">Ped: ${data.pedagogical.length}</div>
                            </td>
                            <td>${auditHtml}</td>
                            <td>${errorHtml}</td>
                        </tr>`;
                    }
                });
                html += `</tbody></table>`;
            }
        });
    });
    return html;
}

generateReport();
