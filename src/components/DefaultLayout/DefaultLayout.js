import SidebarGV from './Sidebar/SidebarGV';
import SidebarSV from './Sidebar/SidebarSV';
import './DefaultLayout.scss';

function DefaultLayout({ children }) {
    const maVaitro = localStorage.getItem('MaVaitro');
    console.log(maVaitro);
    let sidebarComponent;

    if (maVaitro === 'QL') {
        sidebarComponent = <SidebarGV />;
    } else if (maVaitro === 'SV') {
        sidebarComponent = <SidebarSV />;
    }

    return (
        <div>
            {sidebarComponent}
            <div className="container">
                <div className="row">
                    <div className="col-md-9">
                        <div className="content">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
