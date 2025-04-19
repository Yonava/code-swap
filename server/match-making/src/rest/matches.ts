import express from 'express'
import {
  getAllMatches,
  getMatch,
  getPlayerMatchId
} from '../db/matches'

const router = express.Router()

router.get('/', async (req, res) => {
  const matches = await getAllMatches()
  res.json(matches)
})

router.get('/:id', async (req, res) => {
  const match = await getMatch(req.params.id)
  res.json(match)
})

router.get('/player/:playerId', async (req, res) => {
  const matchId = await getPlayerMatchId(req.params.playerId)
  res.json(matchId)
})
