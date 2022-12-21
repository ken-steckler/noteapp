import { auth, db } from '../utils/firebase'; // import db to access posts
import { useAuthState } from 'react-firebase-hooks/auth';
import { Router, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify'

export default function Post(){
    // Form State
    const [post, setPost] = useState({ description: "" });
    const [user, loading] = useAuthState(auth);
    const route = useRouter();
    const routeData = route.query;

    // Submitting the form and preventing auto refresh with submission
    const submitPost = async (e) => {
        e.preventDefault();
        // Run some checks with toastify before submitting
        // Toastify will show a diaglog box with the error
        // Return to make sure post does not submit in db
        if(!post.description){
            toast.error('Description Field empty 😅', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        }
        if(post.description.length > 300){
            toast.error('Description too long 😅', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        }
        
        if(post.hasOwnProperty("id")){
            const docRef = doc(db, "posts", post.id)
            const updatedPost = {...post, timetamp: serverTimestamp()}
            await updateDoc(docRef, updatedPost)
            return route.push('/')
        } else {
                // Making a reference to the collection, post
        const collectionRef = collection(db, 'posts');
        // Adding the document to the collection
        await addDoc(collectionRef, {
            ...post,
            timestamp: serverTimestamp(),
            user: user.uid,
            avatar: user.photoURL,
            username: user.displayName,
        })
        // Clearing text content in textarea after submitting and redirecting to home
        setPost({ description: "" })
        toast.success("Post has been made!", {position: toast.POSITION.TOP_CENTER, autoclose: 1500,})
        return route.push('/')
    }

}

    //Check our user
    // To determine if new vs edit, edit will carry over current data
    // Firebase stores doc id when editing
    const checkUser = async () => {
        if (loading) return;
        if (!user) route.push("/auth/login");
        if (routeData.id) {
            setPost({ description: routeData.description, id: routeData.id });
        }
    };

    // when user logged in can check if making new post vs edit
    useEffect(() => {
        checkUser();
    }, [user, loading])

    return (
        <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
            <form onSubmit={submitPost}>
                <h1 className="text-2xl font-bold">
                    {post.hasOwnProperty('id') ? "Edit your post" : "Create your post"}
                </h1>
                <div className="py-2">
                    <h3 className="text-lg font-medium py-2">
                        Description
                    </h3>
                    <textarea 
                    value={post.description} 
                    // only update description value,, spread post, this prevents it from turning it into a string and only modifies the description.
                    onChange={(e) => setPost({...post, description: e.target.value})}
                    className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"></textarea>
                    {/* Turns it into red when it goes above 300 characters */}
                    <p className={`text-cyan-600 font-medium text-sm ${post.description.length > 300 ? 'text-red-600' : ''}`}>{post.description.length}/300</p>
                </div>
                <button type="submit" className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm">Submit</button>
            </form>
        </div>
    )
}