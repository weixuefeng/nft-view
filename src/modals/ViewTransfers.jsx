import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import { useWeb3React } from '@web3-react/core'
import { AddressFormat } from 'components/AddressFormat'
import { ExternalLinkIcon, ArrowSmRightIcon, SwitchHorizontalIcon } from '@heroicons/react/outline'
import { DateTime, RelativeTime } from 'components/DateTime'
import { useQuery } from 'react-query'
import { request, gql } from 'graphql-request'
import { hasVibrate } from 'utils/hasHTML5API'

const EXPLORER_BASE_URL = process.env.REACT_APP_EXPLORER_URL
const endpoint2 = process.env.REACT_APP_API_ENDPOINT_2

function useGetTransfers(tokenID = '') {
  return useQuery(
    'Transfers',
    async () => {
      const { transfers } = await request(
        endpoint2,
        gql`
          query {
            transfers(
              where: { token: "${tokenID.toString()}" }
              orderBy: timestamp
              orderDirection: desc
              first: 25
            ) {
              id
              from {
                id
              }
              to {
                id
              }
              transaction {
                id
                timestamp
              }
            }
          }
        `
      )
      return transfers
    },
    {
      refetchInterval: 3000
    }
  )
}

const Transfers = props => {
  const { status, data, error, isFetching } = useGetTransfers(props.tokenID)
  const web3Context = useWeb3React()
  const { account } = web3Context

  return (
    <>
      {isFetching ? <div className="loading-dot" /> : ''}
      {status === 'loading' ? (
        <span>Loading</span>
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <div>
          {data.map((transfer, index) => (
            <div key={index} className="flex flex-col p-2 border-b mb-2 dark:border-gray-800">
              <div
                title={RelativeTime(transfer.transaction.timestamp * 1000)}
                className="flex text-gray-700 text-xs justify-center"
              >
                {DateTime(transfer.transaction.timestamp * 1000)} ({RelativeTime(transfer.transaction.timestamp * 1000)}
                )
              </div>
              <div className="flex text-sm py-2">
                <div title={transfer.from.id} className="w-0 flex-1 flex mono justify-end">
                  {AddressFormat(transfer.from.id, 'short')}
                  {account && account.toLowerCase() === transfer.from.id && ' (you)'}
                </div>
                <div className="w-10 flex mono items-center justify-center">
                  <ArrowSmRightIcon className="ic" />
                </div>
                <div title={transfer.to.id} className="w-0 flex-1 flex mono items-center justify-start">
                  {account && account.toLowerCase() === transfer.to.id && '(you) '}
                  {AddressFormat(transfer.to.id, 'short')}
                </div>
              </div>

              <div title={transfer.transaction.id + '(block:' + transfer.id + ')'} className="mono text-sm text-center">
                <a
                  href={EXPLORER_BASE_URL + 'tx/' + transfer.transaction.id}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {AddressFormat(transfer.transaction.id, 'short', 'raw')}
                </a>
                <ExternalLinkIcon className="ic" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

const ViewTransfers = props => {
  const tokenID = props.tokenID
  const [showModal, setShowModal] = useState(false)

  function closeModal() {
    setShowModal(false)
    hasVibrate() && navigator.vibrate(75)
  }

  return (
    <>
      <button
        onClick={() => (hasVibrate() ? navigator.vibrate(75) && setShowModal(true) : setShowModal(true))}
        className="button"
      >
        <SwitchHorizontalIcon />
      </button>
      <Transition.Root show={showModal} as={Fragment}>
        <Dialog as="div" static className="dialog_wrapper" open={showModal} onClose={closeModal}>
          <div className="modal_wrapper">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="overlay" />
            </Transition.Child>

            <span className="trick" aria-hidden="true" />

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300 delay-200"
              enterFrom="translate-y-full opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="ease-in"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <div className="transform transition-all modal_card nft-transfers">
                <header>
                  <h3>
                    <SwitchHorizontalIcon className="inline-block text-black dark:text-white w-6 h-6 -mt-1" /> Transfers
                  </h3>
                  <button className="close" onClick={closeModal}>
                    <XIcon />
                  </button>
                </header>

                <main>
                  <Transfers tokenID={tokenID} />
                </main>
                <div className="tfoot"></div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default ViewTransfers
