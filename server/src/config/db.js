const dns = require("node:dns");
const mongoose = require("mongoose");

const normalizeMongoUri = (uri) => {
  if (!uri) {
    return "";
  }

  const protocolMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.+)$/);

  if (!protocolMatch) {
    return uri;
  }

  const [, protocol, remainder] = protocolMatch;
  const atIndex = remainder.lastIndexOf("@");

  if (atIndex === -1) {
    return uri;
  }

  const credentials = remainder.slice(0, atIndex);
  const host = remainder.slice(atIndex + 1);
  const colonIndex = credentials.indexOf(":");

  if (colonIndex === -1) {
    return uri;
  }

  const username = credentials.slice(0, colonIndex);
  const password = credentials.slice(colonIndex + 1);
  const normalizePart = (value) => encodeURIComponent(decodeURIComponent(value));

  return `${protocol}${normalizePart(username)}:${normalizePart(password)}@${host}`;
};

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from the environment");
  }

  const configuredDnsServers = (process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (configuredDnsServers.length) {
    dns.setServers(configuredDnsServers);
  }

  const connection = await mongoose.connect(normalizeMongoUri(process.env.MONGODB_URI));

  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;
