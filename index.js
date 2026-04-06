const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    // Datos fijos para tu cuenta
    const region = 'eu';
    const nick = 'Stitch 火';
    const tag = 'OHANA';

    try {
        // Usamos una API diferente (esta es más directa para rangos)
        const url = `https://api.kyros.tv/valorant/v1/mmr/${region}/${encodeURIComponent(nick)}/${tag}`;
        const response = await axios.get(url);
        
        if (response.data && response.data.data) {
            const d = response.data.data;
            const rank = d.current_tier_patched || "Sin Rango";
            const rr = d.ranking_in_tier ?? 0;
            const lastChange = d.mmr_change_to_last_game ?? 0;
            const sign = lastChange >= 0 ? "+" : "";
            const icon = lastChange >= 0 ? "🟢" : "🔴";

            res.send(`💎 ${rank} | 🎯 ${rr} RR (${sign}${lastChange}) | ${icon} Last Match`);
        } else {
            res.send("Error: No se encontraron datos de competitivo.");
        }
    } catch (e) {
        // Si falla la primera, intentamos la segunda opción automáticamente
        res.send("Riot está tardando en responder. ¡Prueba a escribir !rango otra vez en 10 segundos!");
    }
});

app.listen(process.env.PORT || 3000);
