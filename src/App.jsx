import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import About from './views/About';
import Posts from './views/Posts';
import News from './views/News';
import Search from './views/Search';
import Login from './components/auth/login/Login';
import Register from './components/auth/Register/Register';
import Profile from './views/Profile';
import Users from './views/Users';
import ErrorPage from './views/ErrorPage';
import { Container, MainContent } from './components/base/Containers';
import SidebarWithHeader from './components/base/SideBarWithHeader';
import Footer from './components/base/Footer';
import {
  ROOT,
  LOGIN,
  REGISTER,
  ABOUT,
  PROFILE,
  POST,
  POSTS,
  NEWS,
  SEARCH,
  USERS
} from './common/Routes';
import theme from './theme';
import { AuthContext } from './context/authentication-context';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState, useEffect } from 'react';
import { auth } from './config/firebase.config';
import { getUserData } from './services/user.service';
import SinglePostView from './views/SinglePostView';


function App() {

  const [user] = useAuthState(auth);

  const [appState, setAppState] = useState({
    user,
    userData: null,
  });

  if (appState.user !== user) {
    setAppState({ user });
  }

  useEffect(() => {
    if (user === null) {
      return;
    }

    getUserData(user.uid)
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error('User data not found');
        }

        setAppState({
          ...appState,
          userData: Object.values(snapshot.val())[0]
        });
      });
  }, [user, appState])

  return (
    <ChakraProvider theme={theme}>
      <AuthContext.Provider value={{ ...appState, setUser: setAppState }}>
        <Router>
          <Container>
            <SidebarWithHeader />
            <MainContent>
              <Routes>
                <Route path={ROOT} element={<Home />} />
                <Route path={ABOUT} element={<About />} />
                <Route path={POSTS} element={<Posts />} />
                <Route path={NEWS} element={<News />} />
                {user !== null && appState.userData?.role === 'Admin' && <Route path={USERS} element={<Users />} />}
                {user === null && <Route path={LOGIN} element={<Login />} />}
                {user === null && <Route path={REGISTER} element={<Register />} />}
                {user !== null && <Route path={PROFILE} element={<Profile />} />}
                <Route path={POST} element={<SinglePostView/>} />
                <Route path={SEARCH} element={<Search />} />
                <Route path="*" element={<ErrorPage/>} />


              </Routes>
              <Footer />
            </MainContent>
          </Container>
        </Router>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}

export default App;
