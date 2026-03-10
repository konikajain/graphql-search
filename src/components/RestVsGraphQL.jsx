import { useState } from 'react'

// real REST endpoint — returns all fields
const REST_URL = 'https://jsonplaceholder.typicode.com/users'

// real GraphQL endpoint
const GRAPHQL_URL = 'https://graphqlzero.almansi.me/api'

// GraphQL query — only ask for 3 fields
const GRAPHQL_QUERY = `
  query {
    users {
      data {
        id
        name
        email
      }
    }
  }
`

function RestVsGraphQL() {
  const [restData,       setRestData]       = useState(null)
  const [graphqlData,    setGraphqlData]    = useState(null)
  const [restLoading,    setRestLoading]    = useState(false)
  const [graphqlLoading, setGraphqlLoading] = useState(false)
  const [restTime,       setRestTime]       = useState(null)
  const [graphqlTime,    setGraphqlTime]    = useState(null)
  const [log,            setLog]            = useState([])
  const [error,          setError]          = useState(null)

  function addLog(msg, type) {
    setLog(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev.slice(0, 18)])
  }

  async function fetchREST() {
    setRestData(null)
    setRestLoading(true)
    setRestTime(null)
    addLog('REST → GET https://jsonplaceholder.typicode.com/users', 'amber')
    addLog('REST → fetching ALL fields — no way to request specific ones...', 'red')

    try {
      const start = performance.now()
      const res   = await fetch(REST_URL)
      const data  = await res.json()
      const ms    = Math.round(performance.now() - start)

      setRestData(data.slice(0, 5))
      setRestTime(ms)
      setRestLoading(false)

      const bytes = JSON.stringify(data.slice(0, 5)).length
      addLog(`REST → ${ms}ms — received ${bytes} bytes`, 'red')
      addLog(`REST → ${Object.keys(data[0]).length} fields per user — UI needs only 3 ✗`, 'red')
    } catch (e) {
      setRestLoading(false)
      setError('REST fetch failed — check your connection')
      addLog('REST → fetch failed ✗', 'red')
    }
  }

  async function fetchGraphQL() {
    setGraphqlData(null)
    setGraphqlLoading(true)
    setGraphqlTime(null)
    addLog('GraphQL → POST https://graphqlzero.almansi.me/api', 'blue')
    addLog('GraphQL → query { users { data { id name email } } }', 'blue')
    addLog('GraphQL → server resolves ONLY requested fields...', 'green')

    try {
      const start = performance.now()
      const res   = await fetch(GRAPHQL_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ query: GRAPHQL_QUERY }),
      })
      const json = await res.json()
      const ms   = Math.round(performance.now() - start)

      const data = json.data.users.data.slice(0, 5)
      setGraphqlData(data)
      setGraphqlTime(ms)
      setGraphqlLoading(false)

      const bytes = JSON.stringify(data).length
      addLog(`GraphQL → ${ms}ms — received ${bytes} bytes`, 'green')
      addLog(`GraphQL → 3 fields per user — exactly what UI needs ✓`, 'green')
    } catch (e) {
      setGraphqlLoading(false)
      setError('GraphQL fetch failed — check your connection')
      addLog('GraphQL → fetch failed ✗', 'red')
    }
  }

  async function fetchBoth() {
    setError(null)
    setLog([])
    setRestData(null)
    setGraphqlData(null)
    fetchREST()
    fetchGraphQL()
  }

  const restBytes    = restData    ? JSON.stringify(restData).length    : 0
  const graphqlBytes = graphqlData ? JSON.stringify(graphqlData).length : 0
  const saving       = restBytes && graphqlBytes
    ? Math.round((1 - graphqlBytes / restBytes) * 100)
    : 0

  const REST_FIELDS     = restData?.[0]    ? Object.keys(restData[0])    : []
  const GRAPHQL_FIELDS  = graphqlData?.[0] ? Object.keys(graphqlData[0]) : []

  return (
    <div>
      <div className="demo-header">
        <h2>REST vs GraphQL — Real API Calls</h2>
        <p>
          Both requests hit real APIs. Open your browser DevTools → Network tab
          before clicking fetch — you'll see both requests fire with real
          response times and payload sizes.
        </p>
      </div>

      <div className="demo-controls">
        <button className="active-blue" onClick={fetchBoth}>
          ⚡ Fetch users (real API calls)
        </button>
        <span className="devtools-hint">
          💡 Open DevTools → Network tab to see real requests
        </span>
      </div>

      {error && (
        <div className="fetch-error">{error}</div>
      )}

      <div className="comparison-grid">

        {/* REST */}
        <div className="comparison-card bad">
          <div className="comparison-label bad">
            REST — jsonplaceholder.typicode.com
          </div>
          <p className="comparison-desc">
            Returns all fields. We only need id, name, email.
          </p>

          <div className="payload-stats">
            <div className="payload-stat-item">
              <div className="payload-stat-label">Response time</div>
              <div className="payload-stat-value red">
                {restLoading ? '...' : restTime ? `${restTime}ms` : '—'}
              </div>
            </div>
            <div className="payload-stat-item">
              <div className="payload-stat-label">Payload size</div>
              <div className="payload-stat-value red">
                {restLoading ? '...' : restBytes ? `${restBytes}b` : '—'}
              </div>
            </div>
            <div className="payload-stat-item">
              <div className="payload-stat-label">Fields returned</div>
              <div className="payload-stat-value red">
                {restLoading ? '...' : REST_FIELDS.length || '—'}
              </div>
            </div>
          </div>

          <div className="payload-box">
            {restLoading && <div className="log-gray">fetching real API...</div>}
            {restData?.[0] && Object.entries(restData[0]).map(([key, val]) => (
              <div
                key={key}
                className={
                  ['id','name','email'].includes(key)
                    ? 'payload-field-used'
                    : 'payload-field-wasted'
                }
              >
                {`  "${key}": `}
                <span className="payload-field-neutral">
                  {typeof val === 'object'
                    ? JSON.stringify(val).slice(0, 30) + '...'
                    : `"${String(val).slice(0, 30)}"`
                  }
                </span>
              </div>
            ))}
            {!restData && !restLoading && (
              <div className="log-gray">// click fetch to make real API call...</div>
            )}
          </div>

          <div className="payload-legend">
            <span className="legend-used">■ used</span>
            <span className="legend-wasted">■ wasted</span>
          </div>
        </div>

        {/* GraphQL */}
        <div className="comparison-card good">
          <div className="comparison-label good">
            GraphQL — graphqlzero.almansi.me
          </div>
          <p className="comparison-desc">
            Returns only id, name, email — exactly what we asked for.
          </p>

          <div className="payload-stats">
            <div className="payload-stat-item">
              <div className="payload-stat-label">Response time</div>
              <div className="payload-stat-value green">
                {graphqlLoading ? '...' : graphqlTime ? `${graphqlTime}ms` : '—'}
              </div>
            </div>
            <div className="payload-stat-item">
              <div className="payload-stat-label">Payload size</div>
              <div className="payload-stat-value green">
                {graphqlLoading ? '...' : graphqlBytes ? `${graphqlBytes}b` : '—'}
              </div>
            </div>
            <div className="payload-stat-item">
              <div className="payload-stat-label">Fields returned</div>
              <div className="payload-stat-value green">
                {graphqlLoading ? '...' : GRAPHQL_FIELDS.length || '—'}
              </div>
            </div>
          </div>

          <div className="payload-box">
            {graphqlLoading && <div className="log-gray">fetching real API...</div>}
            {graphqlData?.[0] && Object.entries(graphqlData[0]).map(([key, val]) => (
              <div key={key} className="payload-field-used">
                {`  "${key}": `}
                <span className="payload-field-neutral">
                  {`"${String(val).slice(0, 30)}"`}
                </span>
              </div>
            ))}
            {!graphqlData && !graphqlLoading && (
              <div className="log-gray">// click fetch to make real API call...</div>
            )}
          </div>

          <div className="payload-legend">
            <span className="legend-used">■ all fields used — nothing wasted</span>
          </div>
        </div>

      </div>

      {/* comparison summary */}
      {restData && graphqlData && (
        <div className="card">
          <div className="card-title">Real results — this fetch</div>
          <div className="stats-grid-3">
            <div className="payload-stat-item">
              <div className="payload-stat-label">REST response time</div>
              <div className="payload-stat-value red">{restTime}ms</div>
              <div className="stat-sublabel">all {REST_FIELDS.length} fields serialized</div>
            </div>
            <div className="payload-stat-item">
              <div className="payload-stat-label">GraphQL response time</div>
              <div className="payload-stat-value green">{graphqlTime}ms</div>
              <div className="stat-sublabel">only 3 fields serialized</div>
            </div>
            <div className="payload-stat-item">
              <div className="payload-stat-label">Payload reduction</div>
              <div className="payload-stat-value green">{saving}%</div>
              <div className="stat-sublabel">less data over the wire</div>
            </div>
          </div>
        </div>
      )}

      <div className="log-label">NETWORK LOG — real requests</div>
      <div className="log-box">
        {log.length === 0 && (
          <div className="log-line log-gray">// click fetch to see real network activity...</div>
        )}
        {log.map(l => (
          <div key={l.id} className={`log-line log-${l.type}`}>{l.msg}</div>
        ))}
      </div>

    </div>
  )
}

export default RestVsGraphQL