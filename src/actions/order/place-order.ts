'use server';

import type { Address, Size } from "@/interfaces";
import { auth } from "../../../auth.config";
import prisma from "@/lib/prisma";


interface ProductToOrder{
    productId:string;
    quantity:number;
    size:Size
}


export const placeOrder = async(productIds:ProductToOrder[],address:Address)=>{
    const session = await auth();
    const usuarioId = session?.user.id;

    //verificar sesion de usuario
    if(!usuarioId){
        return {
            ok:false,
            message:'No hay session de usario'
        }
    }

    //Obtener la información de los productos
    //Nota: recuerden que podemos llevar más de 2 productos con el mismo ID
    const products = await prisma.product.findMany({
        where:{
            id:{
                in:productIds.map(p=>p.productId)
            }
        }
    });
 

    //Calcular los montos
    const itemsInOrder = productIds.reduce((count,p)=>count + p.quantity,0);

    //Los totales
    const {subTotal,tax,total} = productIds.reduce((totals,item)=>{

        const productQuantity = item.quantity;
        const product = products.find(prod=>prod.id === item.productId);

        if(!product) throw new Error(`${item.productId} no existe`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;

    },{subTotal:0,tax:0,total:0});


    //Crear la transaccion a la base de datos

    try {
        const prismaTx = await prisma.$transaction(async(tx)=>{
            //Actualizar el stock de los productos
            const updateproductsPromises = products.map(async(product)=>{
    
                //acumular los valores
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc,item)=> item.quantity + acc,0)

    
                if(productQuantity === 0){
                    throw new Error(`${product.id}, no tiene cantidad definida`)
                }
    
                return tx.product.update({
                    where:{id:product.id},
                    data:{
                        inStock:{
                            decrement:productQuantity
                        }
                    }
                })
    
            })
    
            const updateProducts = await Promise.all(updateproductsPromises);
    
            //verificar valores negativos en las existencias
    
            updateProducts.forEach(prod=>{
                if(prod.inStock < 0){
                    throw new Error(`${prod.title}, no tiene inventario suficiente`)
                }
            })
    
            //Crear la orden - Encabezado-detalles
            const order = await tx.order.create({
                data: {
                    userId:usuarioId,
                    itemsInOrder:itemsInOrder,
                    subTotal:subTotal,
                    tax:tax,
                    total:total,
    
                    OrdenItem:{
                        createMany:{
                            data: productIds.map(p=>({
                                quantity:p.quantity,
                                size:p.size,
                                productId:p.productId,
                                price:products.find(product=>product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            });
            //Crear la dirección de la orden
            const {country,...restAddress} = address;

            const orderAddress = await tx.orderAddress.create({
                data:{
                    firstName: address.firstName,
                    lastName: address.lastName,
                    address: address.address,
                    postalCode: address.postalCode,
                    phone: address.phone,
                    city: address.city,
                    address2: address.address2,
                    countryId:country,
                    orderId:order.id
                }
            })
    
            return {
                uodatedProducts:updateProducts,
                order:order,
                orderAddress:orderAddress
            }
    
        })

        return {
            ok:true,
            order:prismaTx.order.id,
            prismaTx:prismaTx
        }
        
    } catch (error:any) {
        // console.log(error);
        return{
            ok:false,
            message:error?.message
        }
    }


}