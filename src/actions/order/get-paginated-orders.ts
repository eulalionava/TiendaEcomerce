'use server';

import prisma from "@/lib/prisma";
import { auth } from "../../../auth.config";


export const getPaginatedOrders = async()=>{

    const sesion = await auth();

    if(sesion?.user.role !== 'admin'){
        return {
            ok:false,
            message:'Debe estar autenticado'
        }
    }

    const orders = await prisma.order.findMany({
        orderBy:{
            createdAt:'desc'
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