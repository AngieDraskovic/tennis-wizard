import { Outlet } from "react-router-dom";

export function AppShell(){

    return <div className='bg-zinc-950 min-h-screen flex flex-col text-white'>
        <Outlet/>
    </div>

}