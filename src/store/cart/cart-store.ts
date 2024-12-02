import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface State {
    cart:CartProduct[];
    getTotalItems:()=>number
    getSumaryInformation:()=>{
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    }
    addProductToCart:(product:CartProduct)=>void;
    updateProductQuantity:(product:CartProduct,quantity:number)=>void;
    removeProduct:(product:CartProduct)=>void;

    clearCart: ()=>void;
}

export const useCartStore=create<State>()(
    persist(
        (set,get)=>({
            cart:[],

            getTotalItems: ()=>{
                const {cart} = get();
                return cart.reduce((total,item)=>total+item.quantity, 0)
            },
            getSumaryInformation:()=>{
                const { cart } = get();

                const subTotal = cart.reduce((subTotal,product)=>product.quantity * product.price + subTotal,0);
                const tax = subTotal * 0.15;
                const total = subTotal + tax;
                const itemsInCart =  cart.reduce((total,item)=>total+item.quantity, 0);

                return {
                    subTotal,
                    tax,
                    total,
                    itemsInCart
                }
            },
    
            addProductToCart:(product:CartProduct)=>{
                const { cart } = get();
                // Revisar si el producto existe en el carrito con la talla seleccionada
    
                const productInCart = cart.some(
                    (item)=>(item.id === product.id && item.size === product.size)
                )
    
                if(!productInCart){
                    set({cart: [...cart, product]});
                    return
                }
    
                //Se que el producto existe por talla... tengo que incrementar
    
                const updateCartProducts = cart.map((item)=>{
                    if(item.id === product.id && item.size === product.size){
                        return { ...item,quantity:item.quantity + product.quantity}
                    }
    
                    return item;
                });
    
                set({cart:updateCartProducts})
            },
            updateProductQuantity:(product:CartProduct,quantity:number)=>{
                const { cart } = get();

                const updateCartProducts = cart.map(item=>{
                    if(item.id === product.id && item.size === product.size){
                        return {...item,quantity:quantity}
                    }

                    return item;
                })

                set({cart:updateCartProducts});
            },
            removeProduct:(product:CartProduct)=>{
                const { cart } = get();

                const updateCartProducts = cart.filter(
                    (item)=>item.id !== product.id || item.size !== product.size
                );

                console.log(updateCartProducts);
                
                set({cart:updateCartProducts});
            },
            clearCart:()=>{
                set({cart:[]})
            }
        }),
        {
            name:'shopping-cart'
        }
    )
    
);