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

export async function getUsersContainingText(ip, jwt, searchText){
    return await fetch(`${ip}/user/${searchText}`, {
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