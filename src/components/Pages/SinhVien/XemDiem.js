import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import API from '@/services/api';
import SidebarSV from '@/components/DefaultLayout/Sidebar/SidebarSV';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import './XemDiem.scss';

const EditWatch = () => {
    const [diemHocKi, setDiemHocKi] = useState([]);

    useEffect(() => {
        const fetchDiemHocKi = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await API.get('/sinhvien/hienThiDiemTheoHocKi', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDiemHocKi(response.data.HocKi);
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchDiemHocKi();
    }, []);

    const renderDiemHocKi = () => {
        return Object.entries(diemHocKi).map(([hocKi, hocKiData]) => {
            const rows = Object.entries(hocKiData.Mon).map(([id, mon]) => ({ id: id, hocKi, ...mon }));
            return (
                <div key={hocKi}>
                    <h2 className="hoc-ki-title">Học kỳ: {hocKi}</h2>
                    <DataGrid columns={columns} rows={rows} autoHeight={true} />
                    <div className="tin-chi-info">
                        <p>Số tín chỉ đạt: {hocKiData.SoTinChiDat}</p>
                        <p>Số tín chỉ rớt: {hocKiData.SoTinChiRot}</p>
                        <p>Điểm trung bình tổng: {hocKiData.DiemTBTongMon}</p>
                    </div>
                </div>
            );
        });
    };

    const columns = [
        { field: 'TenMonHoc', headerName: 'Tên môn học', flex: 1 },
        { field: 'DiemCC', headerName: 'Điểm CC', flex: 1 },
        { field: 'DiemGK', headerName: 'Điểm GK', flex: 1 },
        { field: 'DiemCK', headerName: 'Điểm CK', flex: 1 },
        { field: 'DiemTB', headerName: 'Điểm TB', flex: 1 },
    ];
    const rows = Object.entries(diemHocKi).flatMap(([hocKi, mons]) =>
        Object.entries(mons.Mon).map(([id, mon]) => ({ id: id, hocKi, ...mon })),
    );
    return (
        <div>
            <SidebarSV />

            <div className="form_watchlist">
                <div id="watchlist_container">
                    <div className="watchlist_content">
                        <div className="pl_header">
                            <div className="pl_header__title">
                                <h1 className="title-72">Xem điểm</h1>
                            </div>
                        </div>
                        <div className="pl_watches anchor-plp-sections">{renderDiemHocKi()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditWatch;
