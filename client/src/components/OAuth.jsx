import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";


const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('profile'); // Add profile scope to fetch profile picture
            provider.addScope('email');
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log("User Object:", user);

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL, // Fetch profile picture
                }),
            });

            const data = await res.json();

            dispatch(signInSuccess(data));
            navigate("/");


        } catch (error) {
            console.log('Could not sign in with Google', error);
        }
    };


    return (
        <button onClick={handleGoogleClick} type="button" className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Continue with Google
        </button>
    )
};

export default OAuth;
