const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    // Usamos el nombre ya codificado para que Riot lo entienda sí o sí
    const region = 'eu';
    const nick = 'Stitch%20%E7%81%AB'; // Esto es "Stitch 火" en lenguaje de servidor
    const tag = 'OHANA';

    try {
        // Probamos con la API principal que es la más rápida
        const url = `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${nick}/${tag}`;
        const response = await axios.get(url);
        
        if (response.data && response.data.data) {
            const d = response.data.data;
            const rank = d.currenttierpatched || "Sin Rango";
            const rr = d.ranking_in_tier ?? 0;
            const lastChange = d.mmr_change_to_last_game ?? 0;
            const sign = lastChange >= 0 ? "+" : "";
            const icon = lastChange >= 0 ? "🟢" : "🔴";

            res.send(`💎 ${rank} | 🎯 ${rr} RR (${sign}${lastChange}) | ${icon} Last Match`);
        } else {
            res.send("Error: No se encontraron datos. ¿Jugaste competitivas?");
        }
    } catch (e) {
        // Si la primera falla, este mensaje nos avisará
        res.send("El servidor de Riot está saturado. ¡Reintenta el comando !rango en 5 segundos!");
    }
});

app.listen(process.env.PORT || 3000);
