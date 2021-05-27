import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AllNFTs from 'pages/AllNFTs'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/all">
          <AllNFTs />
        </Route>
        <Route path="/">
          <AllNFTs />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
