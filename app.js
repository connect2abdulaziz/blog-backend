require('dotenv').config({path: `${process.cwd()}/.env`});

const express = require('express');
const app = express();

const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


const authRouter = require('./routes/authRoute');
//const postRouter = require('./routes/postRoute');
//const userRouter = require('./routes/userRoute');
//const commentRouter = require('./routes/commentRoute');


app.use(express.json());


// all routes 

app.use('/api/v1/auth', authRouter);
//app.use('/api/v1/posts', postRouter);
//app.use('/api/v1/users', userRouter);
//app.use('/api/v1/comments', commentRouter);

app.use('*', 
    catchAsync(async (err, req, res) => {
        throw new AppError(`Can't find ${req.originalUrl} on the server`, 404);
    })
);

//Global error handler
app.use(globalErrorHandler);


const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
