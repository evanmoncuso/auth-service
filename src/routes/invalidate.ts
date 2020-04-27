/* eslint-disable @typescript-eslint/camelcase */

import { Request, Response } from 'express';
import { getClient } from '../data/initialize';
import { verify } from 'jsonwebtoken';

export default async function invalidate(req: Request, res: Response): Promise<void> {
  try {
    const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
    const { refresh_token, } = req.body;

    if (!refresh_token) {
      res.status(400).send({
        error: 'No "refresh_token" included',
      });
      return
    } else if (!REFRESH_SECRET) {
      throw new Error('No refresh secret found');
    }

    const client = getClient();
    const payload: any = verify(refresh_token, REFRESH_SECRET);

    // decode the token to get the expiration date
    const exists = await client?.get(refresh_token);
    if (!exists) {
      await client?.setWithExpire(refresh_token, payload.exp, payload.exp);
    }

    // call it a day
    res.sendStatus(204);
  } catch(e) {
    if (e.name === 'JsonWebTokenError') {
      res.status(400).send({
        error: 'Invalid Token',
      })
    } else {
      res.sendStatus(500);
    }
  }
}

