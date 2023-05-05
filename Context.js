import React from "react";
import { getValueFor } from "./Storage";
import Constants from "expo-constants";

const JWTContext = React.createContext(null);

function JWTProvider(props){
    const { manifest } = Constants;
    const ip = `http://${manifest.debuggerHost.split(':').shift()}:8080`;
    const [jwt, setJwt] = React.useState(null);

    const value = React.useMemo(() => {
        return {jwt, setJwt, ip};
    }, [jwt, ip]);

    React.useEffect(() => {
        async function fetchData() {
          const res = await getValueFor();
          setJwt(JSON.parse(res));
        }
        fetchData();
      }, []);

    return <JWTContext.Provider value={value} {...props} />
}

export {JWTProvider, JWTContext}