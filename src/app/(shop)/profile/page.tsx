import { Title } from '@/components'
import React from 'react'
import { auth } from '../../../../auth.config'
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const session = await auth();

    if(!session?.user){
        redirect('/')
    }

    return (
        <>
            <Title title='Perfil'/>
            <p>{JSON.stringify(session,null,2)}</p>
        </>
    )
}
