import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import logger from '@shared/Logger';

const app = express();
const { BAD_REQUEST } = StatusCodes;



/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});


/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

// const myDir = path.join(__dirname,'')


const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
app.set("view engine","ejs");

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.get('*', (req: Request, res: Response) => {
    // console.log(req.query.name)
    const {name} = req.query
    console.log(name)

   res.render("index",{
       name:name,
       two:'TWO'
   })
});
export default app;
