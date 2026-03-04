export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { price } = req.body;
        const SAFEPAY_SECRET = 'sec_ff8d1e70-6082-471e-9d29-a0f3faf41161';

        // For testing, change to 'sandbox.api.getsafepay.com' and 'sandbox' if needed
        const apiUrl = 'https://api.getsafepay.com/order/v1/init';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SFPY-MERCHANT-SECRET': SAFEPAY_SECRET
            },
            body: JSON.stringify({
                client: SAFEPAY_SECRET,
                amount: parseFloat(price),
                currency: 'PKR',
                environment: 'production'
            })
        });

        const data = await response.json();

        if (data && data.data && data.data.token) {
            return res.status(200).json({ token: data.data.token });
        } else {
            console.error('Safepay error:', data);

            // Fallback to sandbox just in case the key is a sandbox key
            const sandboxResponse = await fetch('https://sandbox.api.getsafepay.com/order/v1/init', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-SFPY-MERCHANT-SECRET': SAFEPAY_SECRET
                },
                body: JSON.stringify({
                    client: SAFEPAY_SECRET,
                    amount: parseFloat(price),
                    currency: 'PKR',
                    environment: 'sandbox'
                })
            });
            const sandboxData = await sandboxResponse.json();

            if (sandboxData && sandboxData.data && sandboxData.data.token) {
                return res.status(200).json({ token: sandboxData.data.token, environment: 'sandbox' });
            }

            return res.status(500).json({ error: 'Failed to generate token from Safepay', details: data });
        }
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
