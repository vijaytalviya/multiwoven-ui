import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'

import AWS from '../../assets/images/redshift.png'
import Flake from '../../assets/images/snowflake.png'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
const people = [
    {
        name: 'AWS Redshift',
        imageUrl: AWS,
    },
    {
        name: 'Snowflake',
        imageUrl: Flake
    },

    // More people...
]
export const Sources = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [source, setSource] = useState<any>(null)

    const cancelButtonRef = useRef<any>(null)

    const handleNewSource = () => {
        setOpen(true)
    }

    const handleSource = (source: any) => {
        setSource(source)
    }

    const handleClose =()=>{
        setSource(null)
        setOpen(true)
    }

    return (
        <>
            <button onClick={() => handleNewSource()}
                type="button"
                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                    />
                </svg>
                <span className="mt-2 block text-sm font-semibold text-gray-900">Create a new source</span>
            </button>

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            {!source && <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >

                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                                    <p className='flex flex-1 font-medium pb-3'>Please select a source </p>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {people.map((person) => (
                                            <div
                                                key={person.name}
                                                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            >
                                                <div className="flex-shrink-0">
                                                    <img className="h-10 w-10 rounded-full" src={person.imageUrl} alt="" />
                                                </div>
                                                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => handleSource(person)}>
                                                    <span className="absolute inset-0" aria-hidden="true" />
                                                    <p className="text-sm font-medium text-gray-900">{person.name}</p>
                                                    {/* <p className="truncate text-sm text-gray-500">{person.role}</p> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                            }
                            {source && source.name == 'AWS Redshift' &&
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >

                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                                        <form>
                                            <div className="">
                                                <div className="border-b border-gray-900/10 pb-6">
                                                    <h2 className="text-base font-semibold leading-7 text-gray-900">Connect {source.name} to Multiwoven</h2>
                                                    {/* <p className="mt-1 text-sm leading-6 text-gray-600">
                                                        This information will be displayed publicly so be careful what you share.
                                                    </p> */}
                                                </div>

                                                <div className="border-b border-gray-900/10 pb-6 mt-1 pt-0">


                                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                        <div className="sm:col-span-3">
                                                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Hostname
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                placeholder='redshift-host.us-east-1.redshift.amazonaws.com'
                                                                    type="text"
                                                                    name="first-name"
                                                                    id="first-name"
                                                                    autoComplete="given-name"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="sm:col-span-3">
                                                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Port
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    value={5439}
                                                                    type="text"
                                                                    name="last-name"
                                                                    id="last-name"
                                                                    autoComplete="family-name"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="sm:col-span-4">
                                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Database Name
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    id="email"
                                                                    name="email"
                                                                    type="email"
                                                                    autoComplete="email"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                                                />
                                                            </div>
                                                        </div>



                                                        <div className="col-span-full">
                                                            <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Username
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    name="street-address"
                                                                    id="street-address"
                                                                    autoComplete="street-address"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-span-full">
                                                            <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Password
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="password"
                                                                    name="street-address"
                                                                    id="street-address"
                                                                    autoComplete="street-address"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                                                />
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>


                                            </div>

                                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={()=> handleClose()}>
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 pl-2"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    </Dialog.Panel>
                                </Transition.Child>
                            }
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}