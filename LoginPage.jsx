function ConflictTable({ conflicts }) {
  if (!conflicts.length) {
    return <p className="empty-state">No scheduling conflicts detected.</p>
  }

  return (
    <div className="table-wrap compact">
      <table>
        <thead><tr><th>Type</th><th>Day</th><th>Slot</th><th>Details</th></tr></thead>
        <tbody>
          {conflicts.map((conflict) => (
            <tr key={conflict.id}>
              <td><span className="badge warning">{conflict.type}</span></td>
              <td>{conflict.day}</td>
              <td>{conflict.slot}</td>
              <td>{conflict.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ConflictTable
