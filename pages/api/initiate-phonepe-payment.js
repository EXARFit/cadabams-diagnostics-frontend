import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount, orderId } = req.body;

      // Replace with your actual PhonePe API endpoint and merchant details
      const phonePeApiUrl = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
      const merchantId = 'M227Y4NKN13VS';
      const saltKey = '493683dc-ca39-48e1-bbae-ce2b2af76675';
      const saltIndex = 1;

      const payload = {
        merchantId: merchantId,
        merchantTransactionId: orderId,
        amount: amount * 100, // PhonePe expects amount in paise
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status`,
        redirectMode: 'POST',
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe-callback`,
        mobileNumber: '9999999999', // Replace with actual user's mobile number
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const checksum = createChecksum(base64Payload, saltKey, saltIndex);

      const response = await axios.post(phonePeApiUrl, {
        request: base64Payload
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      });

      if (response.data.success) {
        res.status(200).json({ paymentUrl: response.data.data.instrumentResponse.redirectInfo.url });
      } else {
        throw new Error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('PhonePe payment initiation error:', error);
      res.status(500).json({ error: 'Failed to initiate payment' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function createChecksum(base64Payload, saltKey, saltIndex) {
  const crypto = require('crypto');
  const string = `${base64Payload}/pg/v1/pay${saltKey}`;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  return `${sha256}###${saltIndex}`;
}