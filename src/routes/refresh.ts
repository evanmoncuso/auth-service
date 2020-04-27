/* eslint-disable @typescript-eslint/camelcase */

import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getClient } from '../data/initialize';

import User from '../data/models/user';

import { createAccessToken } from '../tokens/accessToken';
import { RefreshTokenPayload } from '../tokens/refreshToken'

export default async function(req: Request, res: Response): Promise<void> {
  try {
    const { refresh_token, } = req.body;
    const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

    if (!REFRESH_SECRET) {
      throw new Error('No refresh secret found');
    }

    // Step One is to check that the refresh token is even valid
    const status: RefreshTokenPayload | any = verify(refresh_token, REFRESH_SECRET);

    if ((status as { name: string; message: string }).name) {
      res.status(401).send({
        error: (status as { name: string; message: string }).message,
      });
      return
    }

    // Once we know the token is valid, check if redis has an invalidations saved
    const client = getClient();
    if (!client) throw new Error('Unable to get Redis Client')

    const redisResult = await client?.get(refresh_token);
      if (redisResult !== null) {
      res.status(401).send({
        error: 'Token is not authorized',
      });
      return
    }

    // get user info
    const record = await User.findOne({ where: { uuid: status.id, },});

    if (record === undefined) {
      res.status(404).send({
        error: 'No user found for this token',
      });
      return
    }

    const tokenUserInfo = {
      id: record.uuid,
      username: record.username,
      permissions: record.permissions.map(({ title, }: { title: string }) => title),
    }

    res.send({
      accessToken: createAccessToken(tokenUserInfo),
      refresh_token,
    })
  } catch(e) {
    res.status(500).send({ error: e || 'something went wrong...', })
  }
}