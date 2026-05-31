const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/scrape-ads', async (req, res) => {
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!makeWebhookUrl) {
        return res.status(500).json({ error: "Missing MAKE_WEBHOOK_URL" });
    }

    // Hardcoded mock data to instantly train your Make Scenario
    const mockAds = [
        { ad_creative_body: "إعلان تجريبي لمتجر شوبيفاي - احصل على خصم 50% اليوم" },
        { ad_creative_body: "تسوق أفضل المنتجات المحلية في السعودية التوصيل سريع" }
    ];

    try {
        await fetch(makeWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ads: mockAds })
        });
        res.json({ status: "Success", message: "Mock data injected into Make!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server ready`)running safely on port ${PORT}`));
