import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./AppShell";
import { HomePage } from "./components/home-page/home-page";

export const router = createBrowserRouter([
    {
        path: '',
        element: <AppShell/>,
        children: [
            {
                path: '/home',
                element: <HomePage/>
            }
        ]
    }
])

