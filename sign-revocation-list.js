const crypto = require('crypto');
const fs = require('fs');

// Generate keys once: openssl genpkey -algorithm ed25519 -out private.pem
// Get public: openssl pkey -in private.pem -pubout -out public.pem

const privateKey = fs.readFileSync('private.pem', 'utf8');

function signRevocationList(revokedLicenses) {
    const data = JSON.stringify(revokedLicenses);
    const signer = crypto.createSign('sha256');
    signer.update(data);
    signer.end();
    
    const signature = signer.sign(privateKey, 'base64');
    
    return {
        data: data,
        signature: signature,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
}

// Example: Add a revoked license
const revoked = ['TEST-LICENSE-123', 'PIRATED-456'];
const signedList = signRevocationList(revoked);

fs.writeFileSync('revoked.json', JSON.stringify(signedList, null, 2));
console.log('Signed revocation list created!');
