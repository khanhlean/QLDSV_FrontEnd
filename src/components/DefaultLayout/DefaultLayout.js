import Sidebar from './Sidebar/Sidebar';
import './DefaultLayout.scss';

function DefaultLayout({ children }) {
    return (
        <div>
            <Sidebar />
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
