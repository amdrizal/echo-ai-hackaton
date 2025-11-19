const os = require('os');

function getNetworkIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return 'localhost';
}

const ip = getNetworkIP();
const port = process.env.PORT || 3000;
const apiVersion = process.env.API_VERSION || 'v1';

console.log('\n📱 Network Configuration for Mobile Development\n');
console.log('━'.repeat(60));
console.log(`\n🌐 Your Network IP: ${ip}`);
console.log(`\n📋 Add this to mobile/.env:`);
console.log(`\n   EXPO_PUBLIC_API_URL=http://${ip}:${port}/api/${apiVersion}`);
console.log('\n━'.repeat(60));
console.log('\n✅ Steps to connect your mobile device:');
console.log('   1. Make sure your phone/tablet is on the same WiFi network');
console.log('   2. Update mobile/.env with the URL above');
console.log('   3. Restart the Expo dev server (npx expo start)');
console.log('   4. Scan the QR code with Expo Go app\n');
