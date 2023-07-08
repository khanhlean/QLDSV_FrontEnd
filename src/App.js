import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Login from '@/components/Auth/Login';
import Menu from './components/Menu/Menu';
import EditWatch from './components/Pages/GiangVien/Giangvien';
import SinhVien from './components/Pages/GiangVien/SinhVien';
import MonHoc from './components/Pages/GiangVien/MonHoc';
import LopTinChi from './components/Pages/GiangVien/LopTinChi';

import DangKi from './components/Pages/SinhVien/DangKi';
import XemDiem from './components/Pages/SinhVien/XemDiem';
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

                <Route path="/sinhvien/menu" component={Menu} />
                <Route path="/sinhvien/xemdiem" component={XemDiem} />
                <Route path="/sinhvien/dangkimon" component={DangKi} />
            </Switch>
        </Router>
    );
}

export default App;
