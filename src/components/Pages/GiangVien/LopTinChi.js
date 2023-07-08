import './Loptinchi.scss';
import React, { useState, useEffect } from 'react';
import API from '@/services/api';
import Sidebar from '@/components/DefaultLayout/Sidebar/SidebarGV';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';

const LopTinChi = () => {
    const [watches, setWatches] = useState([]);
    const [phong, setPhong] = useState([]);
    const [LH, setLH] = useState([]);
    const [LHPH, setLHPH] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedWatch, setSelectedWatch] = useState(null);
    const [selectedLHvaPhong, setSelectedLHvaPhong] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showLHPH, setshowLHPH] = useState(false);

    const [addNamHoc, setaddNamHoc] = useState('');
    const [addHocKi, setaddHocKi] = useState('');
    const [addSLToiDa, setaddSLToiDa] = useState('');
    const [addNgayBD, setaddNgayBD] = useState('');
    const [addNgayKT, setaddNgayKT] = useState('');
    const [addMaMH, setaddMaMH] = useState('');

    const [editedNamHoc, setEditedNamHoc] = useState(null);
    const [editedSLToiDa, setEditedSLToiDa] = useState(null);
    const [editedHocKi, setEditedHocKi] = useState(null);
    const [editedNgayBD, setEditedNgayBD] = useState(null);
    const [editedNgayKT, setEditedNgayKT] = useState(null);
    const [editedMaMH, setEditedMaMH] = useState(null);

    const [LHId, setLHId] = useState(null);
    const [phongId, setPhongId] = useState(null);

    useEffect(() => {
        if (selectedWatch) {
            setEditedNamHoc(selectedWatch.NamHoc);
            setEditedSLToiDa(selectedWatch.SLToiDa);
            setEditedHocKi(selectedWatch.HocKi);
            setEditedNgayBD(selectedWatch.NgayBD);
            setEditedNgayKT(selectedWatch.NgayKT);
            setEditedMaMH(selectedWatch.MaMH);
        }
        fetchData();
    }, [selectedWatch]);

    async function fetchData() {
        try {
            const token = localStorage.getItem('token');
            //console.log(token);
            const response = await API.get('/loptinchi/getallloptinchi', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWatches(response.data.lopTinChi);
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
    }

    async function fetchLH() {
        try {
            const token = localStorage.getItem('token');
            const response = await API.get('/loptinchi/hienThiLichHocChuaCoTrongLopTinChi/${selectedWatch.id}', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLH(response.data.lichHocChuaCo);
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
    }

    async function fetchPhong() {
        try {
            const token = localStorage.getItem('token');
            const response = await API.get('/loptinchi/hienThiPhongHocChuaCoTrongLopTinChi/${selectedWatch.id}', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPhong(response.data.phongHocChuaCo);
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
    }

    const handleAddGiangVien = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(
                '/loptinchi/themloptinchi',
                {
                    NamHoc: addNamHoc,
                    HocKi: addHocKi,
                    SLToiDa: addSLToiDa,
                    NgayBD: addNgayBD,
                    NgayKT: addNgayKT,
                    MaMH: addMaMH,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.status === 200) {
                console.log('Thêm giảng viên thành công');
                console.log('Mã giảng viên:', response.data.MaGV);
            } else {
                console.log('Lỗi khi thêm giảng viên');
            }
        } catch (error) {
            console.log('Lỗi khi gọi API:', error);
        }
        setShowAddForm(false);
        fetchData();
    };

    const handleAddPHLH = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await API.post(
                '/loptinchi/themLichHoc',
                {
                    MaLTC: selectedWatch.id,
                    MaTGB: LHId,
                    MaPhongHoc: phongId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log(response.status);
            if (response.status === 200) {
            } else {
                // console.log(response.data.error);
                // setErrorMessage(response.data.error); // Gán thông báo lỗi vào state
            }
        } catch (error) {
            console.log('Lỗi khi gọi API:', error);
        }
        handleLH();
    };

    const handleDeletePHLH = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(
                '/loptinchi/xoaLichHocVaPhongHoc',
                {
                    MaLTC: selectedWatch.id,
                    MaTGB: selectedLHvaPhong.MaTGB,
                    MaPhongHoc: selectedLHvaPhong.MaPhongHoc,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log(response.status);
            if (response.status === 200) {
            } else {
                // console.log(response.data.error);
                // setErrorMessage(response.data.error); // Gán thông báo lỗi vào state
            }
        } catch (error) {
            console.log('Lỗi khi gọi API:', error);
        }
        handleLH();
    };

    const columns = [
        { field: 'NamHoc', headerName: 'Năm Học', width: 200 },
        { field: 'HocKi', headerName: 'Học Kì', width: 100 },
        { field: 'SLToiDa', headerName: 'Số Lượng Tối Đa', width: 170 },
        { field: 'NgayBD', headerName: 'Ngày Bắt Đầu', width: 120 },
        { field: 'NgayKT', headerName: 'Ngày Kết Thúc', width: 120 },
        { field: 'Active', headerName: 'Trạng Thái', width: 120 },
        { field: 'MaMH', headerName: 'Mã Môn Học', width: 120 },
    ];

    const rows = watches.map((watch) => ({
        id: watch.MaLTC,
        MaGV: watch.MaLTC,
        NamHoc: watch.NamHoc,
        HocKi: watch.HocKi,
        SLToiDa: watch.SLToiDa,
        NgayBD: watch.NgayBD.substring(0, 10),
        NgayKT: watch.NgayKT.substring(0, 10),
        Active: watch.Active ? 'Đang Hoạt Động' : 'Đã Nghỉ',
        MaMH: watch.MaMH,
    }));

    const handleRowClick = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRow = params.row;
        setSelectedWatch(selectedRow);
    };

    const columnsLHvaPhong = [
        { field: 'MaTGB', headerName: 'Mã TGB', width: 200 },
        { field: 'Thu', headerName: 'Thứ', width: 100 },
        { field: 'Buoi', headerName: 'Buổi', width: 170 },
    ];

    const rowsLHvaPhong = LHPH.map((lhph) => ({
        id: lhph.MaTGB,
        MaTGB: lhph.MaTGB,
        Thu: lhph.Thu,
        Buoi: lhph.Buoi,
        MaPhongHoc: lhph.MaPhongHoc,
    }));

    const handleRowClickLHvaPhong = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRow = params.row;
        setSelectedLHvaPhong(selectedRow);
    };

    //xử lý editing
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleLH = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.get(`/loptinchi/hienThiLichHocVaPhongHocCuaLopTinChi/${selectedWatch.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.success);
            setLHPH(response.data.lichHocPhongHoc);
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
        fetchLH();
        fetchPhong();
        setshowLHPH(true);
    };

    const handleSaveClick = async () => {
        // Thực hiện các thao tác lưu dữ liệu tại đây
        try {
            const token = localStorage.getItem('token');

            const response = await API.put(
                `/loptinchi/sualoptinchi/${selectedWatch.id}`,
                {
                    NamHoc: editedNamHoc,
                    HocKi: editedHocKi,
                    SLToiDa: editedSLToiDa,
                    NgayBD: editedNgayBD,
                    NgayKT: editedNgayKT,
                    MaMH: editedMaMH,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                console.log('Watch updated successfully');
                // Xử lý thành công sau khi cập nhật đồng hồ
                setSelectedWatch({
                    ...selectedWatch,
                    NamHoc: editedNamHoc,
                    HocKi: editedHocKi,
                    SLToiDa: editedSLToiDa,
                    NgayBD: editedNgayBD,
                    NgayKT: editedNgayKT,
                    MaMH: editedMaMH,
                });
            } else {
                console.log('Failed to update watch');
                // Xử lý khi cập nhật đồng hồ không thành công
            }
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }

        setIsEditing(false);
    };

    const handleDeleteWatch = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await API.delete(`/loptinchi/xoaloptinchi/${selectedWatch.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                // Xóa đồng hồ thành công
                console.log('Watch deleted successfully');
                setSelectedWatch(false);
            } else {
                // Lỗi khi xóa đồng hồ
                console.log('Error deleting watch');
            }
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
    };

    return (
        <div>
            <Sidebar />

            <div className="form_watchlist">
                <div id="watchlist_container">
                    <div className="watchlist_content">
                        <div className="pl_header">
                            <div className="pl_header__title">
                                <h1 className="title-72">Lớp Tín Chỉ</h1>
                            </div>
                        </div>
                        <div className="pl_watches anchor-plp-sections">
                            <section className="pl_section js-plp-section" data-group="1612">
                                {showAddForm && (
                                    <div className="add-watch-form-overlay">
                                        <div className="add-watch-form-container">
                                            <button className="close-button" onClick={() => setShowAddForm(false)}>
                                                <CloseIcon />
                                            </button>
                                            <h4>Thêm</h4>
                                            <input
                                                type="text"
                                                placeholder="Năm Học"
                                                value={addNamHoc}
                                                onChange={(e) => setaddNamHoc(e.target.value)}
                                            />

                                            <input
                                                type="text"
                                                placeholder="Học Kì"
                                                value={addHocKi}
                                                onChange={(e) => setaddHocKi(e.target.value)}
                                            />

                                            <input
                                                type="number"
                                                placeholder="Số Lượng Tối Đa"
                                                value={addSLToiDa}
                                                onChange={(e) => setaddSLToiDa(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Ngày Bắt Đầu"
                                                value={addNgayBD}
                                                onChange={(e) => setaddNgayBD(e.target.value)}
                                            />

                                            <input
                                                type="text"
                                                placeholder="Ngày Kết Thúc"
                                                value={addNgayKT}
                                                onChange={(e) => setaddNgayKT(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Mã Môn Học"
                                                value={addMaMH}
                                                onChange={(e) => setaddMaMH(e.target.value)}
                                            />

                                            <button className="add-button" onClick={handleAddGiangVien}>
                                                <span>Xác Nhận</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div style={{ height: 500, width: '100%' }}>
                                    <DataGrid rows={rows} columns={columns} onRowClick={handleRowClick} />
                                </div>
                                {selectedWatch && (
                                    <div>
                                        <div className="show-LTC-form-overlay">
                                            <div className="show-LTC-form-container">
                                                <button
                                                    className="close-button"
                                                    onClick={() => {
                                                        setSelectedWatch(false);
                                                        setIsEditing(false);
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </button>
                                                <h2>Thông Tin Lớp Tín Chỉ</h2>
                                                <form>
                                                    {isEditing ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                placeholder="Năm Học"
                                                                value={editedNamHoc}
                                                                onChange={(e) => setEditedNamHoc(e.target.value)}
                                                            />

                                                            <input
                                                                type="text"
                                                                placeholder="Học Kì"
                                                                value={editedHocKi}
                                                                onChange={(e) => setEditedHocKi(e.target.value)}
                                                            />

                                                            <input
                                                                type="number"
                                                                placeholder="Số Lượng Tối Đa"
                                                                value={editedSLToiDa}
                                                                onChange={(e) => setEditedSLToiDa(e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Ngày Bắt Đầu"
                                                                value={editedNgayBD}
                                                                onChange={(e) => setEditedNgayBD(e.target.value)}
                                                            />

                                                            <input
                                                                type="text"
                                                                placeholder="Ngày Kết Thúc"
                                                                value={editedNgayKT}
                                                                onChange={(e) => setEditedNgayKT(e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Mã Môn Học"
                                                                value={editedMaMH}
                                                                onChange={(e) => setEditedMaMH(e.target.value)}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text">Năm Học: {selectedWatch.NamHoc}</p>
                                                            <p className="text">Học Kì: {selectedWatch.HocKi}</p>
                                                            <p className="text">
                                                                Số Lượng Tối Đa: {selectedWatch.SLToiDa}
                                                            </p>
                                                            <p className="text">Ngày Bắt Đầu: {selectedWatch.NgayBD}</p>
                                                            <p className="text">
                                                                Ngày Kết Thúc: {selectedWatch.NgayKT}
                                                            </p>
                                                            <p className="text">Mã Môn Học: {selectedWatch.MaMH}</p>
                                                        </>
                                                    )}
                                                    <div className="btn-container">
                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            onClick={handleLH}
                                                        >
                                                            <span>LỊCH HỌC</span>
                                                        </button>
                                                        {isEditing ? (
                                                            <button
                                                                type="button"
                                                                className="edit-button"
                                                                onClick={handleSaveClick}
                                                            >
                                                                <span>LƯU</span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="edit-button"
                                                                onClick={handleEditClick}
                                                            >
                                                                <span>SỪA</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            onClick={handleDeleteWatch}
                                                        >
                                                            <span>XÓA</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                        {showLHPH && (
                                            <div>
                                                <div className="data-grid-phlh-overlay">
                                                    <div className="data-grid-phlh-container">
                                                        <button
                                                            className="close-button"
                                                            onClick={() => setshowLHPH(false)}
                                                        >
                                                            <CloseIcon />
                                                        </button>
                                                        <select
                                                            id="LHComboBox"
                                                            value={LHId}
                                                            onChange={(e) => setLHId(e.target.value)}
                                                        >
                                                            <option value="">-- Chọn Buổi Học --</option>
                                                            {LH.map((LH) => (
                                                                <option key={LH.MaTGB} value={LH.MaTGB}>
                                                                    {`Thứ ${LH.Thu} - ${LH.Buoi ? 'Sáng' : 'Chiều'}`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            id="phongComboBox"
                                                            value={phongId}
                                                            onChange={(e) => setPhongId(e.target.value)}
                                                        >
                                                            <option value="">-- Chọn Phòng Học --</option>
                                                            {phong.map((phong) => (
                                                                <option key={phong.MaPhongHoc} value={phong.MaPhongHoc}>
                                                                    {phong.TenPhong}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="button-container">
                                                            <button
                                                                className="add-table-phlh-btn"
                                                                onClick={handleAddPHLH}
                                                            >
                                                                THÊM
                                                            </button>
                                                            <button
                                                                className="remove-table-phlh-btn"
                                                                onClick={handleDeletePHLH}
                                                            >
                                                                XÓA
                                                            </button>
                                                        </div>

                                                        <div
                                                            style={{ height: '100%', width: '100%' }}
                                                            className="datagrid-container"
                                                        >
                                                            <DataGrid
                                                                rows={rowsLHvaPhong}
                                                                columns={columnsLHvaPhong}
                                                                onRowClick={handleRowClickLHvaPhong}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="pl_section__header">
                                    <button className="add-watch-button" onClick={() => setShowAddForm(true)}>
                                        THÊM LỚP TÍN CHỈ
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LopTinChi;
