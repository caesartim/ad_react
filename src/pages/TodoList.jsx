import { useEffect, useState } from "react";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

import { ListView } from "../components/ListView";
import { loginRequest, protectedResources } from "../authConfig";
import useFetchWithMsal from "../hooks/useFetchWithMsal";

const TodoListContent = () => {
  const { error, execute } = useFetchWithMsal({
    scopes: protectedResources.apiTodoList.scopes.read,
  });

  const [todoListData, setTodoListData] = useState(null);

  useEffect(() => {
    if (!todoListData) {
      execute("GET", protectedResources.apiTodoList.endpoint).then(
        (response) => {
          setTodoListData(response);
        }
      );
    }
  }, [execute, todoListData]);

  const getTest = () => {
    execute("GET", "http://localhost:5000/api/test")
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (error) {
    return (
      <>
        <button onClick={getTest}>Test</button>
        <div>Error: {error.message}</div>;
      </>
    );
  }

  return (
    <>
      {todoListData && (
        <>
          <button onClick={getTest}>Test</button>
          <ListView todoListData={todoListData} />
        </>
      )}
    </>
  );
};

/**
 * The `MsalAuthenticationTemplate` component will render its children if a user is authenticated
 * or attempt to sign a user in. Just provide it with the interaction type you would like to use
 * (redirect or popup) and optionally a request object to be passed to the login API, a component to display while
 * authentication is in progress or a component to display if an error occurs. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const TodoList = () => {
  const authRequest = {
    ...loginRequest,
  };

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={authRequest}
    >
      <TodoListContent />
    </MsalAuthenticationTemplate>
  );
};
