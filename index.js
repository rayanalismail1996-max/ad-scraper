const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/scrape-ads', async (req, res) => {
    const keyword = req.query.q || 'shopify';
    const country = req.query.country || 'SA';
    const language = req.query.lang || 'ar';
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!makeWebhookUrl) {
        return res.status(500).json({ error: "Missing MAKE_WEBHOOK_URL environment variable" });
    }

    try {
        // Meta Ad Library public query endpoint
        const metaApiUrl = `https://facebook.com{process.env.META_ACCESS_TOKEN}&search_terms=${encodeURIComponent(keyword)}&ad_reached_countries=['${country}']&languages=['${language}']&fields=ad_creative_body,ad_creative_link_caption_title&limit=10`;
        
        const response = await fetch(metaApiUrl);
        const adData = await response.json();

        // Pushes the found ads directly into your Make scenario webhook
        await fetch(makeWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ads: adData.data || [] })
        });

        res.json({ status: "Data forwarded to Make Webhook successfully!", count: adData.data?.length || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Free ad-scraper running safely on port ${PORT}`));
