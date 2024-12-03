const puppeteer = require('puppeteer');

const extensionPath = '~/cmu/Cylab-JSBundle/LibraryDetector';
const extensionId = 'ebfapkkkphogjknioohflehbelaednlk';
// const extensionPath = '~/Downloads/PTdetector-main';
// const extensionId = 'eaghmajgemdmjgngankjclbneojhdpaj';

const port = 9000;

function parseLibraries(libs) {
    if (libs.length === 0) {
        return [];
    }
    var libkeys = [];
    libs = libs.split(',');
    for (var i=0; i<libs.length; i++) {
        var libdata = libs[i].split(':');
        libkeys.push({
            name: libdata[0],
            version: libdata[1]
        });
    }
    return libkeys;
}

const LDC = (async () => {

    const browser = await puppeteer.launch({
    executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
    headless: false, // Extensions won't work in headless mode
    args: [
        '--enable-features=ExtensionsManifestV2', // Enable Manifest V2 extensions
        '--disable-features=ExtensionsManifestV3', // Disable Manifest V3  
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
    ]
    });
    // visit a page
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`);

    // Increased wait time and added more logging
    await new Promise(resolve => setTimeout(resolve, 2000)); // Give some time for extension to load

    // get page content
    const content = await page.content();

    // get page element with id
    const librariesContent = await page.evaluate(() => {
        const element = document.getElementById('d41d8cd98f00b204e9800998ecf8427e_lib_detect');
        return element.content ? element.content : null;
    });

    console.log('detected-lib-LDC: ', parseLibraries(librariesContent));

    await browser.close();
});

LDC();