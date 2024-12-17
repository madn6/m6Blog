// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'mern-blog-76dac.firebaseapp.com',
	projectId: 'mern-blog-76dac',
	storageBucket: 'mern-blog-76dac.firebasestorage.app',
	messagingSenderId: '980484379913',
	appId: '1:980484379913:web:c2d795d2ab00dc97c52fd8'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
