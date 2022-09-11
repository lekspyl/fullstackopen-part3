const NewEntry = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => {
  return (
    <div>
      <h2>Add a new entry</h2>
      <form onSubmit={addPerson}>
        <div>
          Name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>Number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  )
}

export default NewEntry
