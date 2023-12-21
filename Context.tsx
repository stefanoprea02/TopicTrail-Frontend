import React, { useState } from "react";
import { getValueForJWT, getValueForUsername } from "./Storage";
import Constants from "expo-constants";

const JWTContext = React.createContext(null);

function JWTProvider(props) {
  const { manifest } = Constants;
  const ip = `http://${manifest.debuggerHost.split(":").shift()}:8080`;
  const [jwt, setJwt] = useState<string | null>(null);
  const [username, setUsername] = useState<string>(null);

  const value = React.useMemo(() => {
    return { jwt, setJwt, ip, username, setUsername };
  }, [jwt, ip, username]);

  React.useEffect(() => {
    async function fetchData() {
      const jwt = await getValueForJWT();
      const username = await getValueForUsername();
      setJwt(JSON.parse(jwt));
      setUsername(JSON.parse(username));
    }
    fetchData();
  }, []);

  return <JWTContext.Provider value={value} {...props} />;
}

export { JWTProvider, JWTContext };
