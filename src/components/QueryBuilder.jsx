import { useState } from 'react'
import { ALL_FIELDS } from '../data/mockData'

const MAX_SIZE = ALL_FIELDS.reduce((sum, f) => sum + f.size, 0)

function QueryBuilder() {
  const [selectedFields, setSelectedFields] = useState(ALL_FIELDS.map(f => f.name))

  function toggleField(fieldName) {
    // id is always required
    if (fieldName === 'id') return
    setSelectedFields(prev =>
      prev.includes(fieldName)
        ? prev.filter(f => f !== fieldName)
        : [...prev, fieldName]
    )
  }

  const selectedSize = ALL_FIELDS
    .filter(f => selectedFields.includes(f.name))
    .reduce((sum, f) => sum + f.size, 0)

  const savingPct = Math.round((1 - selectedSize / MAX_SIZE) * 100)
  const barWidth  = Math.round((selectedSize / MAX_SIZE) * 100)

  // build the query string from selected fields
  const queryString = `query {
  users {
${selectedFields.map(f => `    ${f}`).join('\n')}
  }
}`

  // build what the response looks like
  const responsePreview = `{
  "data": {
    "users": [
      {
${selectedFields.map(f => `        "${f}": ...`).join(',\n')}
      }
    ]
  }
}`

  return (
    <div>
      <div className="demo-header">
        <h2>Query Builder — Select Only What You Need</h2>
        <p>
          Toggle fields on and off. Watch the GraphQL query update live
          and see exactly how much payload you save by requesting less data.
        </p>
      </div>

      <div className="query-builder-grid">

        {/* left — field selector */}
        <div>
          <div className="card-title">Available fields — click to toggle</div>

          <div className="field-toggle-list">
            {ALL_FIELDS.map(field => {
              const isSelected = selectedFields.includes(field.name)
              const isRequired = field.name === 'id'

              return (
                <div
                  key={field.name}
                  className={`field-toggle-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleField(field.name)}
                >
                  <div className="field-left">
                    <span className="field-checkbox">
                      {isSelected ? '☑' : '☐'}
                    </span>
                    <span className="field-name">{field.name}</span>
                    {isRequired && (
                      <span className="tag tag-blue" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                        required
                      </span>
                    )}
                  </div>
                  <span className="field-size">{field.size}b</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* right — query preview */}
        <div>
          <div className="card-title">Generated query</div>

          <div className="query-preview">
            <span className="code-purple">query</span>
            {' {\n'}
            {'  '}
            <span className="code-blue">users</span>
            {' {\n'}
            {selectedFields.map(f => (
              <div key={f}>
                {'    '}
                <span className="code-green">{f}</span>
              </div>
            ))}
            {'  }\n}'}
          </div>

          {/* payload size meter */}
          <div className="card" style={{ marginTop: '1.25rem' }}>
            <div className="card-title">Payload size estimate</div>

            <div className="size-stats">
              <div className="payload-stat-item">
                <div className="payload-stat-label">Selected</div>
                <div className="payload-stat-value green">{selectedSize}b</div>
              </div>
              <div className="payload-stat-item">
                <div className="payload-stat-label">Full REST payload</div>
                <div className="payload-stat-value red">{MAX_SIZE}b</div>
              </div>
              <div className="payload-stat-item">
                <div className="payload-stat-label">You save</div>
                <div className="payload-stat-value green">{savingPct}%</div>
              </div>
            </div>

            <div className="size-bar-label">
              payload size — {selectedSize}b of {MAX_SIZE}b max
            </div>
            <div className="query-size-bar-track">
              <div
                className="query-size-bar-fill"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>

          {/* response preview */}
          <div className="card-title" style={{ marginTop: '1.25rem' }}>
            Response shape
          </div>
          <div className="query-preview">
            <span className="code-amber">{'{'}</span>{'\n'}
            {'  '}
            <span className="code-blue">"data"</span>
            {': {\n'}
            {'    '}
            <span className="code-blue">"users"</span>
            {': [\n'}
            {'      {\n'}
            {selectedFields.map(f => (
              <div key={f}>
                {'        '}
                <span className="code-green">{`"${f}"`}</span>
                <span className="code-amber">{': ...'}</span>
              </div>
            ))}
            {'      }\n'}
            {'    ]\n'}
            {'  }\n'}
            <span className="code-amber">{'}'}</span>
          </div>
        </div>

      </div>

      {/* insight */}
      <div className="card">
        <div className="card-title">How this maps to real code</div>
        <div className="code-block">
          <span className="code-gray">{'// Before — REST, always fetches everything'}</span>{'\n'}
          <span className="code-red">{'fetch("/api/users")'}</span>{'\n\n'}
          <span className="code-gray">{'// After — GraphQL, fetch only what UI needs'}</span>{'\n'}
          <span className="code-green">{'const { data } = useQuery(gql`'}</span>{'\n'}
          <span className="code-green">{'  query {'}</span>{'\n'}
          <span className="code-green">{'    users {'}</span>{'\n'}
          {selectedFields.map(f => (
            <span key={f} className="code-green">{`      ${f}\n`}</span>
          ))}
          <span className="code-green">{'    }'}</span>{'\n'}
          <span className="code-green">{'  }'}</span>{'\n'}
          <span className="code-green">{'`)'}</span>
        </div>
      </div>

    </div>
  )
}

export default QueryBuilder