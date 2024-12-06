import SideNav from '../../components/estudiante/sidenav';
import TopNav from '../../components/admin/topnav';

function Layout({ children }) {
  return (
    <div className=" flex-col min-h-screen md:flex-row bg md:overflow-hidden">
        <div className="flex h-20 w-full items-center justify-end bg-custom-blue1 hidden md:block">
            <TopNav></TopNav>
        </div>

        <div className='flex flex-col md:flex-row'>
            <div className="flex-none w-full md:w-56">
                <SideNav></SideNav>
            </div>
            <div className="flex-grow px-5 my-5 y-screen md:overflow-y-auto">
                {children}
            </div>
        </div>
    </div>
  );
}

export default Layout