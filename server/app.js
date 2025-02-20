import 'dotenv/config';
import express from 'express';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { processors } from 'eslint-plugin-vue';

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
}

const app = initializeApp(firebaseConfig);

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/movie/:id', (req, res) => {
    res.send(`Movie ${req.params.id}`);
    });

app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);