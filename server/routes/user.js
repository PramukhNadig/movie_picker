import express from 'express';
import { getMovieFromIMDBID, addMovieToSpecificList } from '../data/functions.js';
import adminDb from '../data/db.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.cookie('user', 'John Doe', { maxAge: 900000, httpOnly: true });
    res.send('Hello World');
});

router.get('/movie/:id', async (req, res) => {
    const movieID = req.params.id;
    const movie = await getMovieFromIMDBID(movieID);

    res.send(movie);
});

router.post('/movie/:id', async (req, res) => {
    const movieID = req.params.id;
    const userID = req.cookies.userID;
    if (!userID) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        await addMovieToSpecificList(movieID, userID);
        res.send('Movie added');
    } catch (error) {
        res.status(500).send('Error adding movie' + error);
    }
});

router.delete('/movies/:id', async (req, res) => {
    const movieID = req.params.id;
    const userID = req.cookies.userID;
    if (!userID) {
        res.status(401).send('Unauthorized');
        return;
    }
    const userRef = adminDb.collection('users').doc(userID);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        res.status(404).send('User not found');
        return;
    }
    const movies = userDoc.data().movies;
    const newMovies = movies.filter(movie => movie.imdbID !== movieID);
    await userRef.update({ movies: newMovies.filter(movie => movie !== undefined) });
    res.send('Movie removed');
});



router.get('/user/movies', async (req, res) => {
    const userID = req.cookies.userID;
    if (!userID) {
        res.status(401).send('Unauthorized');
        return;
    }
    const userRef = adminDb.collection('users').doc(userID);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        res.status(404).send('User not found');
        return;
    }
    const movies = userDoc.data().movies;
    res.send(movies);
});

router.post('/user/login', async (req, res) => {
    console.log(req.body);
    if (!req.body.username || !req.body.password) {
        res.status(400).send('Invalid request');
        return;
    }
    let username = req.body.username;
    let password = req.body.password;
    // Check if username and password are correct
    const usersRef = adminDb.collection('users');
    const q = usersRef.where('username', '==', username).where('password', '==', password);
    const snapshot = await q.get();
    if (snapshot.empty) {
        res.status(401).send('Invalid username or password');
    } else {
        res.cookie('userID', snapshot.docs[0].id);
        res.send('Logged in');
    }
});


router.post('/user/register', async (req, res) => {
    console.log(req.body);

    if (!req.body.username || !req.body.password) {
        res.status(400).send('Invalid request');
        return;
    }
    let username = req.body.username;
    let password = req.body.password;

    try {
        const docRef = await adminDb.collection('users').add({
            username: username,
            password: password,
            movies: []
        });
        res.cookie('userID', docRef.id);
        res.send('Registered');
    } catch (error) {
        res.status(500).send('Error registering');
    }
});

router.get('/user/logout', async (req, res) => {
    res.clearCookie('userID');
    res.send('Logged out');
});

export default router;