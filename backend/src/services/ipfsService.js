let ipfsConfig = null;

async function initializeIPFS() {
  console.log('IPFS service running in mock mode');
  ipfsConfig = { mockMode: true };
  return true;
}

async function uploadJSON(data) {
  const mockHash = 'Qm' + Math.random().toString(36).substring(2, 15);
  return mockHash;
}

async function storeUserProfile(userData) {
  const hash = await uploadJSON(userData);
  return hash;
}

async function storeEventData(eventData) {
  const hash = await uploadJSON(eventData);
  return hash;
}

function getGatewayUrl(hash) {
  return hash ? 'https://ipfs.infura.io/ipfs/' + hash : null;
}

module.exports = { initializeIPFS, uploadJSON, storeUserProfile, storeEventData, getGatewayUrl };
