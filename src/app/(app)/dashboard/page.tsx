'use client'
import { useCallback, useEffect, useState } from "react"
import { Message } from "@/model/User"
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from 'axios'
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "next-auth";


export default function DashboardPage() {
  const[messages, setMessages] = useState<Message[]>([]);
  const[isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const {toast} = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message: Message) => message._id !== messageId))
  }

  const {data: session} = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {register, watch, setValue} = form; //Read documentation for better understanding

  const acceptMessages = watch('acceptMessages'); //Field name is 'acceptMessages : watch is a function

  const fetchAcceptMessage = useCallback(async() => {
   setIsSwitchLoading(true);
   try {
    const response = await axios.get<ApiResponse>('/api/accept-messages')
    setValue('acceptMessages', response.data.isAcceptingMessages!)
   
   } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast({
      title: "Error",
      description: axiosError.response?.data.message || "Failed to fetch message settings",
      variant: "destructive"
    })
   } finally {
    setIsSwitchLoading(false)
   }

  }, [setValue]);


  const fetchMessages = useCallback(async(refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if(refresh){
        toast({
          title: "Message Inbox updated",
          description: "Showing latest messages"
        })
      }

      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
     } finally {
      setIsLoading(false)
     }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages();
    fetchAcceptMessage();

  }, [session, setValue, fetchAcceptMessage, fetchMessages])


  //handle switch change
  const handleSwitchChange = async() => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message', {acceptMessages: !acceptMessages})
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response?.data.message || 'Message acceptance changed',
        variant: "default"
      })
 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive"
      })
      
    }
  }

  const {username} = session?.user as User
  //TODO: do more research
  const baseUrl = `${window.location.protocol}://${window.location.host}` 
  const profileUrl = `{baseUrl}/u/${username}`
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "Url copied to clipboard",
      description: "Profile URL has been copied to clipboard"
    })
  }



 if(!session || !session.user ){
  return <div>Please login</div>
 }


  

  return (
    <div>page</div>
  )
}
