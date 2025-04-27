import express from 'express'
import { playerToTeam } from '../db/playerToTeam'

const router = express.Router()

router.get('/', async (req, res) => {
  const matches = Array.from(playerToTeam.entries())
  res.json(matches)
})

router.get('/:playerId', async (req, res) => {
  const team = playerToTeam.get(req.params.playerId)
  res.json(team)
})

export default router