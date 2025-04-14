import { getClient } from "@/fake/fake-data"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import { ContactInfo } from "./ContactInfo"
import { NoContactSelected } from "./NoContactSelected"
import { ContactInfoSkeleton } from "./ContactInfoSkeleton"

export const ContactDetails = () => {
    const {chatId} = useParams()
    const {data:client, isLoading} = useQuery({
        queryKey: ['client', chatId],
        queryFn: ()=>getClient(chatId ?? ''),
        enabled: !!chatId,
        staleTime: 1000 * 60 * 5
    })
    if(!chatId) return (<NoContactSelected/>)
    if(isLoading && !client) return (<ContactInfoSkeleton/>)
    if(client) {
        return <ContactInfo client={client}/>
    }
  return (
    <div>client not found</div>
  )
}
