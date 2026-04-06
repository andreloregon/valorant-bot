const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    // Tu ID único de Riot (PUUID)
    const puuid = "9d85c932-4820-c060-09c3-668636d4df1b"; 

    try {
        // Usamos la API de 'Henrik' versión v2 (es la más estable ahora)
        const url = `https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr/eu/${puuid}`;
        const response = await axios.get(url);
        const d = response.data.data;
        
        const current = d.current_data;
        if (current && current.currenttierpatched) {
            const rank = current.currenttierpatched;
            const rr = current.ranking_in_tier;
            const lastChange = current.mmr_change_to_last_game;
            const sign = lastChange >= 0 ? "+" : "";
            
            res.send(`💎 ${rank} | 🎯 ${rr} RR (${sign}${lastChange}) | Stitch #OHANA`);
        } else {
            res.send("Stitch, entra al juego y juega un Deathmatch para que Riot actualice tu rango.");
        }
    } catch (e) {
        // SI FALLA LA ANTERIOR, ESTA ES LA RUTA DE EMERGENCIA "BRUTA"
        try {
            const backupUrl = `https://api.kyros.tv/valorant/v1/mmr/eu/by-puuid/${puuid}`;
            const backupResp = await axios.get(backupUrl);
            const b = backupResp.data.data;
            res.send(`💎 ${b.current_tier_patched} | 🎯 ${b.ranking_in_tier} RR | Stitch #OHANA`);
        } catch (err) {
            res.send("Riot está en mantenimiento. ¡Intenta !rango en unos minutos!");
        }
    }
});

app.listen(process.env.PORT || 3000);
