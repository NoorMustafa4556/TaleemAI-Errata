import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target: public/fonts/JameelNooriNastaleeq.ttf
const TARGET_DIR = path.resolve(__dirname, '../public/fonts');
const TARGET_FILE = path.join(TARGET_DIR, 'JameelNooriNastaleeq.ttf');
const FONT_URL = "https://github.com/hassanazimi/Urdu-Fonts/raw/master/Jameel%20Noori%20Nastaleeq/Jameel%20Noori%20Nastaleeq.ttf";

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

console.log(`Downloading font to: ${TARGET_FILE}`);

const file = fs.createWriteStream(TARGET_FILE);
https.get(FONT_URL, function (response) {
    if (response.statusCode !== 200) {
        console.error(`Failed to download: Status Code ${response.statusCode}`);
        return;
    }
    response.pipe(file);
    file.on('finish', function () {
        file.close(() => {
            console.log("Font download completed successfully.");
        });
    });
}).on('error', function (err) {
    fs.unlink(TARGET_FILE, () => { });
    console.error(`Error downloading font: ${err.message}`);
});
