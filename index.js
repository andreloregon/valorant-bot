const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    // Tu ID real que acabo de conseguir
    const puuid = "9d85c932-4820-c060-09c3-668636d4df1b"; 

    try {
        // Usamos la API de Henrik con una versión que suele estar menos saturada
        const url = `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/eu/${puuid}`;
        const response = await axios.get(url);
        const d = response.data.data;
        
        if (d && d.currenttierpatched) {
            const rank = d.currenttierpatched;
            const rr = d.ranking_in_tier;
            const lastChange = d.mmr_change_to_last_game;
            const sign = lastChange >= 0 ? "+" : "";
            
            res.send(`💎 ${rank} | 🎯 ${rr} RR (${sign}${lastChange}) | Stitch #OHANA`);
        } else {
            res.send("Stitch, el perfil parece estar privado. Ponlo público en Tracker.gg");
        }
    } catch (e) {
        // Si la primera falla, usamos la de reserva de Kyros
        try {
            const url2 = `https://api.kyros.tv/valorant/v1/mmr/eu/by-puuid/${puuid}`;
            const res2 = await axios.get(url2);
            const d2 = res2.data.data;
            res.send(`💎 ${d2.current_tier_patched} | 🎯 ${d2.ranking_in_tier} RR | Stitch #OHANA`);
        } catch (err) {
            res.send("Riot está saturado. ¡Escribe !rango de nuevo en 5 segundos!");
        }
    }
});

app.listen(process.env.PORT || 3000);
