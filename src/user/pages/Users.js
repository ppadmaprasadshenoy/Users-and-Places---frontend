import React, {useEffect, useState } from 'react';     // useEffect runs the code only when certain dependencies are changed

import { ErrorModal } from '../../shared/components/UIElements/ErrorModal';
import { LoadingSpinner } from '../../shared/components/UIElements/LoadingSpinner';

import {UsersList} from '../components/UsersList';
import { useHttpClient } from '../../shared/hooks/http-hook';

export const Users = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users');
        setLoadedUsers(responseData.users);

      } catch (err) {}
    }
    fetchUsers();
  },[sendRequest]);          // if dependencies are empty, then code runs only once. Else as many times dependencies change.

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
        {isLoading && 
          <div className='center'>
            <LoadingSpinner asOverlay/>
          </div>}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
}
