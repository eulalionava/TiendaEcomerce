'use server';

import prisma from "@/lib/prisma";
import { auth } from "../../../auth.config";


export const getOrdersByUser = async()=>{

    const sesion = await auth();

    if(!sesion?.user){
        return {
            ok:false,
            message:'Debe estar autenticado'
        }
    }

    const orders = await prisma.order.findMany({
        where:{
            userId:sesion.user.id
        },
        include:{
            OrderAddress:{
                select:{
                    firstName:true,
                    lastName:true
                }
            }
        }
    });

    return{
        ok:true,
        orders:orders
    }
}