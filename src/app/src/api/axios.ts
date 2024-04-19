import a from 'axios';

const axios = a.create({
    baseURL: '/api/miactyl',
    timeout: 10000,
    timeoutErrorMessage: 'Request timed out',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axios;