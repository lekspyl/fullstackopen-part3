import { useState, useEffect } from 'react'
import axios from 'axios'
import Entries from './Entries'
import Filter from './Filter'
import NewEntry from './NewEntry'
import Notification from './Notification'
import phonebookService, { baseUrl } from '../services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const hook = () => {
    axios
    .get(baseUrl)
    .then(response => {
      setPersons(response.data)
    })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (!(newPerson.name && newPerson.number)) {
      alert('Please fill in both fields')
    } else {
      if (persons.some(person => person.name === newPerson.name)) {
        if (window.confirm(`${newName} already exists in the phonebook, overwrite the phone number?`)) {
          const person = persons.find(person => person.name === newPerson.name)
          phonebookService
          .updateEntry(person.id, newPerson)
          .then(() => {
            phonebookService.getAllEntries()
              .then(response => setPersons(response))
            setNotification({
              type: 'success',
              message: `${person.name}'s phone number is updated`
            })
            setTimeout(() => {
              setNotification(null)
            }, 2000)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            setNotification({
              type: 'error',
              message: `${person.name}'s has already been removed from the phonebook`
            })
            setTimeout(() => {
              setNotification(null)
            }, 2000)
          })
        }
      } else {
        phonebookService
          .createEntry(newPerson)
          .then(returnedEntry => {
            setPersons(persons.concat(returnedEntry))
            setNotification({
              type: 'success',
              message: `${newPerson.name} is added to the phonebook`
            })
            setTimeout(() => {
              setNotification(null)
            }, 2000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setNotification({
              type: 'error',
              message: error.response.data.error
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
      }
    }
  }

  const deleteEntry = (entry) => {
    if (window.confirm(`You really want to delete ${entry.name}?`)) {
      phonebookService.deleteEntry(entry.id)
        .then(() => {
          phonebookService.getAllEntries()
              .then(response => setPersons(response))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsFiltered = filter
    ? persons.filter(x => x.name.toLowerCase() === filter.toLowerCase())
    : persons

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification} />
      <NewEntry
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <Filter filter={filter} onChange={handleFilterChange} />
      <Entries entries={personsFiltered} handleDeleteAction={deleteEntry} />
    </div>
  )
}

export default App
