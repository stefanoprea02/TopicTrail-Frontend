import React from "react";
import { getValueFor } from "./Storage";

const JWTContext = React.createContext(null);

function JWTProvider(props){
    const [jwt, setJwt] = React.useState(null);

    const value = React.useMemo(() => {
        return {jwt, setJwt};
    }, [jwt]);

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