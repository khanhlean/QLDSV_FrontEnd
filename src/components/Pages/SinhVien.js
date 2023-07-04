import './EditWatch.scss';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import urlImg from '@/services/urlImg';
import API from '@/services/api';
import Sidebar from '@/components/DefaultLayout/Sidebar/Sidebar';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';

const SinhVien = () => {
    const [watches, setWatches] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedWatch, setSelectedWatch] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [addName, setaddName] = useState('');
    const [addMaLop, setaddMaLop] = useState('');
    const [addPhai, setaddPhai] = useState(1);
    const [addNgaySinh, setaddNgaySinh] = useState('');
    const [addDiaChi, setaddDiaChi] = useState('');
    const [addKhoaHoc, setaddKhoaHoc] = useState('2017-2021');

    const [editedName, setEditedName] = useState(null);
    const [editedLine, setEditedLine] = useState(1);
    const [editedQuantity, setEditedQuantity] = useState(null);
    const [editedType, setEditedType] = useState(null);
    const [editedKhoaHoc, setEditedKhoaHoc] = useState(null);
    const [editedMaLop, setEditedMaLop] = useState(null);

    useEffect(() => {
        if (selectedWatch) {
            //setEditedMaGV(selectedWatch.MaGV);
            setEditedName(selectedWatch.HoTen);
            setEditedLine(selectedWatch.Phai === 'Nam' ? 1 : 0);
            console.log(selectedWatch.image);
            setEditedQuantity(selectedWatch.NgaySinh);
            setEditedType(selectedWatch.DiaChi);
            setEditedMaLop(selectedWatch.MaLop);
            setEditedKhoaHoc(selectedWatch.KhoaHoc);
        }

        fetchData();
    }, [selectedWatch]);

    async function fetchData() {
        try {
            const token = localStorage.getItem('token');
            //console.log(token);
            const response = await API.get('/sinhvien/getallsinhvien', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWatches(response.data);
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
    }

    const handleAddGiangVien = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(
                '/sinhvien/themsinhien',
                {
                    HoTen: addName,
                    Phai: addPhai,
                    NgaySinh: addNgaySinh,
                    DiaChi: addDiaChi,
                    KhoaHoc: addKhoaHoc,
                    MaLop: addMaLop,
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
        { field: 'HoTen', headerName: 'Họ Tên', width: 200 },
        { field: 'Phai', headerName: 'Phái', width: 100 },
        { field: 'NgaySinh', headerName: 'Ngày Sinh', width: 170 },
        { field: 'DiaChi', headerName: 'Địa Chỉ', width: 120 },
        { field: 'KhoaHoc', headerName: 'Khóa Học', width: 120 },
        { field: 'Active', headerName: 'Trạng Thái', width: 120 },
        { field: 'MaLop', headerName: 'Mã Lớp', width: 120 },
    ];

    const rows = watches.map((watch) => ({
        id: watch.MaSV,
        MaGV: watch.MaSV,
        HoTen: watch.HoTen,
        Phai: watch.Phai ? 'Nam' : 'Nữ',
        NgaySinh: watch.NgaySinh.substring(0, 10),
        DiaChi: watch.DiaChi,
        KhoaHoc: watch.KhoaHoc,
        image: urlImg + watch.image,
        Active: watch.Active ? 'Đang Hoạt Động' : 'Đã Nghỉ',
        MaLop: watch.MaLop,
    }));

    const handleRowClick = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRow = params.row;
        setSelectedWatch(selectedRow);
    };

    const handleDateChange = (date) => {
        const formattedDate = format(new Date(date), 'yyyy-MM-dd');
        setaddNgaySinh(formattedDate);
    };

    const handleAddPhaiChange = (e) => {
        const value = parseInt(e.target.value);
        setaddPhai(value);
    };

    const handleEditPhaiChange = (e) => {
        const value = parseInt(e.target.value);
        setEditedLine(value);
    };

    //xử lý editing
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        // Thực hiện các thao tác lưu dữ liệu tại đây
        try {
            const token = localStorage.getItem('token');
            console.log(selectedWatch.id);
            console.log(editedName);
            console.log(editedLine);
            console.log(editedQuantity);
            console.log(editedType);
            const response = await API.put(
                `/sinhvien/suasinhvien/${selectedWatch.id}`,
                {
                    //watchId: selectedWatch.id,
                    HoTen: editedName,
                    Phai: editedLine,
                    NgaySinh: editedQuantity,
                    DiaChi: editedType,
                    KhoaHoc: editedKhoaHoc,
                    MaLop: editedMaLop,
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
                    HoTen: editedName,
                    Phai: editedLine === 1 ? 'Nam' : 'Nữ',
                    NgaySinh: editedQuantity,
                    DiaChi: editedType,
                    KhoaHoc: editedKhoaHoc,
                    MaLop: editedMaLop,
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
            const response = await API.delete(`/sinhvien/xoasinhvien/${selectedWatch.id}`, {
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
                                                placeholder="Họ và Tên"
                                                value={addName}
                                                onChange={(e) => setaddName(e.target.value)}
                                            />
                                            <select id="lineComboBox" value={addPhai} onChange={handleAddPhaiChange}>
                                                <option value="1">Nam</option>
                                                <option value="0">Nữ</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Ngày Sinh"
                                                value={addNgaySinh}
                                                onChange={(e) => handleDateChange(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Địa Chỉ"
                                                value={addDiaChi}
                                                onChange={(e) => setaddDiaChi(e.target.value)}
                                            />
                                            <select
                                                id="KhoaHocComboBox"
                                                value={addKhoaHoc}
                                                onChange={(e) => setaddKhoaHoc(e.target.value)}
                                            >
                                                <option value="2017-2021">2017-2021</option>
                                                <option value="2018-2022">2018-2022</option>
                                            </select>

                                            <input
                                                type="text"
                                                placeholder="Mã Lớp"
                                                value={addMaLop}
                                                onChange={(e) => setaddMaLop(e.target.value)}
                                            />
                                            <input type="file" id="fileInput" />
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
                                                                value={editedName}
                                                                onChange={(e) => setEditedName(e.target.value)}
                                                            />

                                                            <select
                                                                id="lineComboBox"
                                                                value={editedLine}
                                                                onChange={handleEditPhaiChange}
                                                            >
                                                                <option value="1">Nam</option>
                                                                <option value="0">Nữ</option>
                                                            </select>
                                                            <input
                                                                type="text"
                                                                value={editedQuantity}
                                                                onChange={(e) => setEditedQuantity(e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editedType}
                                                                onChange={(e) => setEditedType(e.target.value)}
                                                            />
                                                            <select
                                                                id="KhoaHocComboBox"
                                                                value={editedKhoaHoc}
                                                                onChange={(e) => setEditedKhoaHoc(e.target.value)}
                                                            >
                                                                <option value="2017-2021">2017-2021</option>
                                                                <option value="2018-2022">2018-2022</option>
                                                            </select>
                                                            <input
                                                                type="text"
                                                                value={editedMaLop}
                                                                onChange={(e) => setEditedMaLop(e.target.value)}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text">Họ và Tên: {selectedWatch.HoTen}</p>
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
                                        THÊM SINH VIÊN
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

export default SinhVien;
