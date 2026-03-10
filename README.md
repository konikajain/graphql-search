# GraphQL Search ⚡

A live demonstration of GraphQL over-fetching elimination — real API calls,
real payload size differences, real response times.

Live Demo → [your-url.vercel.app](https://graphql-search-kappa.vercel.app/)

---

## Why I built this

At Raja Software Labs I migrated REST APIs to GraphQL, reducing API load
time by 15%. This project shows exactly why that migration mattered —
with real network requests you can verify in DevTools.

---

## What's inside

### 1. REST vs GraphQL — Real API Calls
- Hits two real APIs simultaneously — jsonplaceholder.typicode.com (REST)
  and graphqlzero.almansi.me (GraphQL)
- REST returns all fields regardless of what UI needs
- GraphQL returns only id, name, email — exactly what was requested
- Open DevTools → Network tab to see real requests, real payload sizes

### 2. Query Builder
- Toggle fields on/off and watch the GraphQL query update live
- Payload size meter shows exactly how much you save per field removed
- Side by side query preview and response shape

### 3. Live Search
- Real debounced search — fires query only after 350ms pause
- Toggle which fields to fetch — result cards update instantly
- Combines useMemo + useDebounce + GraphQL field selection

---

## How it maps to my resume

| Resume bullet | Project section |
|---|---|
| *"Migrated REST APIs to GraphQL"* | REST vs GraphQL tab |
| *"Reduced API load time by 15%"* | Real payload comparison |
| *"Eliminated over-fetching"* | Query Builder tab |
| *"Debouncing and memoization"* | Live Search tab |

---

## Key concepts
```js
// REST — no control over what comes back
const res  = await fetch('/api/users')
const data = await res.json() // all fields, always

// GraphQL — ask for exactly what you need
const res = await fetch('/graphql', {
  method: 'POST',
  body: JSON.stringify({
    query: `{ users { id name email } }` // only these 3
  })
})
```

---

## Run locally
```bash
git clone https://github.com/konikajain/graphql-search.git
cd graphql-search
npm install
npm run dev
```

Open http://localhost:5173

---

## Other projects

- [React Performance Lab](https://github.com/konikajain/react-perf-dashboard)
- [Accessible UI Kit](https://github.com/konikajain/accessible-ui-kit)
