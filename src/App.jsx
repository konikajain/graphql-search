import { useState } from 'react'
import RestVsGraphQL from './components/RestVsGraphQL'
import QueryBuilder  from './components/QueryBuilder'
import SearchDemo    from './components/SearchDemo'

const TABS = ['REST vs GraphQL', 'Query Builder', 'Live Search']

function App() {
  const [tab, setTab] = useState(0)

  return (
    <div>
      <div className="app-header">
        <div className="app-header-title">
          <h1>GraphQL Search</h1>
          <p>Over-fetching elimination — query only what you need</p>
        </div>
        <div className="app-tabs">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`tab-btn ${tab === i ? 'tab-active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="app-content">
        {tab === 0 && <RestVsGraphQL />}
        {tab === 1 && <QueryBuilder />}
        {tab === 2 && <SearchDemo />}
      </div>
    </div>
  )
}

export default App