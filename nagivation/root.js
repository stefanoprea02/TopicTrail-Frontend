import React from "react";
import AuthenticationTabs from "./authTabs";
import UserTabs from "./userTabs";
import { JWTContext } from "../Context";

export default function Root() {
    const { jwt, ip } = React.useContext(JWTContext);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isValid, setIsValid] = React.useState(null);
    
    React.useEffect(() => {
      async function fetchData() {
        setIsLoading(true);
  
        if (jwt) {
          fetch(`${ip}/api/auth/validate`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`,
            },
          })
            .then((response) => response.text())
            .then((data) => {
              setIsValid(data);
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      }
  
      fetchData();
    }, [jwt]);
  
    if (!isLoading && jwt && isValid === 'true') {
      return <UserTabs />;
    } else {
      return <AuthenticationTabs />;
    }
  }