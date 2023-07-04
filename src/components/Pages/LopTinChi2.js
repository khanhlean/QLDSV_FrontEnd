import './EditWatch.scss';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import urlImg from '@/services/urlImg';
import API from '@/services/api';
import Sidebar from '@/components/DefaultLayout/Sidebar/Sidebar';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';

const LopTinChi = () => {
    const [watches, setWatches] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedWatch, setSelectedWatch] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [addNamHoc, setaddNamHoc] = useState('');
    const [addHocKi, setaddHocKi] = useState('');
    const [addSLToiDa, setaddSLToiDa] = useState('');
    const [addNgayBD, setaddNgayBD] = useState('');
    const [addNgayKT, setaddNgayKT] = useState('');
    const [addMaMH, setaddMaMH] = useState('');

    const [editedNamHoc, setEditedNamHoc] = useState(null);
    const [editedSLToiDa, setEditedSLToiDa] = useState(null);
    const [editedNgayBD, setEditedNgayBD] = useState(null);
    const [editedNgayKT, setEditedNgayKT] = useState(null);
    const [editedMaMH, setEditedMaMH] = useState(null);
    const [editedHocKi, setEditedHocKi] = useState(null);

    useEffect(() => {
        if (selectedWatch) {
            //setEditedMaGV(selectedWatch.MaGV);
            editedNamHoc(selectedWatch.NamHoc);
            editedSLToiDa(selectedWatch.SLToiDa);
            editedHocKi(selectedWatch.HocKi);
            editedNgayBD(selectedWatch.NgayBD);
            editedNgayKT(selectedWatch.NgayKT);
            editedMaMH(selectedWatch.MaMH);
        }

        fetchData();
    }, [selectedWatch, editedHocKi, editedMaMH, editedNamHoc, editedNgayBD, editedNgayKT, editedSLToiDa]);

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
        console.log(selectedWatch.NamHoc);
        console.log(selectedWatch.id);
        console.log('ádfsádfsd');
        setSelectedWatch(selectedRow);
    };

    //xử lý editing
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        // Thực hiện các thao tác lưu dữ liệu tại đây
        try {
            const token = localStorage.getItem('token');
            const response = await API.put(
                `/loptinchi/sualoptinchi/${selectedWatch.id}`,
                {
                    //watchId: selectedWatch.id,
                    NamHoc: editedNamHoc,
                    HocKi: editedHocKi,
                    SLToiDa: editedSLToiDa,
                    NgayBD: editedNgayBD,
                    NgayKT: editedNgayKT,
                    MaMH: editedMaMH,
                    //Active:
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

            const confirmed = window.confirm('Xóa mềm?');
            if (confirmed) {
                await API.put(`/sinhvien/choSinhVienNghi/${selectedWatch.id}`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Sinh viên đã được xóa mềm thành công');
                setSelectedWatch(false);
            } else {
                console.log('Không xóa giảng viên');
            }
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
                                <h1 className="title-72">Sinh Viên</h1>
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
                                        <div className="show-watch-form-overlay">
                                            <div className="show-watch-form-container">
                                                <button
                                                    className="close-button"
                                                    onClick={() => {
                                                        setSelectedWatch(false);
                                                        setIsEditing(false);
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </button>
                                                <h2>Thông Tin Sinh Viên</h2>
                                                <div class="image-container">
                                                    <img
                                                        src={selectedWatch.image}
                                                        alt={selectedWatch.name}
                                                        className="scaled-img"
                                                    />
                                                </div>
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
                                                                value={addSLToiDa}
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
                                                            <p className="text">Họ và tTên: {selectedWatch.HoTen}</p>
                                                            <p className="text">Phái: {selectedWatch.Phai}</p>
                                                            <p className="text">Ngày Sinh: {selectedWatch.NgaySinh}</p>
                                                            <p className="text">Địa Chỉ: {selectedWatch.DiaChi}</p>
                                                            <p className="text">Khóa Học: {selectedWatch.KhoaHoc}</p>
                                                            <p className="text">Mã Lớp: {selectedWatch.MaLop}</p>
                                                        </>
                                                    )}
                                                    <div className="btn-container">
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
                                    </div>
                                )}
                                <div className="pl_section__header">
                                    <button className="add-watch-button" onClick={() => setShowAddForm(true)}>
                                        THÊM Sinh VIÊN
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
