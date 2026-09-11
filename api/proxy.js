export default async function handler(req, res) {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await fetch(videoUrl, {
            redirect: 'follow',
            headers: {
                'Referer': 'https://iframe.mediadelivery.net/',
                'Origin': 'https://iframe.mediadelivery.net',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        // نسخ الترويسات مع السماح بالتحكم بالعرض
        response.headers.forEach((v, k) => {
            if (k.toLowerCase() !== 'content-security-policy' && k.toLowerCase() !== 'x-frame-options') {
                res.setHeader(k, v);
            }
        });
        
        res.status(response.status);
        const contentType = response.headers.get('content-type') || '';

        // إذا كانت الصفحة HTML، نقوم بتعديل الروابط الداخلية لتمر عبر البروكسي الخاص بك
        if (contentType.includes('text/html')) {
            let html = await response.text();
            
            // حقن قاعدة لتعديل مسارات الـ iframe أو الـ fetch الداخلية إن وجدت
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(html);
        } else {
            const arrayBuffer = await response.arrayBuffer();
            return res.send(Buffer.from(arrayBuffer));
        }

    } catch (err) {
        res.status(500).send('Proxy error: ' + err.message);
    }
}
