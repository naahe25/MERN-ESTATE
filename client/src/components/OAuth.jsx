import {
    GoogleAuthProvider,
    getAdditionalUserInfo,
    getAuth,
    signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase.js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";
import { parseApiResponse } from "../utils/apiResponse.js";


const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const getGoogleProfilePhoto = async (accessToken) => {
        if (!accessToken) return null;

        try {
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) return null;

            const profile = await res.json();
            return profile.picture || null;
        } catch (error) {
            return null;
        }
    };

    const handleGoogleClick = async () => {
        try {
            setError(null);
            const provider = new GoogleAuthProvider();
            provider.addScope("profile");
            provider.addScope("email");
            provider.setCustomParameters({ prompt: "select_account" });
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const googleProvider = user.providerData.find(
                (provider) => provider.providerId === "google.com"
            );
            const additionalInfo = getAdditionalUserInfo(result);
            const fetchedGooglePhoto = await getGoogleProfilePhoto(
                credential?.accessToken
            );
            const photo =
                fetchedGooglePhoto ||
                additionalInfo?.profile?.picture ||
                result._tokenResponse?.photoUrl ||
                googleProvider?.photoURL ||
                user.photoURL ||
                null;

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                    photo,
                    avatar: photo,
                    accessToken: credential?.accessToken,
                }),
            });

            const data = await parseApiResponse(res);

            if (!res.ok || data?.success == false) {
                throw new Error(data?.message || "Failed to sign in with Google");
            }

            dispatch(signInSuccess({
                ...data,
                ...(photo ? { avatar: photo, photo } : {}),
            }));
            navigate("/");
        } catch (error) {
            setError(error.message);
            console.error('Could not sign in with Google', error);
        }
    };

    return (
        <>
            <button onClick={handleGoogleClick} type="button" className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                Continue with Google
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </>
    )
};

export default OAuth;
