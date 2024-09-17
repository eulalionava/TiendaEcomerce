import { initialData } from "./seed";

import prisma from '../lib/prisma'
import { url } from "inspector";


async function main(){

    await Promise.all([
        prisma.productImage.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany()
    ]);

    const {categories,products} = initialData;

    //Categorias
    const categoriesData = categories.map((name)=>({name}));

    await prisma.category.createMany({
        data:categoriesData
    });

    const categoriaDB = await prisma.category.findMany();

    const categoriesMap = categoriaDB.reduce((map,category)=>{
        map[category.name.toLowerCase()] = category.id;
        return map;
    },{} as Record<string,string>);

    
    products.forEach( async (product)=>{
        const {images,type,...rest} = product;
    
        const dbProduct = await prisma.product.create({
            data:{
                ...rest,
                categoryId:categoriesMap[type]
            }
        });

        //Images
        const imageData = images.map(image=>({
            url:image,
            productId:dbProduct.id
        }));
        console.log(imageData);

        await prisma.productImage.createMany({
            data:imageData
        });

    });

    

    console.log('seed ejecutado correctamente');
}

(()=>{
    if(process.env.NODE_ENV === 'production') return

    main();
})();