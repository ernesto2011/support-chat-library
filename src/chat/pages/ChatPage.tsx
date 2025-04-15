import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, ThumbsUp, ThumbsDown, Send, MessagesSquare } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router"
import { getClientMessages, sendMessage } from "@/fake/fake-data"
import { Message } from "../interfaces/chat.interface"


export default function ChatPage() {
  const { chatId } = useParams()
  const queryClient= useQueryClient()
  const [input, setInput] = useState("")
  const {data:messages, isLoading}= useQuery({
    queryKey:['messages', chatId],
    queryFn: ()=>getClientMessages(chatId!),
  })
  const {mutate: sendMessageMutation}= useMutation({
    mutationFn: sendMessage,
    onSuccess: (newMessage)=>{
      queryClient.setQueryData(['messages', chatId], (oldMessages: Message[])=>[...oldMessages, newMessage])
    }
  
  })
  const handleSubmit =(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    sendMessageMutation({
      clientId: chatId!, 
      content: input,
      sender: "agent",
      createdAt: new Date()
    })
    setInput('');
  }
  if(isLoading){
    return (
      <div className="flex-1 flex flex-col items-center">
        <div className="space-y-4 w-full max-w-md">
          {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-2 animate-pulse">
          <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-6 bg-muted rounded w-full" />
          </div>
        </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col">
      {
        messages?.length===0 ? (
          <div className="flex-1 flex flex-col gap-2 items-center justify-center">
             <MessagesSquare className=" h-8 w-8 text-muted-foreground"/>
            <div className="flex flex-col items-center text-center text-muted-foreground">
              <p className="text-sm">No messages yet</p>
              <p className="text-sm">Start the conversation</p>
            </div>
          </div>
        )
      :
      (<ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((message, index) => (
            <div key={index} className="w-full">
              {message.sender === "client" ? (
                // Agent message - left aligned
                <div className="flex gap-2 max-w-[80%]">
                  <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">NexTalk</span>
                      <span className="text-sm text-muted-foreground">{message.createdAt.toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // User message - right aligned
                <div className="flex flex-col items-end">
                  <div className="text-right mb-1">
                    <span className="text-sm font-medium mr-2">G5</span>
                    <span className="text-sm text-muted-foreground">{message.createdAt.toLocaleTimeString()}</span>
                  </div>
                  <div className="bg-black text-white p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>)
      }
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Type a message as a customer"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[44px] h-[44px] resize-none py-3"
          />
          <Button type="submit" className="h-[44px] px-4 flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span>Send</span>
          </Button>
        </div>
        </form>
      </div>
    </div>
  )
}