import express from 'express';
import moment from 'moment';
import { MongoService } from '../services/mongo';
import { ILiveData, ISimpleResponse } from '../models';
import { LiveDataKeys } from '../types';

export const LiveHandler = {

  getLiveSensor: async (req: express.Request, res: express.Response) => {
    const sensor: string = req.param('sensor');
    const data: ILiveData[] = await <any>MongoService.findMany('live', {});

    const filtered: ISimpleResponse[] = [];
    data.forEach((d: ILiveData) => {
      filtered.push({
        time: moment(d.createdAt).unix(),
        value: d[sensor as LiveDataKeys]
      });
    });

    res.send(filtered);
  },
}