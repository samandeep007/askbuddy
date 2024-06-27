'use client'
import React from 'react'
import {useState, useEffect} from 'react'
import axios, {AxiosError} from 'axios'
import { useParams } from 'next/navigation'
import * as z from 'zod'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from '@/components/ui/use-toast'
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



export default function page() {
  const[isSubmitting, setIsSubmitting] = useState(false)
  const params = useParams<{ username: string }>();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })


  const message = form.watch("content");
  
  

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsSubmitting(true)
      const response = await axios.post<ApiResponse>('/api/send-message', {username: params.username, content: data.content})
      if(!response.data.success){
        toast({
           title: response.data.message,
           variant: "default"
        })
      }
      else {
        toast({
          title: response.data.message,
          variant: "default"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || 'Unable to send message',
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <>
  <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Write your anonymous message here" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={message?.length === 0 || isSubmitting}>Submit</Button>
      </form>
    </Form>
    </>

  )
}
