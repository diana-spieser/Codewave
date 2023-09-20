import { useState, useEffect } from "react";
import { getActiveUsers } from "../../services/user.service";
import UserCard from "../search/CardSearchResult";
import UsersSearchResults from "../search/UsersSearchResults";

function UsersList() {
    const [users, setUsers] = useState([]);

    useEffect(()=> {
        getActiveUsers()
        .then(snapshot => snapshot.exists() ? setUsers(Object.values(snapshot.val())) : null)
        .catch(e => console.error('Error getting users:', e));
    }, []);
    
    return (
        <>
        {users && <UsersSearchResults users={users} />}
        </>
    );
}

export default UsersList;