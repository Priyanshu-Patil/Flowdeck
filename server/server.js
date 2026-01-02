import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import { PrismaClient } from '@prisma/client';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

app.use(express());
app.use(cors());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send("Server is live..."));

app.use("/api/inngest", serve({ client: inngest, functions }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server is running on Port: ${PORT}`));