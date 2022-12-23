import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-3xl font-medium bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-500 inline-block text-transparent bg-clip-text">
          Noteery
        </button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link
            href={"/auth/login"}
            className="py-2 px-4 text-sm bg-gray-800 text-white rounded-lg font-medium ml-8"
          >
            Click to Join
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-blue-800 text-white py-2 px-4 rounded-mg text-sm">
                Post
              </button>
            </Link>
            <Link href="/dashboard">
              {/* https://stackoverflow.com/questions/40570117/http403-forbidden-error-when-trying-to-load-img-src-with-google-profile-pic */}
              <img
                className="w-12 rounded-full cursor-pointer"
                src={user.photoURL}
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
