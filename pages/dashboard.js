import { auth, db } from "../utils/firebase" //for signning out
import { useAuthState } from "react-firebase-hooks/auth" // to ensure user won't see dashboard when loggeed out
import { useRouter } from "next/router" // to route the user when logged out
import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore"
import Message from "../components/message"
import { BsTrash2Fill } from "react-icons/bs"
import { AiFillEdit } from "react-icons/ai"
import Link from "next/link"

export default function Dashboard() {
    const route = useRouter()
    const [user, loading] = useAuthState(auth) // Used when logging out
    const [posts, setPosts] = useState([])
    
    // Check if user is logged in 
    const getData = async () => {
        if(loading) return;
        // If user is not logged in then route them to login page
        if(!user) return route.push('/auth/login');
        // If user exists then get back all posts
        const collectionRef = collection(db, 'posts');
        // the user id is represented as uid
        const q = query(collectionRef, where("user", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsubscribe;
    };

    // Delete Post by getting reference of the document to get rid of
    const deletePost = async(id) => {
        const docRef = doc(db, 'posts', id)
        await deleteDoc(docRef)
    }

    // Get user data
    useEffect(() => {
        getData()
    }, [user, loading])


    return(
        <div>
            <h1>Your posts</h1>
            <div className>
                {posts.map((post) => {
                    return (
                    <Message {...post} key={post.id}>
                        <div className="flex gap-4">
                            <button onClick={() => deletePost(post.id)} className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm">
                                <BsTrash2Fill className="text-2xl"/>Delete
                            </button>
                            <Link href={{ pathname: "/post", query:post }}>
                                <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                                    <AiFillEdit className="text-2xl"/>Edit
                                </button>
                            </Link>
                        </div>
                    </Message>
                    );
                })}
            </div>
            <button className="font-medium text-white bg-gray-800 py-2 px-4 my-6"
                onClick={() => auth.signOut()}>
                Sign out
            </button>
        </div>
    )
}