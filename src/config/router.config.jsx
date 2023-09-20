// import { createBrowserRouter } from "react-router-dom";
import Login from "../components/auth/login/Login";
import Register from "../components/auth/Register/Register";
import { ROOT, LOGIN, REGISTER, ABOUT, PROFILE, POST, SEARCH, NEWS } from "../common/Routes";
import About from "../views/About";
import Home from "../views/Home";
import Profile from "../views/Profile";
import SinglePostView from "../views/SinglePostView";
import Search from "../views/Search";
import News from "../views/News";
export const routes = [

  { path: ROOT, element: <Home />},
  { path: LOGIN, element: <Login /> },
  { path: REGISTER, element: <Register /> },
  { path: ABOUT, element: <About /> },
  { path: PROFILE, element: <Profile /> },
  { path: NEWS, element: <News />},
  { path: POST, element: <SinglePostView /> },
  { path: SEARCH, element: <Search /> },
]
    // {
    //   path: PROTECTED,
    //   element: <Layout />,
    //   children: [
    //     {
    //       path: DASHBOARD,
    //       element: <Dashboard />,
    //     },
    //     {
    //       path: USERS,
    //       element: <Users />,
    //     },
    //     {
    //       path: PROFILE,
    //       element: <Profile />,
    //     },
    //     {
    //       path: COMMENTS,
    //       element: <Comments />,
    //     },
    //   ],
    // }, tbi
  // ]);
