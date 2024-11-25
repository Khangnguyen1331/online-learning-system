// config/momo.config.js
require('dotenv').config();

module.exports = {
  MOMO_PARTNER_CODE: process.env.MOMO_PARTNER_CODE,
  MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY,
  MOMO_SECRET_KEY: process.env.MOMO_SECRET_KEY,
  MOMO_ENDPOINT: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  MOMO_REDIRECT_URL: process.env.FRONTEND_URL + '/payment/result',
  MOMO_IPN_URL: process.env.BACKEND_URL + '/api/payments/momo/ipn',
};