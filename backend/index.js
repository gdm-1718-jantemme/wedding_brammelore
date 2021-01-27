import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import nodemailer from 'nodemailer'
import fs from 'fs'
import https from 'https'

import codes from './codes'
import Attendee from './models/Attendee.js'

const privateKey  = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate};

dotenv.config()

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, user: process.env.DB_USER, pass: process.env.DB_PASS, authSource: "admin" })
  .then(() => console.log('connected to mongodb...'))
  .catch(error => console.log(error))

const app = express()

var corsOptions = {
  origin: ['http://localhost:3000', 'http://192.168.5.135:3000', 'https://practical-wilson-6f16d0.netlify.app/'],
  optionsSuccessStatus: 200
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Hannelore.en.Bram@gmail.com',
    pass: 'N&r6XKUnPwSn'
  }
});

app.use(cors(corsOptions))
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
    console.log('Attendee successfully added.')
    sendConfirmation(attendee.email, attendee.name, attendee.reception, attendee.diner, attendee.party)
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

const sendConfirmation = (recepientEmail, name, reception, diner, party) => {
  let content = ''

  if(!reception.isGoing && !diner.isGoing && !party.isGoing)
    content = `Jammer dat je er niet bij kan zijn ${name}. Toch bedankt om dit aan ons te laten weten! \n\nGroetjes van Hannelore & Bram`
  else
    content = `Bedankt om op onze uitnodiging te antwoorden ${name}. We hebben ontvangen dat je met ${reception.attendees} personen naar de volgende festiviteiten komt: ${reception.isGoing ? '\n- Receptie' : ''}${diner.isGoing ? '\n- Diner' : ''}${party.isGoing ? '\n- Avondfeest' : ''}\n\nGroetjes van Hannelore & Bram`

  if(content !== '') {
    const mailOptions = {
      from: 'Hannelore.en.Bram@gmail.com',
      to: recepientEmail,
      subject: 'Bevestiging: Trouw Hannelore & Bram',
      text: content
    }

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  }
}

const PORT = 5000

const httpsServer = https.createServer(credentials, app)

httpsServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})