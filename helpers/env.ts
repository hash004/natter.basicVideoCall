export default class Env {
  static readonly BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  static readonly APP_ID = process.env.APP_ID || 'testAppId';
  static readonly APP_TOKEN = process.env.APP_TOKEN || 'testAppToken';
  static readonly CHANNEL_NAME = process.env.CHANNEL_NAME || 'testChannel';
  static readonly USER_ID = process.env.USER_ID || '123456';
}