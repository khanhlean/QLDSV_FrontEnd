import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Login from '@/components/Auth/Login';
import Menu from './components/Menu/Menu';
import EditWatch from './components/Pages/Giangvien';
import SinhVien from './components/Pages/SinhVien';
import Order from './components/Pages/Order';
import MonHoc from './components/Pages/MonHoc';
import LopTinChi from './components/Pages/LopTinChi';

function App() {
    const role = localStorage.getItem('role');
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/giangvien/menu" component={Menu} />
                <Route path="/giangvien/giangvien" component={EditWatch} />
                <Route path="/giangvien/sinhvien" component={SinhVien} />
                <Route path="/giangvien/monhoc" component={MonHoc} />
                <Route path="/giangvien/loptinchi" component={LopTinChi} />
            </Switch>
        </Router>
    );
}

export default App;
