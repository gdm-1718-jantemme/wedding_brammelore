import express from 'express'
import bodyParser from 'body-parser'

import codes from './codes'

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

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})