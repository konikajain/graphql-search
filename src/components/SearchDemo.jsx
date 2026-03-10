import { useState, useMemo, useRef } from 'react'
import { USERS } from '../data/mockData'
import { useDebounce } from '../hooks/useDebounce'

const AVAILABLE_FIELDS = ['name', 'email', 'role', 'department', 'location']

function SearchDemo() {
  const [search, setSearch]             = useState('')
  const [selectedFields, setSelectedFields] = useState(['name', 'email', 'role'])
  const [log, setLog]                   = useState([])
  const callCount                       = useRef(0)

  const debouncedSearch = useDebounce(search, 350)

  function addLog(msg, type) {
    callCount.current += 1
    setLog(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev.slice(0, 14)])
  }

  function toggleField(field) {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  // this runs only when debouncedSearch changes — not every keystroke
  const results = useMemo(() => {
    if (!debouncedSearch.trim()) return USERS.slice(0, 9)

    addLog(
      `query { users(search: "${debouncedSearch}") { id ${selectedFields.join(' ')} } }`,
      'blue'
    )

    return USERS.filter(u =>
      u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(debouncedSearch.toLowerCase())
    ).slice(0, 9)
  }, [debouncedSearch, selectedFields])

  // simulate what payload looks like based on selected fields
  const payloadSize = useMemo(() => {
    const sample = results.slice(0, 3).map(u => {
      const obj = { id: u.id }
      selectedFields.forEach(f => { obj[f] = u[f] })
      return obj
    })
    return JSON.stringify(sample).length
  }, [results, selectedFields])

  return (
    <div>
      <div className="demo-header">
        <h2>Live Search — GraphQL + useDebounce + useMemo</h2>
        <p>
          Everything combined — debounced search fires the query only after
          you stop typing, GraphQL returns only selected fields,
          and useMemo caches the filtered results.
        </p>
      </div>

      {/* field selector */}
      <div className="card">
        <div className="card-title">Select fields to fetch — query updates live</div>
        <div className="search-field-toggles">
          {AVAILABLE_FIELDS.map(field => (
            <button
              key={field}
              onClick={() => toggleField(field)}
              className={`field-pill ${selectedFields.includes(field) ? 'active' : ''}`}
            >
              {selectedFields.includes(field) ? '☑' : '☐'} {field}
            </button>
          ))}
        </div>

        {/* live query */}
        <div className="live-query">
          <span className="code-purple">query</span>
          {' { '}
          <span className="code-blue">users</span>
          {`(search: "`}
          <span className="code-amber">{debouncedSearch || '...'}</span>
          {'") { '}
          <span className="code-green">id {selectedFields.join(' ')}</span>
          {' } }'}
        </div>

        <div className="search-meta">
          <span className="search-meta-item">
            fields: <strong>{selectedFields.length + 1}</strong>
          </span>
          <span className="search-meta-item">
            est. payload (3 results): <strong style={{ color: '#34d399' }}>{payloadSize}b</strong>
          </span>
          <span className="search-meta-item">
            queries fired: <strong>{callCount.current}</strong>
          </span>
        </div>
      </div>

      {/* search input */}
      <div className="search-bar-wrap">
        <span className="search-icon">⌕</span>
        <input
          type="search"
          placeholder='Search by name, email, or role...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* results */}
      {results.length > 0 ? (
        <div className="results-grid">
          {results.map(user => (
            <div key={user.id} className="result-card">
              <div className="result-name">{user.name}</div>
              {selectedFields.includes('email') && (
                <div className="result-field">
                  email: <span>{user.email}</span>
                </div>
              )}
              {selectedFields.includes('role') && (
                <div className="result-field">
                  role: <span>{user.role}</span>
                </div>
              )}
              {selectedFields.includes('department') && (
                <div className="result-field">
                  dept: <span>{user.department}</span>
                </div>
              )}
              {selectedFields.includes('location') && (
                <div className="result-field">
                  location: <span>{user.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No users found for "{debouncedSearch}"
        </div>
      )}

      {/* log */}
      <div className="log-label" style={{ marginTop: '1.25rem' }}>
        GRAPHQL QUERY LOG — fires only after 350ms pause
      </div>
      <div className="log-box">
        {log.length === 0 && (
          <div className="log-line log-gray">// type in the search box to see queries fire...</div>
        )}
        {log.map(l => (
          <div key={l.id} className={`log-line log-${l.type}`}>{l.msg}</div>
        ))}
      </div>

    </div>
  )
}

export default SearchDemo