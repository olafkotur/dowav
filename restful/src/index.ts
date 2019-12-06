// import express = require('express');
import express from 'express'
import { HandlerService } from './handler'

const PORT = process.env.PORT || 8080;
const app: express.Application = express();

app.get('/', HandlerService.getPing);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));