import { NewtonCoinIcon } from 'components/icons'

const NftSingleLoadingView = props => {
  return (
    <>
      <div className={'viewer layout-media-cover loader'}>
        <div className="wrapper">
          <header>
            <div className="collection">
              <div className="logo">
                <NewtonCoinIcon />
              </div>
              <div className="info">
                <div className="contract"></div>
              </div>
            </div>
          </header>

          <main>
            <div className="cover"></div>
          </main>
        </div>
      </div>
    </>
  )
}

export default NftSingleLoadingView
