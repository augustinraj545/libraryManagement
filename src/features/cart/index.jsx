import React from 'react'
import { cartStore } from "../../lib/stores";
import { NavLink } from 'react-router-dom';

export default function Cart() {
    const cart = cartStore((state) => state.cart)
    const getTotal = cartStore((state) => state.getTotal);
    const getTotalQuantity = cartStore((state) => state.getTotalQuantity);
    const addItem = cartStore((state) => state.addItem)
    const removeItem = cartStore((state) => state.removeItem)

    return (
        <div className='mx-auto max-w-6xl'>
            <p className='mt-10 mx-4 text-7xl font-bold'>Shopping Cart</p>
            <div className='relative flex flex-row mt-10 mx-4'>
                <div className='w-full pr-10'>
                    {cart.length > 0 ? cart.map((book, index) =>
                        <div key={index}>
                            <div className='flex gap-4'>
                                <div className='w-48 h-72 border'>
                                    <img src={book.volumeInfo?.imageLinks?.smallThumbnail || book.volumeInfo.imageLinks?.thumbnail || NoImageAvailable} className="w-full h-full" />
                                </div>
                                <div className='flex flex-[1] flex-col justify-between'>
                                    <div>
                                        <p className='font-bold text-xl'>
                                            {book.volumeInfo?.title}
                                        </p>
                                        <p>
                                            Published By {book.volumeInfo?.publisher || 'NO RECORD'}, {book.volumeInfo?.publishedDate || 'NO RECORD'}
                                        </p>
                                    </div>
                                    <div className='flex justify-start items-start'>
                                        <div className='font-bold text-2xl mt-4'>
                                            <span className='font-normal text-sm'>each</span> ₹.{book.saleInfo?.listPrice?.amount}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-around px-4'>
                                    <div>
                                        <p className='font-medium'>Total</p>
                                        <div className='font-bold text-2xl'>₹.{Math.round(book.saleInfo?.listPrice?.amount) * book.quantity}</div>
                                    </div>
                                    <div>
                                        <p className='mb-2'>Quantity</p>
                                        <div className='flex'>
                                            <button className='px-4 py-2 bg-slate-700' onClick={() => { removeItem(book) }}>
                                                -
                                            </button>
                                            <div className='py-2 px-4 bg-slate-800'>{book.quantity}</div>
                                            <button className='px-4 py-2 bg-slate-700' onClick={() => { addItem(book) }}>
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="bg-white h-[1px] my-4 mb-10" />
                        </div>) :
                        <div className='flex flex-col py-4'>
                            <div className='text-4xl font-bold'>
                                No books added yet!
                            </div>
                            <NavLink to="/shop" className="mt-4 text-center rounded-md bg-white text-blue-600 font-bold p-4">Shop Now</NavLink>
                        </div>
                    }


                </div>
                {cart.length > 0 ?
                    <div className='sticky top-0 h-96 w-2/5 pt-4'>
                        <div className='flex flex-col justify-between h-full rounded-md bg-slate-800 text-slate-300 p-4'>
                            <div className='flex flex-col h-full'>
                                <div>
                                    <p className='font-bold mb-2'>TOTAL</p>
                                    <p className='font-bold text-5xl'>
                                        ₹. {getTotal()}
                                    </p>
                                </div>

                                <div className='flex flex-col h-full my-4 text-lg'>
                                    <p>
                                        <span className='font-bold'>Books:</span> x{getTotalQuantity()}
                                    </p>
                                </div>

                            </div>
                            <button className='text-center w-full py-2 px-4 text-xl font-bold bg-blue-600 text-white rounded-md'>
                                Proceed to Buy
                            </button>
                        </div>

                    </div> : null}

            </div>
        </div>
    )
}
