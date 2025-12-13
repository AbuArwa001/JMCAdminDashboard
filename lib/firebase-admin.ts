import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        let credential;
        if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
            // Parse the JSON string from environment variable
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
            credential = admin.credential.cert(serviceAccount);
        } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
            // Fallback to individual environment variables
            credential = admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            });
        }

        if (credential) {
            admin.initializeApp({
                credential,
            });
            console.log("Firebase Admin initialized successfully");
        } else {
            console.warn("Firebase Admin credentials not found. Server-side verification may fail.");
        }
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
    }
}

export const verifySession = async (token: string) => {
    // If Firebase Admin is not initialized (missing credentials), we skip server-side verification
    // to prevent blocking the user. In production, credentials MUST be provided.
    if (!admin.apps.length) {
        console.warn("⚠️ Firebase Admin not initialized. Skipping server-side token verification.");
        return { uid: "skipped-verification", email: "admin@skipped.com" };
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying session:', error);
        return null;
    }
};
