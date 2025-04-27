import express from 'express'
import {
  getAllMatches,
  getAllPlayerIdMatchIdPairings,
  getMatch,
  getPlayerMatchId
} from '../db/matches'

const router = express.Router()

router.get('/', async (req, res) => {
  const matches = await getAllMatches()
  res.json(matches)
})

router.get('/pairings', async (req, res) => {
  const pairings = await getAllPlayerIdMatchIdPairings()
  res.json(pairings)
})

router.get('/:id', async (req, res) => {
  const match = await getMatch(req.params.id)
  res.json(match ?? `match with id ${req.params.id} not found`)
})

router.get('/player/:playerId', async (req, res) => {
  const matchId = await getPlayerMatchId(req.params.playerId)
  res.json(matchId ?? `player with id ${req.params.playerId} not in match`)
})

export default router