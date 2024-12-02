'use client'

import { Product } from "@/interfaces"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface Props{
    produc:Product
}

export const ProductGridItem = ({produc}:Props) => {

    const [displayImage,setDisplayImage] = useState(produc.images[0]);

    return (
        <div className="rounded-md overflow-hidden fade-in">
            <Link href={`/product/${produc.slug}`}>
                <Image
                    src={`/products/${displayImage}`}
                    alt={produc.title}
                    className="w-full object-cover rounded-md"
                    width={500}
                    height={500}
                    onMouseEnter={()=>setDisplayImage(produc.images[1])}
                    onMouseLeave={()=>setDisplayImage(produc.images[0])}
                />
            </Link>

            <div className="p-4 flex flex-col">
                <Link href={`/product/${produc.slug}`} className="hover:text-blue-600">
                    { produc.title}
                </Link>
                <span className="font-bold">{produc.price}</span>
            </div>
        </div>
    )
}
