import { useEffect, useState } from "react";
import { parseApiResponse } from "../utils/apiResponse.js";

const Contact = ({ listing }) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState(
        `Hi, I am interested in ${listing.name}. Please contact me about this ${listing.type === "rent" ? "rental" : "property"}.`
    );
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if (data.success === false) {
                    return;
                }
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchLandlord();
    }, [listing.userRef]);


    const onChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const res = await fetch("/api/request/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    listingId: listing._id,
                    message,
                }),
            });
            const data = await parseApiResponse(res);

            if (!res.ok || data?.success === false) {
                setError(data?.message || "Failed to send request");
                return;
            }

            setSuccess("Request sent. The seller can now see it in their profile.");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {landlord && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <p>
                        Contact <span className="font-semibold">{landlord.username}</span>{" "}
                        for{" "}
                        <span className="font-semibold">{listing.name.toLowerCase()}</span>
                    </p>
                    <textarea
                        name="message"
                        id="message"
                        rows="2"
                        value={message}
                        onChange={onChange}
                        placeholder="Enter your message here..."
                        className="w-full border p-3 rounded-lg"
                    ></textarea>

                    <button
                        disabled={loading}
                        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80"
                    >
                        {loading
                            ? "Sending..."
                            : listing.type === "rent"
                                ? "Send Rent Request"
                                : "Send Buy Request"}
                    </button>
                    {success && <p className="text-green-700">{success}</p>}
                    {error && <p className="text-red-700">{error}</p>}
                </form>
            )}
        </div>
    );
};

export default Contact;
