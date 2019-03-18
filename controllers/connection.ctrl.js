'use strict'

const Connection = require('../models/connection')

/* ============================ ROUTE HANDLERS ============================= */

// GET CONNECTIONS
//   Example: GET >> /api/connections
//   Secured: yes, valid JWT required
//   Expects:
//     1) the user's _id from the JWT token
//   Returns: array of user's connections
async function getConnections (req, res, next) {
  const target = req.token._id

  try {
    const connections = await Connection.findOwnConnections({ target })
    return res.status(200).json({ connections })
  } catch (err) {
    return next(err)
  }
}

// CREATE CONNECTION
//   Example: POST >> /api/connect
//   Secured: yes, valid JWT required
//   Expects:
//     1) request body properties : {
//          mentor          : id
//          mentee          : id
//          mentorName      : string
//          menteeName      : string
//          initiator       : id
//          status          : 'pending'
//          conversationID  : string
//        }
//   Returns: success message & connection _id on success
async function createConnection (req, res, next) {
  const conn = new Connection(req.body)
  conn.dateStarted = Date.now()

  try {
    const savedConn = await conn.save()
    return res.status(200).json({
      message: 'Connection created',
      connectionId: savedConn._id
    })
  } catch (err) {
    return next(err)
  }
}

// Update a connection record's status & status date
//   Example: POST >> /api/updateconnection
//   Secured: yes, valid JWT required
//   Expects:
//     1) request body properties : {
//          type : String
//        }
//   Returns: updated connection record on success
async function updateConnection (req, res, next) {
  const target = { _id: req.params.id }
  const { type } = req.body

  try {
    const conn = await Connection.updateConnectionStatus({ target, type })
    return res.status(200).json({ conn })
  } catch (err) {
    return next(err)
  }
}

/* ============================== EXPORT API =============================== */

module.exports = { getConnections, createConnection, updateConnection }
