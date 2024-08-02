import { initialData } from "@/seed/seed";
import notFound from "../not-found";
import { ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";


interface Props{
  params:{
    id:Category
  }
}

export default function({params}:Props) {

  const {id}= params;

  // if(id === 'kid'){
  //   notFound();
  // }
  const products = initialData.products.filter(prod=>prod.gender === id);

  const labels:Record<Category,string> = {
    'men':'para hombres',
    'women':'para mujeres',
    'kid':'para niños',
    'unisex':'para todos'
  }

  return (
    <div>
      <Title
        title={`Articulos de ${labels[id]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid
        products={products}
      />
    </div>
  );
}