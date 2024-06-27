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
import { Textarea } from "@/components/ui/textarea"
import { Separator } from '@/components/ui/separator'


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
import { useRouter } from 'next/navigation'



export default function page() {
  const[isSubmitting, setIsSubmitting] = useState(false)
  const params = useParams<{ username: string }>();
  const {toast} = useToast();

  const[messages, setMessages] = useState([
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?"
  ])


  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })



const message = form.watch("content") || ''

  
  

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

  const suggestMessages = async () => {
        try {
          const response = await axios.post('/api/suggest-messages');
          setMessages(response.data.messages.split("||"))
          
        } catch (error) {
          console.log(error)
        }
  }



  return (
    <div className=' md:w-7/12 md:mx-auto my-12 p-4 '>
      <h1 className='text-center text-4xl font-bold'>Public Profile Link</h1>
      <div >
  <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className='mt-8'>
        <FormField
          control={form.control}
      
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send Anonymous Message to @{params.username}</FormLabel>
              <FormControl>
              <Textarea placeholder="Write your anonymous message here" {...field}  onChange={e => {
                        field.onChange(e);
                      }} />
                
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-center my-8'>
        <Button type="submit" className='mx-auto' disabled={message.length === 0 || isSubmitting}>Send It</Button>
        </div>
      </form>
    </Form>
    
    </div>
   
    <Button onClick={suggestMessages} >Suggest Messages</Button>
    <h1 className='mt-4'>Click on any message below to select it.</h1>
    <div className='flex flex-col space-y-4 border-gray-200 border rounded-lg p-8 mt-4 mb-8' >
      <h1 className='text-2xl font-semibold'>Messages</h1>
    {messages.map((message, index) => (
    <Button className="bg-transparent text-black hover:bg-gray-100 border-gray-200 border" onClick={()=>{form.setValue("content", message )}} key={index}>{message}</Button>
    ))}
   
    </div>
    <Separator/>

<h1 className='text-center my-4'>Get Your Message Board</h1>
<div className='flex items-center'>
    <Button className="mx-auto" onClick={()=>{useRouter().replace('/sign-up')}}>Create Your Account</Button>
    </div>
    </div>

  

  )
}
