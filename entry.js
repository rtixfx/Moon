const spawn = require('child_process').spawn;
process.stdin.resume();
const axios = require('axios');
const download = require('download');
const admZip = require('adm-zip');

const startMainProcess = async () => {
    console.log('Checking for updates...')
    const ver = await axios.get('https://raw.githubusercontent.com/misalibaytb/miactyl/latest-stable/package.json')
    if (ver.data.version != require('./package.json').version) {
        console.log('New version available. Updating...');
        await download('https://codeload.github.com/misalibaytb/miactyl/zip/refs/heads/latest-stable', './', { filename: 'latest-stable.zip' })
        console.log('Downloaded latest stable version. Updating...');
        const backup = new admZip();
        backup.addLocalFolder('./src');
        backup.writeZip('backup.zip');
        const zip = new admZip('latest-stable.zip');
        zip.extractAllTo('./', true);
        require('fs').unlinkSync('latest-stable.zip');
        console.log('Updated to latest stable version. Restarting main process...');
        startMainProcess();
        return;
    }
    console.log('No updates found. Starting main process...');


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