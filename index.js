const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    const { region, nick, tag } = req.query;
    try {
        const response = await axios.get(`https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${nick}/${tag}`);
        const data = response.data.data;
        const rank = data.currenttierpatched;
        const rr = data.ranking_in_tier;
        const lastChange = data.mmr_change_to_last_game;
        const winLoss = lastChange >= 0 ? "🟢 Win" : "🔴 Loss";
        const sign = lastChange >= 0 ? "+" : "";

        res.send(`💎 ${rank} | 🎯 ${rr} RR (${sign}${lastChange}) | 🛡️ 1 | ${winLoss}`);
    } catch (e) {
        res.send("Error: Revisa que tu perfil sea público y los datos correctos.");
    }
});

app.listen(process.env.PORT || 3000);
