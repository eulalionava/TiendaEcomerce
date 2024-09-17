export const generatePaginationNumbers = (currentPage:number,totalPages:number)=>{
    //si el numero total de páginas  es 7 o menos
    // vamos a mostrar todas la páginas sin puntos suspensivos
    if(totalPages <= 7){
        return Array.from({length:totalPages},(_,i)=>i+1);;
    }

    //Si la página actual esta 3, entre las primeras 3 páginas
    //  mostrar las primeras 3, puntos suspensivos  y las ultimas 2
    if(currentPage <= 3){
        return [1,2,3,'...',totalPages -1,totalPages];
    }

    //si la pagina actual esta entre las últimas 3 páginas
    //mostrar las primeras 2, puntos suspensivos, las últimos 3 páginas
    if(currentPage >= totalPages -2){
        return[1,2,'...',totalPages-2,totalPages-1,totalPages]
    }

    //si la página actual está en otro lugar medio
    //mostrar la primera página, puntos suspensivos, la página actual
    return[
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ]

    
}