// src/pages/Profile.jsx
const Profile = () => {
    const username = sessionStorage.getItem('username');
    const email = sessionStorage.getItem('email'); 

    return (
        <div className="profile-page">
            <h2>User Profile</h2>
            <div className="profile-card">
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Email:</strong> {email || 'N/A'}</p>
                <p><strong>Status:</strong> Active</p>
            </div>
        </div>
    );
};

export default Profile;