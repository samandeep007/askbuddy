'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

export default function Navbar() {
    const {data: session} = useSession();
    const user: User = session?.user as User


  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto grid grid-flow-col  md:grid-col justify-between items-center'>
            <a className="text-xl font-bold mb-4 md:mb-0" href="#">Ask Buddy</a>
            {
                session ? (
                    <>
                    <span className='mr-4'>
                        Welcome, {user?.username || user?.email}
                    </span>
                    <Button className="md:m-auto w-full" onClick={() => signOut()}>Logout</Button>
                    </>
                ): (
                    <Link href='/sign-in'>
                        <Button>Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}
