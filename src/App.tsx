import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AllNFTs from 'pages/AllNFTs'
import ViewNFT from 'pages/ViewNFT'
import Home from 'pages/home'
import { Helmet, HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>NFT Explorer</title>
      </Helmet>
      <Router>
        <Switch>
          <Route exact path="/all">
            <AllNFTs />
          </Route>
          <Route exact path="/view/:contract/:id">
            <ViewNFT />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route>
            <Helmet>
              <title>404 - NFT Explorer</title>
            </Helmet>
            <p>404</p>
          </Route>
        </Switch>
      </Router>
    </HelmetProvider>
  )
}

export default App
