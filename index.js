const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    // Configuración absoluta para tu cuenta
    const region = 'eu';
    const nick = 'Stitch 火';
    const tag = 'OHANA';

    try {
        // Probamos con la API de respaldo de Kyros que es más estable para caracteres especiales
        const url = `https://api.kyros.tv/valorant/v1/mmr/${region}/${encodeURIComponent(nick)}/${tag}`;
        const response = await axios.get(url, { timeout: 5000 }); // Tiempo de espera de 5 segundos
        
        const d = response.data.data;
        if (d && d.current_tier_patched) {
            const rank = d.current_tier_patched;
            const rr = d.ranking_in_tier;
            const lastChange = d.mmr_change_to_last_game;
            const sign = lastChange >= 0 ? "+" : "";
            
            res.send(`💎 ${rank} | 🎯 ${rr} RR (${sign}${lastChange} RR) | Stitch #OHANA`);
        } else {
            res.send("Error: Perfil no encontrado. ¿Has jugado competitivas este episodio?");
        }
    } catch (e) {
        // Si falla la primera, intentamos la ruta de emergencia de Henrik
        try {
            const url2 = `https://api.henrikdev.xyz/valorant/v1/mmr/eu/${encodeURIComponent(nick)}/OHANA`;
            const resp2 = await axios.get(url2);
            const d2 = resp2.data.data;
            res.send(`💎 ${d2.currenttierpatched} | 🎯 ${d2.ranking_in_tier} RR | Stitch #OHANA`);
        } catch (err) {
            res.send("Riot está saturado. ¡Escribe !rango en 10 segundos para forzar la lectura!");
        }
    }
});

app.listen(process.env.PORT || 3000);
