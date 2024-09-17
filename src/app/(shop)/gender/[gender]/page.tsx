export const revalidate = 60;

import { Pagination, ProductGrid, Title } from "@/components";
import { getPaginatedProductsWithImages } from "@/actions";
import { redirect } from "next/navigation";
import { Gender } from "@prisma/client";



interface Props{
  params:{
    gender:string
  },
  searchParams:{
    page?:string
  }
}

export default async function GenderByPage ({params,searchParams}:Props) {

  const {gender}= params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products,currentPage,totalPages } = await getPaginatedProductsWithImages({
    page,
    gender:gender as Gender
  });

  if(products.length === 0){
    redirect(`/gender/${gender}`);
  }

  // if(id === 'kid'){
  //   notFound();
  // }

  const labels:Record<string,string> = {
    'men':'para hombres',
    'women':'para mujeres',
    'kid':'para niños',
    'unisex':'para todos'
  }

  return (
    <div>
      <Title
        title={`Articulos de ${labels[gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid
        products={products}
      />

      <Pagination totalPages={totalPages}/>
    </div>
  );
}