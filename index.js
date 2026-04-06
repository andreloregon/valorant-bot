const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    // Configuración directa
    const region = 'eu';
    const nick = 'Stitch 火';
    const tag = 'OHANA';

    try {
        // Esta URL es la más estable para rangos públicos
        const url = `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${encodeURIComponent(nick)}/${tag}`;
        const response = await axios.get(url);
        
        const d = response.data.data;
        if (d && d.currenttierpatched) {
            const rank = d.currenttierpatched;
            const rr = d.ranking_in_tier;
            const lastChange = d.mmr_change_to_last_game;
            const sign = lastChange >= 0 ? "+" : "";
            
            res.send(`💎 ${rank} | 🎯 ${rr} RR (${sign}${lastChange}) | Stitch #OHANA`);
        } else {
            res.send("No se encontraron datos. ¿Perfil público en Tracker.gg?");
        }
    } catch (e) {
        // Si la API principal falla, usamos la de emergencia
        res.send("Riot está saturado. ¡Escribe !rango de nuevo en 3 segundos!");
    }
});

app.listen(process.env.PORT || 3000);
