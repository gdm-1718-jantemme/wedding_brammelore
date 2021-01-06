import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import codes from './codes'
import Todo from './models/Todo'
import Attendee from './models/Attendee.js'

dotenv.config()

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, user: process.env.DB_USER, pass: process.env.DB_PASS, authSource: "admin" })
  .then(() => console.log('connected to mongodb...'))
  .catch(error => console.log(error))

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/codes', (req, res) => {
  res.status(200).send({
    succes: 'true',
    message: 'codes retrieved successfully',
    data: codes
  })
})

app.post('/api/codes/check', (req, res) => {
  let codePossibilities = codes.map(a => a.code);

  if(codePossibilities.includes(req.body.code)) {
    let index = codePossibilities.indexOf(req.body.code)

    res.status(200).send({
      succes: 'true',
      message: 'correct code',
      data: {
        accepted: true,
        festivities: codes[index].festivities
      }
    })
  } else {
    res.status(200).send({
      succes: 'true',
      message: 'wrong code',
      data: {
        accepted: false
      }
    })
  }
})

app.post('/api/attendees/add', (req, res) => {
  const attendee = new Attendee({
    name: req.body.name,
    surname: req.body.surname,
    reception: {
      isGoing: req.body.reception?.isGoing,
      attendees: req.body.reception?.attendees,
    },
    diner: {
      isGoing: req.body.diner?.isGoing,
      attendees: req.body.diner?.attendees,
    },
    party: {
      isGoing: req.body.party?.isGoing,
      attendees: req.body.party?.attendees,
    },
    email: req.body?.email
  })

  attendee.save()
  .then(() => {
    res.status(200).send({
      succes: 'true',
      message: 'attendee added.'
    })
  })
  .catch((err) => {
    console.log(err)
    res.status(200).send({
      succes: 'false',
      message: 'Something went wrong while trying to add an attendee.',
      error: {
        message: err
      }
    })
  })
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})