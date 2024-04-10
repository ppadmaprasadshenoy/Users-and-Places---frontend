import { useCallback, useState, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();   
    // Note: this tokenExpirationDate is different from the one(loginexpirationDate (block scoped) ) used inside login function.
    const [userId, setUserId] = useState(false);
  
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
  
      const tokenexpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      // expirationDate - If user is logged in, he can enter the application page anytime before expiration(1h) from other page
      // else new token will be genrated if he has crossed the xpiration time (by logging in again)
  
      setTokenExpirationDate(tokenExpirationDate);
  
      localStorage.setItem(
        'userData',
        JSON.stringify({ 
                         userId: uid,
                         token: token,
                         expiration: tokenexpirationDate.toISOString() })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    const logout = useCallback(() => {        // useCallback usage - The function is not recreated, thus stopping infinite loop
      setToken(null);
      setTokenExpirationDate(null);
      setUserId(null);
      localStorage.removeItem('userData');
    }, []);
  
    useEffect(() => {
      if(token && tokenExpirationDate){
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();     // gettime gives time in miliseconds!
        logoutTimer = setTimeout(logout, remainingTime );
      } else{
        clearTimeout(logoutTimer);     // clear timeout when logout 
      }
  
    }, [token, logout, tokenExpirationDate])
  
    useEffect(() => {
      const storeData = JSON.parse(localStorage.getItem('userData'));     // parse - Converts JSON strings to Objects
      if(storeData && 
        storeData.token && 
        new Date(storeData.expiration) > new Date())        // it means expiration time is still not completed
      {
        login(storeData.userId, storeData.token, new Date(storeData.expiration));
      }
    },[login]);

    return { token, login, logout, userId}
};