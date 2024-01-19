import { useEffect, useState } from "react"
import { BASE_URL } from "../utils/constants"
import { Link } from "react-router-dom"

type Props = {
    landlordId: string,
    listingName: string
}

type Landlord = {
    email: string,
    username: string
}

const ContactLandlord = ({ landlordId, listingName }: Props) => {
    const [landlord, setLandlord] = useState<null | Landlord>(null)
    const [message, setMessage] = useState("")
    
    useEffect(() => {
        const fetchLandLordEmail = async () => {
            const res = await fetch(`${BASE_URL}/api/v1/user/${landlordId}`, {
                credentials: "include",
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            console.log(data.user)
            setLandlord(data.user)
        }
        fetchLandLordEmail()
    }, [landlordId])

    return (
        <>
        {landlord && (
            <div className="flex flex-col gap-2">
                <p>
                    Contact <span className="font-semibold">{landlord.username}</span>
                </p>
                <textarea 
                    name="message" 
                    id="message" 
                    rows={2} 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    className="w-full border p-3 rounded-lg"
                >
                </textarea>
                <Link className="bg-slate-700 text-white p-3 text-center uppercase rounded-lg hover:opacity-95" to={`mailto:${landlord.email}?subject=Regarding ${listingName}&body=${message}`}>
                    Send Message
                </Link>
            </div>
        )}
        </>
    )
}

export default ContactLandlord