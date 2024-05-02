require('dotenv').config();
const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Pool } = require('pg');

async function downloadFTP() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            port: process.env.FTP_PORT,
            secure: false
        });

        const remoteFiles = await client.list();

        const folder = process.env.FOLDER_DAT;

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }

        for (const file of remoteFiles) {
            if (file.isFile && file.name.endsWith('.dat')) {
                const rutaLocal = path.join(folder, file.name);
                await client.downloadTo(rutaLocal, file.name);
                console.log(`Archivo ${file.name} descargado.`);
            }
        }
        console.log('Todos los archivos .dat han sido descargados.');
    } catch (error) {
        console.error('Error al descargar archivos desde el servidor FTP:', error);
    } finally {
        client.close();
    }
}

async function getLastRecord(client, frequency, station) {
    const query = `SELECT MAX(timestamp)
                   FROM stations
                   WHERE frequency = '${frequency}'
                   AND station = '${station}'`;
    const timestamp = await client.query(query);
    return timestamp ? timestamp.rows[0].max : null;
}

async function processDATStations() {
    const folder = process.env.FOLDER_DAT;
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });
    try {
        const client = await pool.connect();
        const files = await fs.promises.readdir(folder);
        const filesDat = files.filter(file => file.endsWith('.dat'));
        const promises = [];

        for (const file of filesDat) {
            const pathFile = path.join(folder, file);
            const matches = file.match(/WStn_(\d+)_WeathDat(\w+).dat/);
            if (!matches || matches.length !== 3) {
                console.error(`Nombre de archivo no válido: ${file}`);
                continue;
            }
            const station = `WStn_${matches[1]}`;
            const frequency = matches[2] === 'Day' ? '24hs' : matches[2];

            const lastRecord = await getLastRecord(client, frequency, station);

            const promise = new Promise((resolve, reject) => {
                let lineCount = 0;
                fs.createReadStream(pathFile)
                    .pipe(csv({
                        mapHeaders: ({ header, index }) => header.toLowerCase(),
                        skipLines: 1
                    }))
                    .on('data', async (row) => {
                        lineCount++;
                        row.station = station;
                        row.frequency = frequency;
                        if (lineCount > 2 && new Date(row.timestamp) > new Date(lastRecord)) {
                            try {
                                const query = {
                                    text: `INSERT INTO stations(${Object.keys(row).join(', ')}) VALUES(${Object.values(row).map((value, index) => `$${index + 1}`).join(', ')})`,
                                    values: Object.values(row)
                                };
                                await client.query(query);
                            } catch (error) {
                                console.error('Error al insertar fila:', error);
                            }
                        }
                    })
                    .on('end', () => {
                        console.log(`Archivo ${file} procesado`);
                        resolve();
                    })
                    .on('error', (error) => {
                        console.error(`Error al procesar archivo ${file}:`, error);
                        reject(error);
                    })
                    .on('close', () => {
                        console.log(`Stream para el archivo ${file} cerrado`);
                    });
            });
            promises.push(promise);
        }

        await Promise.all(promises);
        console.log('Todos los archivos DAT han sido procesados.');
        await client.release();
    } catch (error) {
        console.error('Error al procesar los archivos DAT:', error);
    }
}


async function main() {
    console.log('-- Starting --');

    /* Get Stations Data */
    await downloadFTP();
    /* Process stations data*/
    await processDATStations();

    console.log('-- Finished --');
}

main()