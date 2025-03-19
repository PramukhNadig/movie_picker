import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/user.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/', router);


app.listen(3000, () => {
    console.log('Server is running');
}
);


export default app;