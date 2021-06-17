import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon, PaperAirplaneIcon } from '@heroicons/react/solid'

function Transfer721() {
  const [showModal, setShowModal] = useState(false)

  const [buttonDisabled, setButtonDisabled] = useState(false)

  function closeModal() {
    setShowModal(false)
  }

  function onConfirm() {
    setTimeout(() => {
      setShowModal(false)
    }, 1500)
  }

  return (
    <>
      <button className="btn-transfer" onClick={() => setShowModal(true)}>
        <PaperAirplaneIcon />
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

            <span className="trick" aria-hidden="true">
              　
            </span>

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
                <header>
                  <h3>Transfer</h3>
                  <button className="close" onClick={closeModal}>
                    <XIcon />
                  </button>
                </header>

                <main>
                  <div className="group">
                    <label htmlFor="address">Transfer To</label>
                    <div className="mt-1 flex">
                      <input
                        defaultValue=""
                        type="text"
                        name="address"
                        id="address"
                        placeholder="recipient's address"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </main>

                <footer>
                  <button
                    disabled={buttonDisabled}
                    onClick={() => {
                      onConfirm()
                    }}
                    type="button"
                    className="primary"
                  >
                    Confirm Transfer
                  </button>
                </footer>
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
