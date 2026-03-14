const dns = require('node:dns');
const mongoose = require('mongoose');

const normalizeMongoUri = (uri) => {
  if (!uri) return '';
  const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.+)$/);
  if (!match) return uri;
  const [, protocol, remainder] = match;
  const atIndex = remainder.lastIndexOf('@');
  if (atIndex === -1) return uri;
  const credentials = remainder.slice(0, atIndex);
  const host = remainder.slice(atIndex + 1);
  const colonIndex = credentials.indexOf(':');
  if (colonIndex === -1) return uri;
  const username = credentials.slice(0, colonIndex);
  const password = credentials.slice(colonIndex + 1);
  const norm = (v) => encodeURIComponent(decodeURIComponent(v));
  return `${protocol}${norm(username)}:${norm(password)}@${host}`;
};

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');

  const dnsServers = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (dnsServers.length) dns.setServers(dnsServers);

  const conn = await mongoose.connect(normalizeMongoUri(process.env.MONGODB_URI));
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
