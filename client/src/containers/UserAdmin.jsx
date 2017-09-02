import React from 'react';
import ViewProfile from './ViewProfile';
import UserPosts from './UserPosts';


const UserAdmin = (props) => (
      <div className="user-admin">
	      <ViewProfile />
	      <UserPosts />
      </div>
      );

export default UserAdmin;