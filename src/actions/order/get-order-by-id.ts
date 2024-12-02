'use server'

import prisma from "@/lib/prisma";
import { auth } from "../../../auth.config"

export const getOrderbyId = async(id:string)=>{
    const sesion = await auth();

    if(!sesion?.user){
        return {
            ok:false,
            message:'Debe de estar autenticado'
        }
    }

    try {
        const order = await prisma.order.findUnique({
            where:{id},
            include:{
                OrderAddress:true,
                OrdenItem:{
                    select:{
                        price:true,
                        quantity:true,
                        size:true,

                        product:{
                            select:{
                                title:true,
                                slug:true,

                                ProductImage:{
                                    select:{
                                        url:true
                                    },
                                    take:1
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!order) throw `${id} no existe`;

        if(sesion.user.role === 'user'){
            if(sesion.user.id !== order.userId){
                throw `${id} no es de ese usuario`;
            }
        }

        return {
            ok:true,
            order:order
        }
        
    } catch (error) {
        return {
            ok:false,
            message:'Hable con el administrador'
        }
    }
}