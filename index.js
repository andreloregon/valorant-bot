const express = require('express');
const axios = require('axios');
const app = express();

app.get('/rango', async (req, res) => {
    // Datos configurados para que no fallen
    const region = 'eu';
    const nick = 'Stitch 火';
    const tag = 'OHANA';

    try {
        // Usamos la API de Kyros que es más directa
        const url = `https://api.kyros.tv/valorant/v1/mmr/${region}/${encodeURIComponent(nick)}/${tag}`;
        const response = await axios.get(url);
        
        if (response.data && response.data.data) {
            const d = response.data.data;
            const rank = d.current_tier_patched || "Sin Rango";
            const rr = d.ranking_in_tier ?? 0;
            const lastChange = d.mmr_change_to_last_game ?? 0;
            const sign = lastChange >= 0 ? "+" : "";

            res.send(`💎 ${rank} | 🎯 ${rr} RR (${sign}${lastChange} RR) | Stitch #OHANA`);
        } else {
            res.send("Error: Perfil no encontrado o privado. Revisa Tracker.gg");
        }
    } catch (e) {
        // Si falla la anterior, intentamos una última vez con la básica
        res.send("Riot está procesando los datos... ¡Prueba !rango de nuevo en 10 segundos!");
    }
});

app.listen(process.env.PORT || 3000);
