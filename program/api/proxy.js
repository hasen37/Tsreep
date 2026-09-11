
export default async function handler(req, res) {
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
        const arrayBuffer = await response.arrayBuffer();
        res.send(Buffer.from(arrayBuffer));
    } catch (err) {
        res.status(500).send('Proxy error: ' + err.message);
    }
}
