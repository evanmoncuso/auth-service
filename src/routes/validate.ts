import { Request, Response } from 'express';

export default async function(req: Request, res: Response) { 
  const body = req.body;
  console.log(123, body);

  res.status(501).send({
    message: 'coming soon'
  })
}