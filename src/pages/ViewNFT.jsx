import { useParams } from 'react-router-dom'
import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
import { request, gql } from 'graphql-request'
import NftSingle from 'components/NftSingle'
import NftSingleLoadingView from 'components/NftSingleLoadingView'
import { Helmet } from 'react-helmet-async'
// import { ReactQueryDevtools } from 'react-query/devtools'

const endpoint = process.env.REACT_APP_API_ENDPOINT
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 0
    }
  }
})

function ViewNFT() {
  return (
    <QueryClientProvider client={queryClient}>
      <Token />
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  )
}

export default ViewNFT

function useGetSingle(tokenID = '') {
  return useQuery(
    'SingleToken',
    async () => {
      const { token } = await request(
        endpoint,
        gql`
        query {
          token(id:"${tokenID.toString()}") {
            id
            tokenID
            mintTime
            mintBlock
            tokenURI
            minter
            owner {
              id
            }
            contract {
              id
              name
              symbol
            }
          }
        }
      `
      )

      if (token === null) {
        return 'null'
      }

      return token
    },
    {
      refetchInterval: 1000
    }
  )
}

function Token() {
  let { contract, id } = useParams()
  contract = contract === null ? '' : contract
  id = id === null ? '' : id
  const lookTokenID = contract.toLowerCase() + '-' + id
  let pageTitle = lookTokenID

  const { status, data, error, isFetching } = useGetSingle(lookTokenID)

  return (
    <div>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      {status === 'loading' ? (
        <NftSingleLoadingView />
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : data === null || data.id === undefined ? (
        <ItemNotExist />
      ) : (
        <>
          {isFetching ? <div className="view-loading-dot" /> : ''}
          <NftSingle token={data} />
        </>
      )}
    </div>
  )
}

function ItemNotExist() {
  return (
    <div>
      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl sm:text-4xl">
          <span className="block">TOKEN NOT EXIST</span>
        </h2>
      </div>
    </div>
  )
}
