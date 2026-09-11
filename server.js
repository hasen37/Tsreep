const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/proxy', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await fetch(videoUrl, {
            headers: {
                'Referer': 'https://iframe.mediadelivery.net/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        response.headers.forEach((v, k) => {
            res.setHeader(k, v);
        });
        res.status(response.status);
        response.body.pipe(res);
    } catch (err) {
        res.status(500).send('Proxy error: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
