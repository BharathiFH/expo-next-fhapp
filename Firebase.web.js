import firebase from 'firebase/compat/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, signOut } from 'firebase/auth';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import { getErrorMessage, isValidElement } from 't2sbasemodule/Utils/helpers';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { AppConfig, CO_FIREBASE_CONFIG_DEBUG, CO_FIREBASE_CONFIG_LIVE } from './CustomerApp/Utils/AppConfig';
import { LOGIN_TYPE } from './AppModules/AuthModule/Utils/AuthConstants';
import { isInAppBrowser } from './AppModules/BaseModule/GlobalAppHelper';
// import { initializeApp } from 'firebase/app';

import { getMessaging } from 'firebase/messaging';
import { register } from './fbserviceWorker';
const googleProvider = GoogleAuthProvider ? new GoogleAuthProvider() : null;
const facebookProvider = FacebookAuthProvider ? new FacebookAuthProvider() : null;
facebookProvider?.setCustomParameters({
    display: 'popup'
});

let config = {};
if (AppConfig.buildConfig.buildType === 'debug') {
    config = {
        apiKey: CO_FIREBASE_CONFIG_DEBUG.API_KEY,
        authDomain: CO_FIREBASE_CONFIG_DEBUG.AUTH_DOMAIN,
        databaseURL: CO_FIREBASE_CONFIG_DEBUG.DATABASE_URL,
        projectId: CO_FIREBASE_CONFIG_DEBUG.PROJECT_ID,
        storageBucket: CO_FIREBASE_CONFIG_DEBUG.STORAGE_BUCKET,
        messagingSenderId: CO_FIREBASE_CONFIG_DEBUG.MESSAGE_SENDER_ID,
        appId: CO_FIREBASE_CONFIG_DEBUG.APP_ID,
        measurementId: CO_FIREBASE_CONFIG_DEBUG.MEASUREMENT_ID
    };
} else {
    config = {
        apiKey: CO_FIREBASE_CONFIG_LIVE.API_KEY,
        authDomain: CO_FIREBASE_CONFIG_LIVE.AUTH_DOMAIN,
        databaseURL: CO_FIREBASE_CONFIG_LIVE.DATABASE_URL,
        projectId: CO_FIREBASE_CONFIG_LIVE.PROJECT_ID,
        storageBucket: CO_FIREBASE_CONFIG_LIVE.STORAGE_BUCKET,
        messagingSenderId: CO_FIREBASE_CONFIG_LIVE.MESSAGE_SENDER_ID,
        appId: CO_FIREBASE_CONFIG_LIVE.APP_ID,
        measurementId: CO_FIREBASE_CONFIG_LIVE.MEASUREMENT_ID
    };
}

export const socialLogin = async (LoginType) => {
    const auth = getAuth();
    let result, credential;
    try {
        switch (LoginType) {
            case LOGIN_TYPE.GOOGLE:
                result = await signInWithPopup(auth, googleProvider);
                credential = GoogleAuthProvider.credentialFromResult(result);
                break;
            case LOGIN_TYPE.FACEBOOK:
                result = await signInWithPopup(auth, facebookProvider);
                credential = FacebookAuthProvider.credentialFromResult(result);
                break;
            default:
                return;
        }
        return isValidElement(credential) ? credential : null;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        showErrorMessage(getErrorMessage(errorCode));
        // The email of the user's account used.
        const email = error?.email;
        return { code: errorCode, errorMessage, email };
    }
};

export const signOutUser = async () => {
    const auth = getAuth();
    signOut(auth)
        .then(() => {
            console.log('Account Signed-out');
        })
        .catch((error) => {
            console.log(error);
        });
};

const firebaseApp = firebase.initializeApp(config);
// export const analytics = isFoodhubDomain() ? firebase.analytics() : null;
export const analytics = null;

const messaging = !isInAppBrowser() ? getMessaging(firebaseApp) : null;

export { firebaseApp, config, messaging };

// Register service worker
if (!isInAppBrowser()) {
    register();
}

export default firebase;
