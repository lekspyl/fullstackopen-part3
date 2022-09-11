const Entry = ({ person, handleDeleteAction }) => {
  return (
    <div>
      <li>{person.name} {person.number} <button onClick={() => handleDeleteAction(person)}>delete</button></li>
    </div>
  )
}

const Entries = ({ entries, handleDeleteAction }) => {
  return (
    <div>
      <h2>Entries</h2>
      <ul>
        {entries.map(person => {
          return (
            <Entry key={person.name} person={person} handleDeleteAction={handleDeleteAction} />
          )
        })}
      </ul>
    </div>
  )
}

export default Entries
