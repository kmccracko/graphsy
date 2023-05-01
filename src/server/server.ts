// // Require Modules
// require('dotenv').config();
// import express, { Request, Response, NextFunction } from 'express';
// const path = require('path');
// const cors = require('cors');

// // TYPES
// type ServerError = {};

// //create app instance and other const variables
// const app = express();
// app.use(cors());

// // run this for all requests, for cleaner log-reading
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(`${'-'.repeat(20)} a request has come in! ${'-'.repeat(20)}`);
//   console.log(`${'-'.repeat(20)} source: ${req.url}`);
//   next();
// });

// app.use(express.static('dist'));

// //handle parsing request body
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // app.use('/assets', express.static('src/client/assets'));
// app.use('/styles', express.static('src/client/styles'));

// // app.get('/', (req: Request, res: Response) => {
// //   res.status(200).sendFile(path.resolve(__dirname, '../../dist/index.html'));
// // });

// //404 error
// app.use('*', (req: Request, res: Response) => {
//   console.log('sending back from 404 route');
//   return res.sendStatus(404);
// });

// //create global error handler
// app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
//   console.log(err);
//   console.log('in global err handler');
//   return res.status(400).json(err);
// });

// const PORT = process.env.PORT || 3003;
// app.listen(PORT, async () => {
//   console.log(`Server listening on port: ${PORT}`);
// });
