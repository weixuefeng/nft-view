import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon, PaperAirplaneIcon } from '@heroicons/react/solid'
import { XCircleIcon } from '@heroicons/react/outline'
import { isValidNewAddress, newAddress2HexAddress, isValidHexAddress } from 'helpers/newchain-util'
import { useERC721Contract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { getAddress } from '@ethersproject/address'
import QrReader from 'react-qr-reader'
import { CameraCircleArrowOutline, ScanQrOutline, XMarkIcon } from 'components/icons'
import { isAndroid } from 'react-device-detect'
import { hasVibrate } from 'utils/hasHTML5API'
import { AddressFormat } from 'components/AddressFormat'

function isNewAddrCurrentChain(addr = '') {
  if (isValidNewAddress(addr) && AddressFormat(newAddress2HexAddress(addr)) === addr) {
    return true
  } else {
    return false
  }
}

const Transfer721 = props => {
  const web3Context = useWeb3React()
  const { account } = web3Context
  const erc721Contract = useERC721Contract(props.contractID, true)
  const [scanAddr, setScanAddr] = useState('')
  const [useScanner, setUseScanner] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [targetAddress, setTargetAddress] = useState(null)

  function closeModal() {
    setUseScanner(false)
    setShowModal(false)
    setScanAddr('')
    setButtonDisabled(true)
    hasVibrate() && navigator.vibrate(75)
  }

  function onUseSanner() {
    setUseScanner(true)
    setScanAddr('')
  }

  const onChange = e => {
    setTargetAddress(e.target.value)
    if (isNewAddrCurrentChain(e.target.value) || isValidHexAddress(e.target.value)) {
      setButtonDisabled(false)
    } else {
      setTargetAddress(null)
      setButtonDisabled(true)
    }
  }

  function useScanAddr(addr) {
    setScanAddr(addr)
    setTargetAddress(addr)
    setButtonDisabled(false)
  }

  function clearScan() {
    setScanAddr('')
    setTargetAddress(null)
    setButtonDisabled(true)
  }

  function onConfirm() {
    if (!account) {
      window.alert('Please connect wallet')
      return
    }
    let address = targetAddress
    // console.log('addr:' + address)
    if (isValidNewAddress(targetAddress)) {
      address = newAddress2HexAddress(targetAddress)
    }
    // console.log('addr:' + address)

    erc721Contract.transferFrom(account, getAddress(address), parseInt(props.tokenID))
    // .then(res => {
    //   console.log(res)
    // })
    // .catch(error => {
    //   console.log(error)
    // })

    setTimeout(() => {
      closeModal(false)
    }, 1500)
  }

  return (
    <>
      <button
        className="btn-transfer"
        onClick={() => (hasVibrate() ? navigator.vibrate(75) && setShowModal(true) : setShowModal(true))}
      >
        <PaperAirplaneIcon /> Transfer
      </button>
      <Transition.Root show={showModal} as={Fragment}>
        <Dialog as="div" static className="dialog_wrapper" open={showModal} onClose={closeModal}>
          <div className="modal_wrapper">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200 delay-200"
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
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <div className="transform transition-all modal_card">
                {useScanner && (
                  <>
                    <header>
                      <h3>
                        <ScanQrOutline className="inline-block text-black dark:text-white animate-pulse w-8 h-8 -mt-1" />{' '}
                        Scan QR Code
                      </h3>
                    </header>
                    <QrScanner onScanResult={setScanAddr} onUseScanner={setUseScanner} onUseScanAddr={useScanAddr} />
                  </>
                )}

                {!useScanner && (
                  <>
                    <header>
                      <h3>
                        <PaperAirplaneIcon className="inline-block text-black dark:text-white w-6 h-6 -mt-1" /> Transfer
                        NFT
                      </h3>
                      <button className="close" onClick={closeModal}>
                        <XIcon />
                      </button>
                    </header>
                    <main className={isAndroid && 'transfer-nft-android-hack'}>
                      <div className="group">
                        <label htmlFor="targetAddress">To</label>
                        {scanAddr === '' && (
                          <div className="mt-1 flex">
                            <input
                              defaultValue=""
                              name="targetAddress"
                              id="targetAddress"
                              placeholder="recipient's address"
                              autoComplete="off"
                              onChange={onChange}
                              type="text"
                            />
                          </div>
                        )}
                      </div>
                      {scanAddr !== '' && (
                        <>
                          <p className="break-all">{scanAddr}</p>
                          <p className="pt-4 text-center">
                            <button onClick={clearScan} type="button">
                              <XCircleIcon className="w-10 h-10 text-gray-500 hover:bg-gray-100 hover:dark:bg-gray-800 p-1 rounded-lg" />
                            </button>
                          </p>
                        </>
                      )}

                      {!useScanner && scanAddr === '' && !isAndroid && (
                        <p className="pt-4 text-center">
                          <button onClick={onUseSanner} type="button">
                            <ScanQrOutline
                              className="w-10 h-10 text-gray-500 hover:bg-gray-100 hover:dark:bg-gray-800 p-1 rounded-lg"
                              onClick={onUseSanner}
                            />
                          </button>
                        </p>
                      )}
                    </main>

                    <footer>
                      <button disabled={buttonDisabled} onClick={onConfirm} type="button" className="primary">
                        Transfer
                      </button>
                    </footer>
                  </>
                )}

                <div className="tfoot"></div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default Transfer721

const QrScanner = ({ onScanResult, onUseScanner, onUseScanAddr, handleScan, handleError }) => {
  const [selfie, setSelfie] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [isValidAddress, setIsValidAddress] = useState(false)

  function closeScanner() {
    onUseScanner(false)
  }

  handleScan = data => {
    if (data) {
      setScanResult(data)
      if (isNewAddrCurrentChain(data) || isValidHexAddress(data)) {
        setIsValidAddress(true)
        onScanResult(data)
        setTimeout(() => {
          onUseScanAddr(data)
          onUseScanner(false)
        }, 500)
      } else {
        setIsValidAddress(false)
      }
      // console.log(data)
    }
  }
  handleError = err => {
    console.error(err)
  }

  return (
    <>
      <main>
        <QrReader
          delay={100}
          onError={handleError}
          onScan={handleScan}
          resolution={1200}
          showViewFinder={true}
          facingMode={selfie ? 'user' : 'environment'}
          className="qr-reader-frame"
        />
        <p className="text-center truncate">
          {!scanResult && '　'}
          {isValidAddress && '✅'} {!isValidAddress && scanResult && '❌'} {scanResult && scanResult}
        </p>
      </main>
      <footer>
        <div className="grid gap-4 grid-cols-2 justify-center content-center gap-3">
          <div className="inline-flex justify-center w-full">
            <button onClick={() => setSelfie(!selfie)}>
              <CameraCircleArrowOutline className="w-16 h-16 text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl" />
            </button>
          </div>
          <div className="inline-flex justify-center w-full">
            <button onClick={() => closeScanner()}>
              <XMarkIcon className="w-16 h-16 text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl" />
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
