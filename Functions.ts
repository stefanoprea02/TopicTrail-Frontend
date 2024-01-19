export async function adFavorite(ip: string, jwt: string, id: string) {
  return await fetch(`${ip}/post/adFavorite/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export async function getFavoritePosts(
  ip: string,
  jwt: string,
  username: string
) {
  return await fetch(`${ip}/post/favorites?username=${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching favorite posts:", error));
}

export async function removeFavorite(ip: string, jwt: string, id: string) {
  return await fetch(`${ip}/post/removeFavorite/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export async function checkFavorite(ip: string, jwt: string, id: string) {
  return await fetch(`${ip}/post/checkFavorite/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getUser(
  ip: string,
  jwt: string,
  username: string
): Promise<User> {
  return await fetch(`${ip}/user/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function joinGroup(
  ip: string,
  jwt: string,
  group: string
): Promise<void> {
  await fetch(`${ip}/group/join/${group}`, {
    method: "GEt",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
  return;
}

export async function leaveGroup(
  ip: string,
  jwt: string,
  group: string
): Promise<void> {
  await fetch(`${ip}/group/leave/${group}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
  return;
}

export async function groupFindByUser(
  ip: string,
  jwt: string,
  username: string
): Promise<Group[]> {
  return await fetch(`${ip}/group/findByUser/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getUsersContainingText(
  ip: string,
  jwt: string,
  searchText: string
): Promise<User[]> {
  return await fetch(`${ip}/users/${searchText}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getGroupsContainingText(
  ip: string,
  jwt: string,
  searchText: string
): Promise<Group[]> {
  return await fetch(`${ip}/group/all?groupTitle=${searchText}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getUnapprovedGroups(ip: string, jwt: string) {
  return await fetch(`${ip}/group/allnotapproved`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function approveGroup(ip: string, jwt: string, title: string) {
  return await fetch(`${ip}/group/approve/${title}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export async function disapproveGroup(ip: string, jwt: string, id: string) {
  return await fetch(`${ip}/group/disapprove/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export async function isAdmin(ip: string, jwt: string) {
  return await fetch(`${ip}/user/isAdmin`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function isModerator(ip: string, jwt: string, group: string) {
  return await fetch(`${ip}/user/isModerating/${group}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function addModerator(
  ip: string,
  jwt: string,
  username: string,
  group: string
) {
  return await fetch(`${ip}/user/addModerating/${username}/${group}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export async function removeModerator(
  ip: string,
  jwt: string,
  username: string,
  group: string
) {
  return await fetch(`${ip}/user/removeModerating/${username}/${group}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export async function removePost(ip, jwt, id) {
  return await fetch(`${ip}/post/delete/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export async function removeComment(ip, jwt, postId, id) {
  return await fetch(`${ip}/post/removeComment/${postId}/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export function getTime(time) {
  return `${("0" + time[3]).slice(-2)}:${("0" + time[4]).slice(-2)}:${(
    "0" + time[5]
  ).slice(-2)}`;
}

export function getDate(time) {
  return `${("0" + time[0]).slice(-2)}.${("0" + time[1]).slice(-2)}.${(
    "0" + time[2]
  ).slice(-2)}`;
}
