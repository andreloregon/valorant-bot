const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    // Configuración fija para tu cuenta de España
    const region = 'eu';
    const nick = 'Stitch 火';
    const tag = 'OHANA';

    try {
        // Esta URL codifica automáticamente los símbolos raros
        const url = `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${encodeURIComponent(nick)}/${tag}`;
        const response = await axios.get(url);
        
        if (response.data && response.data.data) {
            const data = response.data.data;
            const rank = data.currenttierpatched || "Sin Rango";
            const rr = data.ranking_in_tier ?? 0;
            const lastChange = data.mmr_change_to_last_game ?? 0;
            const winLoss = lastChange >= 0 ? "🟢 Win" : "🔴 Loss";
            const sign = lastChange >= 0 ? "+" : "";

            res.send(`💎 ${rank} | 🎯 ${rr} RR (${sign}${lastChange}) | ${winLoss}`);
        } else {
            res.send("Error: No se encontraron datos. ¿Jugaste competitivas?");
        }
    } catch (e) {
        // Si falla, intentamos decir por qué
        res.send("Error: El servidor de Riot no responde. Intenta de nuevo en 1 minuto.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
