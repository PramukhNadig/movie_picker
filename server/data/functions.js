import fetch from 'node-fetch';
import adminDb from './db.js';


async function getMovieFromIMDBID(imdbID) {
    let OMDB_API = process.env.OMDB_API_KEY;
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`:(`);
    }
    const data = await response.json();
    return data;
}



async function getMovieFromIMDBLink(imdbLink) {
    if (imdbLink.startsWith('https://www.imdb.com/title/')) {
        const imdbID = imdbLink.split('/')[4];
    }

    else if (imdbLink.startsWith('www.imdb.com/title/')) {
        const imdbID = imdbLink.split('/')[3];
    }
    https://www.imdb.com/title/tt0050083/
    return getMovieFromIMDBID(imdbID);
}

async function addMovieToSpecificList(imdbID, userID) {
    const userRef = adminDb.collection('users').doc(userID);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new Error('User not found');
    }

    const movieData = await getMovieFromIMDBID(imdbID);
    await userRef.update({
        movies: firebase.firestore.FieldValue.arrayUnion(movieData)
    });
}

async function removeMoveFromSpecificList(imdbID, userID) {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(userID);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new Error('User not found');
    }

    const movieData = await getMovieFromIMDBID(imdbID);
    await userRef.update({
        movies: firebase.firestore.FieldValue.arrayRemove(movieData)
    });
}

async function checkIfMovieIsInList(imdbID, userID) {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(userID);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new Error('User not found');
    }

    const movieData = await getMovieFromIMDBID(imdbID);
    return userDoc.data().movies.includes(movieData);
}

async function getAllMovies() {
    
}

async function addMovieToMoviesList(imdbID) {
    const db = firebase.firestore();
    const moviesRef = db.collection('movies');
    const movieData = await getMovieFromIMDBID(imdbID);
    await moviesRef.add(movieData);
}

async function removeMovieFromMoviesList(imdbID) {
    const db = firebase.firestore();
    const moviesRef = db.collection('movies');
    const movieData = await getMovieFromIMDBID(imdbID);
    const query = await moviesRef.where('imdbID', '==', imdbID).get();
    query.forEach(async doc => {
        await doc.ref.delete();
    });
}

async function pickMovieFromMoviesList() {
    const db = firebase.firestore();
    const moviesRef = db.collection('movies');
    const query = await moviesRef.get();
    const movies = [];
    query.forEach(doc => {
        movies.push(doc.data());
    });
    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex];
}

export { getMovieFromIMDBID, getMovieFromIMDBLink, addMovieToSpecificList, removeMoveFromSpecificList, checkIfMovieIsInList, getAllMovies, addMovieToMoviesList, removeMovieFromMoviesList, pickMovieFromMoviesList };