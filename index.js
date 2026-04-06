const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    const { region, nick, tag } = req.query;
    try {
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
            res.send("Error: No se encontraron datos. ¿Jugaste competitivas recientemente?");
        }
    } catch (e) {
        res.send("Error: Perfil privado o datos incorrectos.");
    }
});

app.listen(process.env.PORT || 3000);
