const { spawn } = require('child_process');
const { path } = require('path');
const fs = require('fs');
const { dependencies } = require('webpack');

var detectedLib = {};
var missedLib = {};

var extension = 'PT';

// read argument
if(process.argv.length > 2){
    const extension_param = process.argv[2].toLowerCase();
    if (extension_param === 'pt' || extension_param === 'p'){
        extension = 'PT';
        console.log('Extension: PTdetector');
    }
    else if (extension_param === 'ldc' || extension_param === 'l'){
        extension = 'LDC';
        console.log('Extension: LDC');
    }
    else{
        console.error("Invalid argument. Please enter 'PT' or 'LDC'.");
        process.exit();
    }
}
else{
    console.log('No argument provided. Default extension is PT.');
}

// Usage in an async function
async function roundTest() {    

    // Set up server 
    const server = spawn('npm', ['run', 'start'])

    server.on('exit', (data) => {
        // console.log(`server process exited with code ${data}`);
        // resolve(data);
    });


    // Set up client
    var client;
    if(extension === 'PT'){
        client = spawn('node', ['./browser-client-PTdetector/index.js'])
    }
    else if(extension === 'LDC'){
        client = spawn('node', ['./browser-client-LDC/index.js'])
    }

    // Client handlers
    client.stdout.on('data', (data) => {        
        if(data.includes('detected-lib-PT:')){
            const clientDetectedLibArr = eval(data.toString().split('detected-lib-PT: ')[1].trim());
            for (var i of clientDetectedLibArr) detectedLib[i.split(':')[0].replace(/-/g, '').toLowerCase()] = '';
            console.log("PT detectedLib: ", detectedLib);
        }
        if(data.includes('detected-lib-LDC:')){
            const clientDetectedLibArr = eval(data.toString().split('detected-lib-LDC: ')[1].trim().replace(/-/g, '').toLowerCase());
            for(var i of clientDetectedLibArr) detectedLib[i.name] = '';
            console.log("LDC detectedLib: ", detectedLib);
        }
    });

    client.stderr.on('data', (data) => {
        console.error(`client: ${data}`);
    });

    function clientClosePromise(client, server) {
        return new Promise((resolve) => {
            client.on('close', (code) => {
                // console.log(`client process exited with code ${code}`);
                server.kill('SIGTERM');                
                resolve(code);
            });        
        });
    }
    
    const clientCloseAwait = await clientClosePromise(client, server);

    // read ground truth from Json file
    const packageJsonFile = fs.readFileSync('./package.json', 'utf8');
    const packageJson = JSON.parse(packageJsonFile);    
    var dependencies = packageJson['dependencies']
    for (const dep in packageJson['devDependencies']){ 
        if(dep.includes('webpack') === false){
            dependencies[dep] = packageJson['devDependencies'][dep];
        }
    }
    
    // read ground truth from report
    const reportFile = fs.readFileSync('./dist/report.json', 'utf8');
    const keys = Object.keys(dependencies);
    for (const key of keys){   
        if(reportFile.includes(key) === false){
            delete dependencies[key];
        }
    }
    for(const key of Object.keys(dependencies)){
        if(detectedLib[key] === undefined){
            missedLib[key] = dependencies[key];
        }
    }
    console.log("Ground truth: ", dependencies);
    console.log("Missed libraries: ", missedLib);
    console.log("Hit rate: ", ((Object.keys(dependencies).length - Object.keys(missedLib).length)/Object.keys(dependencies).length)*100, "%");
}
  
roundTest();
