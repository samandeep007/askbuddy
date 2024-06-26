import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError }  from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from '@react-email/components'
import { Input } from '@/components/ui/input'


export default function page() {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema)
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post('/api/verify-code', { 
        username: params.username, 
        code: data.code })

      toast({
        title: "Success",
        description: response.data.message
      })

      router.replace('sign-in')
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message;
      toast({
          title: "Signup failed",
          description: errorMessage,
          variant: "destructive"
      })

    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify your account
        </h1>
        <p className="mb-4">You're just a step away from us</p>
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        name="code"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>OTP</FormLabel>
                                <FormControl>
                                    <Input placeholder="One-time Password" {...field}
                                        onChange={e => {
                                            field.onChange(e);
                                        }} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                 
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
    </div>
    </div>
    </div>
   
  )
}
