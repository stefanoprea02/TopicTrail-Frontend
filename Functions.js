export async function adFavorite(ip, jwt, id) {
    return await fetch(`${ip}/post/adFavorite/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    });
}

export async function removeFavorite(ip, jwt, id) {
    return await fetch(`${ip}/post/removeFavorite/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    });
}

export async function checkFavorite(ip, jwt, id){
    return await fetch(`${ip}/post/checkFavorite/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getUser(ip, jwt, username){
    return await fetch(`${ip}/user/${username}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getUsersContainingText(ip, jwt, searchText){
    return await fetch(`${ip}/users/${searchText}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getGroupsContainingText(ip, jwt, searchText){
    return await fetch(`${ip}/group/all?groupTitle=${searchText}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getUnapprovedGroups(ip, jwt){
    return await fetch(`${ip}/group/allnotapproved`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
    .then((response) => response.json())
    .then((data) => data)
}

export async function approveGroup(ip, jwt, title){
    return await fetch(`${ip}/group/approve/${title}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
}

export async function disapproveGroup(ip, jwt, id){
    return await fetch(`${ip}/group/disapprove/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
}

export async function isAdmin(ip, jwt){
    return await fetch(`${ip}/user/isAdmin`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
    .then((response) => response.json())
    .then((data) => data)
}

export async function isModerator(ip, jwt, group){
    return await fetch(`${ip}/user/isModerating/${group}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
    .then((response) => response.json())
    .then((data) => data)
}

export async function addModerator(ip, jwt, username, group){
    return await fetch(`${ip}/user/addModerating/${username}/${group}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
}

export async function removeModerator(ip, jwt, username, group){
    return await fetch(`${ip}/user/removeModerating/${username}/${group}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
}

export async function removePost(ip, jwt, id){
    return await fetch(`${ip}/post/delete/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    })
}

export async function removeComment(ip, jwt, postId, id){
    return await fetch(`${ip}/post/removeComment/${postId}/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    });
}