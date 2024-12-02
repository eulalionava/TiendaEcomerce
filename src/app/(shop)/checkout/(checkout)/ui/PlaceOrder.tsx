'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import clsx from 'clsx';

export const PlaceOrder = () => {
    const router = useRouter();

    const[loaded,setLoaded] = useState(false);
    const[errorMessage,setErrorMessage] = useState('');
    const[isPlacingOrder,setIsPlacingOrder] = useState(false);

    const address = useAddressStore(state=>state.address);
    const {subTotal,tax,total,itemsInCart} = useCartStore(state=>state.getSumaryInformation());

    const cart = useCartStore(state=>state.cart);
    const clearCart = useCartStore(state=>state.clearCart);

    useEffect(()=>{
        setLoaded(true)
    },[]);

    const onPlaceOrder = async()=>{

        setIsPlacingOrder(true);
        
        const productsToOrder = cart.map(product=>({
            productId:product.id,
            quantity:product.quantity,
            size:product.size
        }));

        const resp = await placeOrder(productsToOrder,address);

        if(!resp.ok){
            setIsPlacingOrder(false);
            setErrorMessage(resp.message);
            return;
        }

        clearCart();

        router.replace('/orders/'+resp.order)

    }

    if(!loaded){
        return <p>Loading...</p>
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl rounded-xl font-bold mb-3">Dirección de entrega</h2>

            <div className="mb-10">
                <p className="text-xl">
                    {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city} {address.country}</p>
                <p>{address.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"/>

            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">{itemsInCart ===1 ? '1 artículo':`${itemsInCart} artículos`}</span>
                
                <span>Subtotal</span>
                <span className="text-right">{ currencyFormat(subTotal)}</span>
                
                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
                <p className="mb-5">
                    <span className="text-xs">
                        Al hacer clic cn `&quot;` Colocar orden, aceptas nuestros `&quot;`
                        <a href="#" className="underline">términos y condiciones </a> y <a href="#" className="underline">politicas de privacidad</a>
                    </span>
                </p>

                <p className='text-red-500'>{errorMessage}</p>

                <button
                    className={
                        clsx({
                            'btn-primary': !isPlacingOrder,
                            'btn-disabled': isPlacingOrder
                        })
                    }
                    // href="/orders/1234"
                    onClick={ onPlaceOrder }
                >
                Colocar orden
                </button>
            </div>
        </div>
    )
}
