import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
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

    const handleGoogleClick = async () => {
        try {
            setError(null);
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                }),
            });

            const data = await parseApiResponse(res);

            if (!res.ok || data?.success == false) {
                throw new Error(data?.message || "Failed to sign in with Google");
            }

            dispatch(signInSuccess(data));
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
