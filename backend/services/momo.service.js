// services/momo.service.js
const crypto = require('crypto');
const axios = require('axios');
const momoConfig = require('../config/momo.config');

class MomoService {
  static createSignature(rawSignature) {
    return crypto
      .createHmac('sha256', momoConfig.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex');
  }

  static async createPayment(orderInfo) {
    const {
      courseId,
      amount,
      orderId,
      requestId,
      userId,
    } = orderInfo;

    const rawSignature = [
      'accessKey=' + momoConfig.MOMO_ACCESS_KEY,
      'amount=' + amount,
      'extraData=',
      'ipnUrl=' + momoConfig.MOMO_IPN_URL,
      'orderId=' + orderId,
      'orderInfo=' + `Payment for course ${courseId}`,
      'partnerCode=' + momoConfig.MOMO_PARTNER_CODE,
      'redirectUrl=' + momoConfig.MOMO_REDIRECT_URL,
      'requestId=' + requestId,
      'requestType=captureWallet'
    ].join('&');

    const signature = this.createSignature(rawSignature);

    const requestBody = {
      partnerCode: momoConfig.MOMO_PARTNER_CODE,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: `Payment for course ${courseId}`,
      redirectUrl: momoConfig.MOMO_REDIRECT_URL,
      ipnUrl: momoConfig.MOMO_IPN_URL,
      lang: "vi",
      extraData: "",
      requestType: "captureWallet",
      signature: signature,
    };

    try {
      const response = await axios.post(momoConfig.MOMO_ENDPOINT, requestBody);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create MoMo payment: ' + error.message);
    }
  }

  static verifySignature(receivedSignature, rawSignature) {
    const calculatedSignature = this.createSignature(rawSignature);
    return calculatedSignature === receivedSignature;
  }
}

module.exports = MomoService;