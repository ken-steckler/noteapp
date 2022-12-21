export default function Message({ children, avatar, username, description }) {
    return(
        <div className="bg-white p-8 border-b-2 rounded-lg">
            <div className="flex items-center gap-2">
                {/* referrerPolicy: https://stackoverflow.com/questions/40570117/http403-forbidden-error-when-trying-to-load-img-src-with-google-profile-pic */}
                <img src={avatar} className="w-10 rounded-full" referrerPolicy="no-referrer"/>
                <h2>{username}</h2>
            </div>
            <div className="py-4">
                <p>
                    {description}
                </p>
            </div>
            {/* see the posts */}
            {children}
        </div>
        
    )
}