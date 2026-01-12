// Add this to your extension
import { GitHubAudit } from './github-audit.js';

async function secureLicenseActivation(licenseKey) {
    const audit = new GitHubAudit();
    
    // 1. Check if license is revoked
    const isRevoked = await audit.checkRevocation(licenseKey);
    if (isRevoked) {
        await audit.logActivation(licenseKey, 'unknown', 'revoked_attempt');
        throw new Error('This license has been revoked by the developer.');
    }
    
    // 2. Get device ID
    const deviceId = await getDeviceFingerprint();
    
    // 3. Log activation attempt
    await audit.logActivation(licenseKey, deviceId, 'activation_attempt');
    
    // 4. Your existing Gumroad verification
    const gumroadResult = await verifyWithGumroad(licenseKey);
    
    if (gumroadResult.success) {
        // 5. Log successful activation
        await audit.logActivation(licenseKey, deviceId, 'activated', {
            seats: gumroadResult.seats,
            maxSeats: gumroadResult.maxSeats
        });
    } else {
        // 6. Log failed attempt
        await audit.logActivation(licenseKey, deviceId, 'failed_activation', {
            reason: gumroadResult.reason
        });
    }
    
    return gumroadResult;
}
