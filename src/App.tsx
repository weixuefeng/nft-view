import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AllNFTs from 'pages/AllNFTs'
import ViewNFT from 'pages/ViewNFT'
import Home from 'pages/home'
import { Helmet, HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>NFT Viewer</title>
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
              <title>404 - NFT Viewer</title>
            </Helmet>
            <Page404 />
          </Route>
        </Switch>
      </Router>
    </HelmetProvider>
  )
}

function Page404() {
  return (
    <div>
      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl sm:text-4xl">
          <span className="block">404</span>
          <span className="block">NOT FOUND</span>
        </h2>
      </div>
    </div>
  )
}


export default App
