/* eslint-disable @typescript-eslint/camelcase */

import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import User from '../data/models/user';

import { createAccessToken } from '../tokens/accessToken';
import { createRefreshToken } from '../tokens/refreshToken';

export default async function(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, } = req.body;

    const record = await User.findOne({
      where: { username, },
      relations: [ 'permissions', ],
    });

    if (record === undefined) {
      res.status(404).send({
        error: `User not found for username: "${username}"`,
      });
      return;
    }

    const ok = await bcrypt.compare(password, record.password);
    if (!ok) {
      res.status(401).send({
        error: `Incorrect password for username: "${username}"`,
      });
      return
    }

    const tokenUserInfo = {
      id: record.uuid,
      username: record.username,
      permissions: record.permissions.map(({ title, }) => title),
    }

    const accessToken = createAccessToken(tokenUserInfo);
    const refreshToken = createRefreshToken(tokenUserInfo);

    res.status(200).send({
      user_uuid: record.uuid,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch(e) {
    res.status(500).send({
      error: e.message,
    })
  }
}