import express from 'express'
import { codeSubmissions } from '../db/codeSubmissions'

const router = express.Router()

router.get('/', async (req, res) => {
  const matches = Array.from(codeSubmissions.entries())
  res.json(matches)
})

router.get('/:matchId', async (req, res) => {
  const submissions = codeSubmissions.get(req.params.matchId)
  res.json(submissions)
})

export default router