import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import User, { UserInterface } from '../data/models/user';

import { createAccessToken, AccessTokenPayload } from '../tokens/accessToken';
import { RefreshTokenPayload } from '../tokens/refreshToken'

export default async function(req: Request, res: Response) {
  try {
    const { refresh_token } = req.body;
    const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

    if (!REFRESH_SECRET) {
      throw new Error('No refresh secret found');
    }

    const status: RefreshTokenPayload | { name: string, message: string } = verify(refresh_token, REFRESH_SECRET);

    if ((status as { name: string, message: string }).name) {
      res.status(401).send({
        error: status.message,
      });
      return
    }

    // get user info
    const record = await User.findOne({ where: { uuid: status.id }});

    if (record === undefined) {
      res.status(404).send({
        error: 'No user found for this token'
      });
      return
    }

    const tokenUserInfo = {
      id: record.uuid,
      username: record.username,
      permissions: record.permissions.map(({ title }: { title: string }) => title),
    }

    res.send({
      accessToken: createAccessToken(tokenUserInfo),
      refresh_token,
    })
  } catch(e) {
    res.status(500).send({ error: e || 'something went wrong...' })
  }
}