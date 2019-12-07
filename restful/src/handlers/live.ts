import express = require('express');

export const LiveHandler = {
  getLiveSensor: (req: express.Request, res: express.Response) => {
    const sensor: string = req.param('sensor');
    
  },
}