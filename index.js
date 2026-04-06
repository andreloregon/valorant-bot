const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    // Tu PUUID (DNI de Riot)
    const puuid = "9d85c932-4820-c060-09c3-668636d4df1b"; 

    try {
        // Probamos con la API de "Solo Rangos" (v1)
        const url = `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/eu/${puuid}`;
        const response = await axios.get(url);
        const d = response.data.data;
        
        if (d && d.currenttierpatched) {
            res.send(`💎 ${d.currenttierpatched} | 🎯 ${d.ranking_in_tier} RR | Stitch #OHANA`);
        } else {
            res.send("Stitch, abre el Valorant un momento para refrescar tu rango.");
        }
    } catch (e) {
        // SI LA PRIMERA FALLA, USAMOS LA RUTA DE "DATOS COMPLETOS" (v2)
        try {
            const url2 = `https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr/eu/${puuid}`;
            const res2 = await axios.get(url2);
            const d2 = res2.data.data.current_data;
            res.send(`💎 ${d2.currenttierpatched} | 🎯 ${d2.ranking_in_tier} RR | Stitch #OHANA`);
        } catch (err) {
            res.send("La base de datos de Riot está saturada. ¡Reintenta en 10 segundos!");
        }
    }
});

app.listen(process.env.PORT || 3000);
