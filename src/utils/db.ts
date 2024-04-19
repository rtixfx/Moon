import mysql from 'mysql';
import {
    config
} from '@/index';

function parseJDBC(jdbcString: string) {
    jdbcString = decodeURIComponent(jdbcString)
    const user = jdbcString.split('//')[1].split(':')[0].split('@')[0];
    const password = jdbcString.split('//')[1].split(':')[1].split('@')[0];
    const host = jdbcString.split('@')[1].split(':')[0];
    const port = jdbcString.split('@')[1].split(':')[1].split('/')[0];
    const database = jdbcString.split('@')[1].split('/')[1];

    const jdbcJson = {
        host: host,
        port: port,
        user: user,
        password: password,
        database: database
    };
    return jdbcJson;
}

const connection = mysql.createConnection(parseJDBC(config.database) as any) as any;

connection.qr = connection.query;
connection.query = (query: string, values: any) => {
    return new Promise((resolve, reject) => {
        connection.qr(query, values, (err: any, results: any) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    connect()
                }
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}



const connect = () => connection.connect((err: any) => {
    if (err) {
        console.error('An error occurred while connecting to the database:', err);
        connect()
    } else {
        console.log('Successfully connected to the database.');
    }
});
connect()
setInterval(() => {
    connection.ping();
}, 30000);

export default connection;