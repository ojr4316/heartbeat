import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");
const saltRounds = 10;

enum Error {
  None = "",
  NoMessage = "No message specified",
  Fail = "Sorry! Your heartbeat could not be created at this time.",
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

let heartbeat: Heart | null = null;

async function tryCreateHeart(
  id: string,
  message: string,
  recipient: string,
  passphrase: string,
  oneTime: number
): Promise<boolean> {
  // Generate ID
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  id = "";
  for (let i = 0; i < 4; i++) {
    id += alpha[Math.floor(Math.random() * alpha.length)];
  }
  // See if id is taken
  const h = await prisma.hearts.findFirst({ where: { code: id } });

  if (!h) {
    // Game ID not taken
    console.log(id + " is not taken");
    heartbeat = await prisma.hearts.create({
      data: {
        message,
        code: id,
        recipient,
        passphrase: passphrase ? bcrypt.hashSync(passphrase, saltRounds) : "",
        oneTime,
      },
    });
    console.log(heartbeat);
    return true;
  }
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.body.message) {
    const maxFails = 10;
    let id = "";
    let failCount = 0;
    let h: boolean = false;

    console.log(req.body.oneTime);
    let once = 0;
    if (req.body.oneTime === true) {
      once = 1;
    } else {
      once = parseInt(req.body.oneTime as string);
      if (isNaN(once)) {
        once = 0;
      }
    }

    while (!h && failCount < maxFails) {
      h = await tryCreateHeart(
        id,
        req.body.message as string,
        req.body.recipient as string,
        req.body.passphrase as string,
        once
      );
      failCount++;
    }

    if (failCount < maxFails) {
      res.status(200).json({ error: Error.None, heart: heartbeat });
    } else {
      res.status(400).json({ error: Error.Fail, heart: null });
    }
  } else {
    res.status(404).json({ error: Error.NoMessage, heart: null });
  }
}
