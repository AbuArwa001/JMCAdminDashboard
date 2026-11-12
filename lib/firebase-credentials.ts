import * as admin from 'firebase-admin';

export function getFirebaseCredential() {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        let serviceAccount;
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        } catch {
            serviceAccount = JSON.parse(
                process.env.FIREBASE_SERVICE_ACCOUNT_JSON.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
            );
        }
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        return admin.credential.cert(serviceAccount);
    }
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        return admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
    }
    return null;
}

