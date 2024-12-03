const puppeteer = require('puppeteer');

const extensionPath = '~/Downloads/PTdetector-main';
const extensionId = 'eaghmajgemdmjgngankjclbneojhdpaj';
const port = 9000;

const PTdetector = (async () => {

    const browser = await puppeteer.launch({
    headless: false, // Extensions won't work in headless mode
    args: [        
        // `--headless=new`,
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`
    ]
    });

    // // visit a page
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`);

    const workerTarget = await browser.waitForTarget(
        target =>     
        target.type() === 'service_worker' &&
        target.url().endsWith('background.js'));    
    
    // Get access to the background page of the extension

    const worker = await workerTarget.worker();

    // Open a popup (available for Canary channels).
    await worker.evaluate('chrome.action.openPopup();');

    const popupTarget = await browser.waitForTarget(
        target => target.type() === 'page' 
        && target.url().startsWith(`chrome-extension://${extensionId}/`)
        && target.url().endsWith('.html')
      );      

    // Use evaluateHandle instead of page()
    const popupHandle = await popupTarget.createCDPSession();

    const buttonId = 'dt_btn'; 
    await popupHandle.send('Runtime.evaluate', {
    expression: `document.getElementById('${buttonId}').click()`
    });

    const elementId = 'result';
    const intervalMs = 500;
    const timeoutMs = 5000;
    const runTimeDetect = await popupHandle.send('Runtime.evaluate', {
        expression: `
          new Promise((resolve, reject) => {
            const targetElement = document.getElementById('${elementId}');
            if (!targetElement) {
              reject(new Error('Element not found'));
              return;
            }
      
            let initialHtml = targetElement.innerHTML;
            const startTime = Date.now();
      
            const checkForChanges = () => {
              const currentHtml = targetElement.innerHTML;
              if (currentHtml !== initialHtml) {
                resolve(currentHtml);
                return;
              }
      
              if (Date.now() - startTime >= ${timeoutMs}) {
                resolve(currentHtml); // Resolve with current content if timeout reached
                return;
              }
      
              setTimeout(checkForChanges, ${intervalMs});
            };
      
            checkForChanges();
          })
        `,
        awaitPromise: true
      });
      

    const res = await popupHandle.send('Runtime.evaluate', {
        expression: `document.getElementById('${elementId}').innerHTML`
    });

    console.log('detected-lib-PT: ', res.result.value);

    // Close the browser
    await browser.close();
});

PTdetector();