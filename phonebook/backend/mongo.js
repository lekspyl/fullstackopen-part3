const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Missing arguments')
  console.log('To add an entry pass these arguments: <password> <name> <number>')
  console.log('To view all entries specify password only: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

console.log('name', name, 'number', number)

const url = `mongodb+srv://lekspyl:${password}@cluster0.njwtzqj.mongodb.net/phonebook-cli?retryWrites=true&w=majority`

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('phonebook', phonebookSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    if (name && number) {
      const newEntry = {
        name: name,
        number: number
      }
      const entry = new Phonebook(newEntry)
      entry.save().then(result => {
        console.log('saved an entry:', newEntry)
        mongoose.connection.close()
      })
    } else {
      console.log('Phonebook:')
      Phonebook.find({}).then(entries => {
        entries.forEach(entry => {
          console.log(entry.name, entry.number)
        })
        mongoose.connection.close()
      })
    }
  })
  .catch((err) => console.log(err))
