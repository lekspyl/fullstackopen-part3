const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Phonebook = require('./models/phonebook')

app.use(cors())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(express.json())

app.get('/info', (request, response) => {
  Phonebook.find({}).then(entries => {
    response.json({ 'total_entries': entries.length })
  })
})

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(entries => {
    response.json(entries)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Phonebook.findById(request.params.id).then(entry => {
    if (entry) {
      response.json(entry)
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  console.log('Deleting entry with id', request.params.id)
  Phonebook.findByIdAndDelete(request.params.id).then(entry => {
    response.status(204).end()
  })
})

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and number must be passed'
    })
  }

  Phonebook.findOne({ name: body.name }).then(entry => {
    // console.log('POST: found entry', entry)
    if (entry && entry.name === body.name) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    new Phonebook({
      name: body.name,
      number: body.number,
      date: new Date()
    }).save().then(entry => response.json(entry))
  })
})

app.patch('/api/persons/:id', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'missing name or number'
    })
  }

  Phonebook.findById(request.params.id).then(entry => {
    console.log('Entry to patch:', entry)
    entry.number = body.number
    entry.date = new Date()
    entry.save().then(entry => response.json(entry))
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
