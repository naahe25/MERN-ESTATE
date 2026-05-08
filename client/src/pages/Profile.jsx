import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserFailure,
    deleteUserSuccess,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import { DEFAULT_AVATAR, getAvatarUrl } from "../utils/avatar.js";
import { parseApiResponse } from "../utils/apiResponse.js";

const Profile = () => {
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [avatarError, setAvatarError] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const [buyerRequests, setBuyerRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [requestsError, setRequestsError] = useState("");

    const dispatch = useDispatch();

    const fetchBuyerRequests = async () => {
        try {
            setRequestsLoading(true);
            setRequestsError("");
            const res = await fetch("/api/request/seller");
            const data = await parseApiResponse(res);

            if (!res.ok || data?.success === false) {
                setRequestsError(data?.message || "Could not load buyer requests");
                return;
            }

            setBuyerRequests(data || []);
        } catch (error) {
            setRequestsError(error.message);
        } finally {
            setRequestsLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?._id) {
            fetchBuyerRequests();
        }
    }, [currentUser?._id]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "Mern-estate"); // Replace with your Cloudinary upload preset

        try {
            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/dpnjbcvr1/image/upload",
                data
            );

            const imageUrl = res.data.secure_url; // Uploaded image URL
            setFormData({ ...formData, avatar: imageUrl });
            setAvatarError(false);
            setFileUploadError(false);
            setFilePerc(100);
        } catch (error) {
            setFileUploadError("Image upload failed. Please try again.");
            setFilePerc(0);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch(`/api/auth/signout`);
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message));
                return;
            }
            dispatch(signOutUserSuccess(data));
        } catch (error) {
            dispatch(signOutUserFailure(error.message));
        }
    };

    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();

            if (data.success === false) {
                setShowListingsError(true);
                return;
            }

            setUserListings(data);
        } catch (error) {
            setShowListingsError(true);
        }
    };

    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: "DELETE",
            });

            const data = await parseApiResponse(res);
            if (!res.ok || data?.success === false) {
                setShowListingsError(data?.message || "Could not delete listing");
                return;
            }

            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
            setBuyerRequests((prev) =>
                prev.filter((request) => request.listingRef !== listingId)
            );
        } catch (error) {
            setShowListingsError(error.message);
        }
    };

    const handleMarkRequestRead = async (requestId) => {
        try {
            setRequestsError("");
            const res = await fetch(`/api/request/${requestId}/read`, {
                method: "PATCH",
            });
            const data = await parseApiResponse(res);

            if (!res.ok || data?.success === false) {
                setRequestsError(data?.message || "Could not update request");
                return;
            }

            setBuyerRequests((prev) =>
                prev.map((request) => (request._id === requestId ? data : request))
            );
        } catch (error) {
            setRequestsError(error.message);
        }
    };

    const avatarUrl = avatarError
        ? DEFAULT_AVATAR
        : getAvatarUrl(currentUser, formData.avatar);

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    onChange={(e) => {
                        setFile(e.target.files[0]);
                        handleFileUpload(e);
                    }}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                />
                <img
                    onClick={() => fileRef.current.click()}
                    src={avatarUrl}
                    alt="profile"
                    onError={() => setAvatarError(true)}
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                />
                <p className="text-sm self-center">
                    {fileUploadError ? (
                        <span className="text-red-700">{fileUploadError}</span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className="text-green-700">Image successfully uploaded!</span>
                    ) : (
                        ""
                    )}
                </p>

                <input
                    type="text"
                    placeholder="username"
                    id="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="text"
                    placeholder="email"
                    id="email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                    id="password"
                    className="border p-3 rounded-lg"
                />

                <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                >
                    {loading ? "Loading..." : "Update"}
                </button>

                <Link
                    className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                    to={"/create-listing"}
                >
                    Create Listing
                </Link>
            </form>
            <div className="flex justify-between mt-5">
                <span
                    onClick={handleDeleteUser}
                    className="text-red-700 cursor-pointer"
                >
                    Delete account
                </span>
                <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
                    Sign out
                </span>
            </div>

            <p className="text-red-700 mt-5">{error ? error : ""}</p>
            <p className="text-green-700 mt-5">
                {updateSuccess ? "Profile updated successfully!" : ""}
            </p>

            <div className="mt-7">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-semibold">Buyer Requests</h2>
                    <button
                        type="button"
                        onClick={fetchBuyerRequests}
                        className="text-green-700 hover:underline"
                    >
                        Refresh
                    </button>
                </div>
                {requestsLoading && <p className="mt-3 text-slate-600">Loading requests...</p>}
                {requestsError && <p className="mt-3 text-red-700">{requestsError}</p>}
                {!requestsLoading && buyerRequests.length === 0 && (
                    <p className="mt-3 text-slate-600">No buyer or renter requests yet.</p>
                )}
                <div className="mt-4 flex flex-col gap-3">
                    {buyerRequests.map((request) => (
                        <div key={request._id} className="border rounded-lg p-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        {request.listingType === "rent" ? "Rent" : "Buy"} request for{" "}
                                        <Link
                                            className="text-green-700 hover:underline"
                                            to={`/listing/${request.listingRef}`}
                                        >
                                            {request.listingName}
                                        </Link>
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        From {request.buyerName} ({request.buyerEmail})
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {new Date(request.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <span
                                    className={`text-xs uppercase rounded px-2 py-1 ${
                                        request.status === "new"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-slate-100 text-slate-700"
                                    }`}
                                >
                                    {request.status}
                                </span>
                            </div>
                            <p className="mt-3 text-slate-700">{request.message}</p>
                            <div className="mt-3 flex flex-wrap gap-3">
                                <a
                                    href={`mailto:${request.buyerEmail}?subject=Regarding ${request.listingName}`}
                                    className="text-green-700 hover:underline"
                                >
                                    Reply by email
                                </a>
                                {request.status === "new" && (
                                    <button
                                        type="button"
                                        onClick={() => handleMarkRequestRead(request._id)}
                                        className="text-slate-700 hover:underline"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleShowListings} className="text-green-700 w-full">
                Show Listings
            </button>
            <p className="text-red-700 mt-5">
                {showListingsError
                    ? typeof showListingsError === "string"
                        ? showListingsError
                        : "Error showing listings"
                    : ""}
            </p>

            {userListings && userListings.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
                    {userListings.map((listing) => (
                        <div
                            key={listing._id}
                            className="border rounded-lg p-3 flex justify-between items-center gap-4"
                        >
                            <Link to={`/listing/${listing._id}`}>
                                <img
                                    src={listing.imageUrls[0]}
                                    alt="listing cover"
                                    className="h-16 w-16 object-contain"
                                />
                            </Link>
                            <Link
                                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                                to={`/listing/${listing._id}`}
                            >
                                <p>{listing.name}</p>
                            </Link>

                            <div className="flex flex-col item-center">
                                <button
                                    onClick={() => handleListingDelete(listing._id)}
                                    className="text-red-700 uppercase"
                                >
                                    Delete
                                </button>
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className="text-green-700 uppercase">Edit</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
