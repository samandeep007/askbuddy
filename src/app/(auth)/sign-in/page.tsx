'use client'
import {useState} from 'react'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from '@/schemas/signInSchema'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from '@/components/ui/use-toast'
import { signIn } from 'next-auth/react'


export default function SigninPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema)
  })
 
  const onSubmit = async(data: z.infer<typeof signInSchema>) =>{
      setIsSubmitting(true)
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })
      if(result?.error){
        if(result.error === 'CredentialSignin'){
          toast({
            title: "Login Failed",
            description: "Incorrect username or password",
            variant: "destructive"
          })
          setIsSubmitting(false)
        }
        else {
          toast({
            "title": "Error",
            description: result.error,
            variant: "destructive"
          })
          setIsSubmitting(false)
        }
       
      }

      if(result?.url){
        setIsSubmitting(false)
        router.replace('/dashboard')
      }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
        <div></div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <Input placeholder="username/email" {...field}
                      onChange={e => {
                        field.onChange(e);
                      }} />
                  </FormControl>
                </FormItem>
              )}
            />
              <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field}
                      onChange={e => {
                        field.onChange(e);
                      }} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  </div>
  )
}
