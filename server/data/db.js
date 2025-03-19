import { initializeApp } from 'firebase/app';
import { getFirestore as getClientFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp as initializeAdminApp, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';


async function initializeAdmin() {
    const serviceAccount = await import('../movie-picker-b78ad-firebase-adminsdk-fbsvc-a8c16c0834.json', {
        assert: { type: 'json' }
    });
    initializeAdminApp({
        credential: cert(serviceAccount.default)
    });
}

await initializeAdmin();

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
}

const firebaseApp = initializeApp(firebaseConfig);
const db = getClientFirestore(firebaseApp);
const adminDb = getAdminFirestore();

export default adminDb;