import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

enum Error {
  None = "",
  Passphrase = "This heartbeat needs to be unlocked with a passphrase",
  IncorrectPassphrase = "The passphrase specified is incorrect",
  NotFound = "This heartbeat could not be found",
}

type Data = {
  error: Error;
  heart: Heart | null;
};

type Heart = {
  id: number;
  message: string;
  viewed: number;
  code: string;
  passphrase: string;
  oneTime: number;
  recipient: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.body.code) {
    const heart = await prisma.hearts.findFirst({
      where: { code: req.body.code as string },
    });
    if (heart) {
      if (!heart.passphrase) {
        // No passphrase
        if (heart.oneTime) {
          await prisma.hearts.delete({ where: { id: heart.id } });
        } else if (!heart.viewed) {
          await prisma.hearts.update({
            where: { id: heart.id },
            data: { viewed: 1 },
          });
        }
        res.status(200).json({ error: Error.None, heart: heart });
      } else if (req.body.passphrase) {
        let result = bcrypt.compareSync(req.body.passphrase, heart.passphrase);
        if (result) {
          if (heart.oneTime) {
            await prisma.hearts.delete({ where: { id: heart.id } });
          } else if (!heart.viewed) {
            await prisma.hearts.update({
              where: { id: heart.id },
              data: { viewed: 1 },
            });
          }
          res.status(200).json({ error: Error.None, heart: heart });
        } else {
          res
            .status(401)
            .json({ error: Error.IncorrectPassphrase, heart: null });
        }
      } else {
        res.status(403).json({ error: Error.Passphrase, heart: null });
      }
    } else {
      res.status(404).json({ error: Error.NotFound, heart: null });
    }
  } else {
    res.status(404).json({ error: Error.NotFound, heart: null });
  }
}
