import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AllNFTs from 'pages/AllNFTs'
import ViewNFT from 'pages/ViewNFT'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/all">
          <AllNFTs />
        </Route>
        <Route exact path="/view/:contract/:id">
          <ViewNFT />
        </Route>
        <Route exact path="/">
          <AllNFTs />
        </Route>
        <Route>
          <p>404</p>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
