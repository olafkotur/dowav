import express = require('express');

export const HandlerService = {
  getPing: (req: express.Request, res: express.Response) => {
    console.log(req, res)
  },
}