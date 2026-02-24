const { chromium } = require('playwright');

async function scrapeSeed(seed) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    await page.waitForSelector("table");

    const sum = await page.evaluate(() => {
        let total = 0;
        const tables = document.querySelectorAll("table");

        tables.forEach(table => {
            const cells = table.querySelectorAll("td");
            cells.forEach(cell => {
                const num = parseFloat(cell.innerText.trim());
                if (!isNaN(num)) {
                    total += num;
                }
            });
        });

        return total;
    });

    await browser.close();
    return sum;
}

(async () => {
    let grandTotal = 0;

    for (let seed = 86; seed <= 95; seed++) {
        console.log(`Scraping seed ${seed}...`);
        const result = await scrapeSeed(seed);
        console.log(`Seed ${seed} sum = ${result}`);
        grandTotal += result;
    }

    console.log("=================================");
    console.log("FINAL TOTAL:", grandTotal);
})();
