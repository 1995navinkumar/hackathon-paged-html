import { useState } from 'react'
import generateExecutiveReport from './ExecutiveReports/generateExecutiveReport'

function App():JSX.Element {
  return (
    <div>
      <button onClick={generateExecutiveReport}>Generate Report</button>
    </div>
  )
}

export default App
