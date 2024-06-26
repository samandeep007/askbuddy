import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'

export default function page() {
  const router = useRouter()
  const params = useParams<{username: string}>()
  const {toast} = useToast()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema)
})

const onSubmit = async(data: z.infer<typeof verifySchema>) => {
  try {
    await axios.post('/api/verify-code', {username: params.username, code: data.code})
  } catch (error) {
    
  }
}
  return (
    <div>page</div>
  )
}
