
import './App.css';
import { Outlet } from 'react-router-dom';
// import ApolloProvider
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider, 
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Construct main graphql endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Construct request middleware that will attach the jwt token to every request as an `authorization` header
// pass in a function to let authLink get the token from Local Storage, and put the token in the header
const authLink = setContext((_, { headers }) => {
  // get token from local storage if exists
  const token = localStorage.getItem("id_token");
  // return headers to the context
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// create new instance of ApolloClient
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return (
    
    <ApolloProvider client={client}>
    <Navbar />
    <Outlet />
  </ApolloProvider>
);
}

    
 
export default App;
