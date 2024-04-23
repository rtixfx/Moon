const spawn = require('child_process').spawn;
process.stdin.resume();
const axios = require('axios');
const download = require('download');
const admZip = require('adm-zip');
const fs = require('fs');

const startMainProcess = async () => {
    const main = spawn('npx', ['--yes', 'ts-node', '-r', 'tsconfig-paths/register', './src/index.ts'], {
        shell: true,
        stdio: 'inherit',
        stdin: 'inherit',
        stdout: 'inherit',
        stderr: 'inherit',
    });
    main.on('exit', (code) => {
        console.log('Restarting main process...');
        startMainProcess();
    });
}
startMainProcess();