const Filter = ({filter, onChange}) => {
  return (
    <form>
    <div>
      Filter: <input value={filter} onChange={onChange} />
    </div>
  </form>
  )
}

export default Filter
