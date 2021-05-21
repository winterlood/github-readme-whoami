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

const assetsDir = path.join(__dirname,'assets')
const viewsDir = path.join(__dirname, 'views');
const staticDir = path.join(__dirname, 'public');

app.set('views', viewsDir);
app.set("view engine","ejs");
app.use(express.static(staticDir));


const svgReducer = (skill?:string) =>{
    switch(skill){
        case 'react':
            {
                const svgPath = path.join(assetsDir,'react_icon.svg');
                return svgPath;
            }
        default:
            return 'ERROR'
    }
}

app.get('/svg', (req: Request, res: Response) => {
    const skill:string | undefined = req.query.skill?.toString()
    if(skill){
       const svgPath = svgReducer(skill);
       res.sendFile(svgPath);
    }
    else{
        res.send("ERROR")
    }
});

app.get('*', (req: Request, res: Response) => {
    const {name} = req.query
    console.log(name)

    const svgPath = path.join(viewsDir,'react.svg')

    res.setHeader('Content-Type','image/svg+xml');
    res.sendFile(svgPath)
    // res.render("index",{
    //     name:name,
    //     two:'TWO'
    // })

});
export default app;
