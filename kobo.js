require('dotenv').config();
const fetch = require('node-fetch');
const { Pool } = require('pg');


async function getDataFromKoboToolbox(dateFrom) {
    const projectId = process.env.PROJECT_ID;
    const apiKey = process.env.API_TOKEN;

    if (!dateFrom) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        dateFrom = yesterday.toISOString().slice(0, 10);
    }

    const apiUrl = `https://kf.kobotoolbox.org/api/v2/assets/${projectId}/data?format=json&query={"_submission_time":{"$gt":"${dateFrom}"}}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${apiKey}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.results;
        } else {
            throw new Error('Error al obtener los datos de KoboToolbox:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function saveDataToDatabase(data) {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    try {
        const client = await pool.connect();
        for (const item of Object.values(data)) {
            const query = `
                INSERT INTO vuelos (id, id_vuelo, data, lugar, area_vuelo, created_at, updated_at)
                VALUES             ($1, $2, $3, ST_SetSrid(ST_POINT($4, $5), 4326), ST_SetSrid(ST_PolygonFromText($6), 4326), NOW(), NOW())
                ON CONFLICT (id) DO UPDATE
                SET
                    id_vuelo = $2,
                    data = $3,
                    lugar = ST_SetSrid(ST_POINT($4, $5), 4326),
                    area_vuelo = ST_SetSrid(ST_PolygonFromText($6),4326),
                    updated_at = NOW();`;
            let poligonoWKT = null;
            if (item.areav) {
                const coordenadas = item.areav.split(";").map(coordenada => coordenada.split(" ").slice(0, 2));
                const puntos = coordenadas.map(coordenada => coordenada.map(parseFloat).reverse());
                poligonoWKT = `POLYGON((${puntos.map(p => p.join(" ")).join(",")}))`;
            }
            await client.query(query,
                [item._id, item.id_vuelo, item, item._geolocation[0], item._geolocation[1], poligonoWKT]
            );
        }
        client.release();
        console.log('Datos guardados en la base de datos exitosamente.');
    } catch (error) {
        console.error('Error al guardar los datos en la base de datos:', error);
    } finally {
        await pool.end();
    }
}

async function main() {
    const now = new Date().toString();
    console.log(`-- Starting [${now}]--`);
    const dateFromIndex = process.argv.indexOf('--date_from');
    const dateFrom = dateFromIndex !== -1 ? process.argv[dateFromIndex + 1] : null;

    /* Get KoboToolbox Data */
    await getDataFromKoboToolbox(dateFrom)
    .then(data => {
        saveDataToDatabase(data);
    }).catch(error => {
        console.error('Error al obtener los datos:', error);
    });

    console.log('-- Finished --');
}

main()