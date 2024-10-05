import { redirect } from "next/navigation";
import { auth } from "../../../../auth.config";

export default async function CheckoutLayout({children}: {
 children: React.ReactNode;
}) {

    const sesion = await auth();

    if(!sesion){
        redirect('/auth/login?redirecTo=/checkout/address');
    }

    return (
        <>
            { children }
        </>
    );
}