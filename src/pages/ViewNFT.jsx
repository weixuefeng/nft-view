import { useParams } from 'react-router-dom'
import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
import { request, gql } from 'graphql-request'
import NftSingle from 'components/NftSingle'

const endpoint = process.env.REACT_APP_API_ENDPOINT
const queryClient = new QueryClient()

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
  return useQuery('SingleToken', async () => {
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
  })
}

function Token() {
  let { contract, id } = useParams()
  contract = contract === null ? '' : contract
  id = id === null ? '' : id
  const lookTokenID = contract.toLowerCase() + '_' + id

  const { status, data, error, isFetching } = useGetSingle(lookTokenID)

  return (
    <div>
      {status === 'loading' ? (
        'Loading...'
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : isFetching ? (
        'Loading...'
      ) : data === null || data.id === undefined ? (
        'does not exist...'
      ) : (
        <NftSingle token={data} />
      )}
    </div>
  )
}
