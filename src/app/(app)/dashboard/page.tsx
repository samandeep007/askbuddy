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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"
import MessageCard from "@/components/MessageCard";


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
      if(messages?.length === 0){
        toast({
          title: "Message Inbox updated",
          description: "User inbox is empty"
        })
      }
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


 
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "Url Copied!",
      description: "Profile URL has been copied to clipboard"
    })
  }



 if(!session || !session.user ){
  return <div>Please login</div>
 }

  //TODO: do more research
  const {username} = session.user as User
  const baseUrl = `${window.location.protocol}://${window.location.host}` 
  const profileUrl = `${baseUrl}/u/${username}`


  

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-bold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
      />
      <span className="ml-2">
        Accept Messages: {acceptMessages ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        fetchMessages(true);
      }}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>

    {
      isLoading ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-20">
      {Array.from({length: 6}).map((_, index)=>(
        <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
   
      ))}
      </div>) :
    ( 
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
        <div>
           <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
        </div>
        ))
      ) : (
        <p>No messages to display.</p>
      )} 
      </div>
   
   )
    }
     </div>
   

  )
}
