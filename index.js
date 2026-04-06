const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    // Definimos tus datos aquí dentro
    const region = 'eu';
    const nick = 'Stitch 火';
    const tag = 'OHANA';

    try {
        // Codificamos el nombre para que el símbolo 火 sea legible para el servidor
        const encodedNick = encodeURIComponent(nick);
        const url = `https://api.kyros.tv/valorant/v1/mmr/${region}/${encodedNick}/${tag}`;
        
        const response = await axios.get(url, { timeout: 10000 });
        const d = response.data.data;

        if (d && d.current_tier_patched) {
            const rank = d.current_tier_patched;
            const rr = d.ranking_in_tier;
            const lastChange = d.mmr_change_to_last_game;
            const sign = lastChange >= 0 ? "+" : "";
            
            res.send(`💎 ${rank} | 🎯 ${rr} RR (${sign}${lastChange}) | Stitch #OHANA`);
        } else {
            res.send("Perfil no encontrado. Mira si en Tracker.gg tu perfil es PÚBLICO.");
        }
    } catch (e) {
        // Si la primera falla, intentamos una segunda opción automáticamente
        try {
            const url2 = `https://api.henrikdev.xyz/valorant/v1/mmr/eu/Stitch%20%E7%81%AB/OHANA`;
            const res2 = await axios.get(url2);
            const d2 = res2.data.data;
            res.send(`💎 ${d2.currenttierpatched} | 🎯 ${d2.ranking_in_tier} RR | Stitch #OHANA`);
        } catch (err) {
            res.send("Riot está saturado. ¡Escribe !rango de nuevo en 5 segundos!");
        }
    }
});

app.listen(process.env.PORT || 3000);
