import cron from 'node-cron';
import axios from 'axios';
import {
    shared
} from '@/index';

const job = cron.schedule('*/5 * * * *', async () => {
    axios.get('https://raw.githubusercontent.com/misalibaytb/miactyl/latest-stable/package.json').then(async (res) => {
        const latest = res.data.version;
        const current = require('../../package.json').version;
        if (latest !== current) {
            shared.update = true;
        }
    });
})