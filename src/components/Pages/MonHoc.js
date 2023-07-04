import './EditWatch.scss';
import React, { useState, useEffect } from 'react';
import API from '@/services/api';
import Sidebar from '@/components/DefaultLayout/Sidebar/Sidebar';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';

const MonHoc = () => {
    const [watches, setWatches] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedWatch, setSelectedWatch] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [addTenMH, setaddTenMH] = useState(null);
    const [addSoTietLT, setaddSoTietLT] = useState(null);
    const [addSoTietTH, setaddQSoTietTH] = useState(null);
    const [addSoTinChi, setaddSoTinChi] = useState(null);
    const [addHeSoCC, setaddHeSoCC] = useState(null);
    const [addHeSoGK, setaddHeSoGK] = useState(null);
    const [addHeSoCK, setaddHeSoCK] = useState(null);

    const [editedTenMH, setEditedTenMH] = useState(null);
    const [editedSoTietLT, setEditedSoTietLT] = useState(null);
    const [editedSoTietTH, setEditedQSoTietTH] = useState(null);
    const [editedSoTinChi, setEditedSoTinChi] = useState(null);
    const [editedHeSoCC, setEditedKHeSoCC] = useState(null);
    const [editedHeSoGK, setEditedHeSoGK] = useState(null);
    const [editedHeSoCK, setEditedHeSoCK] = useState(null);

    useEffect(() => {
        if (selectedWatch) {
            setEditedTenMH(selectedWatch.TenMH);
            setEditedSoTietLT(selectedWatch.SoTietLT);
            setEditedQSoTietTH(selectedWatch.SoTietTH);
            setEditedSoTinChi(selectedWatch.SoTinChi);
            setEditedKHeSoCC(selectedWatch.HeSoCC);
            setEditedHeSoGK(selectedWatch.HeSoGK);
            setEditedHeSoCK(selectedWatch.HeSoCK);
        }

        fetchData();
    }, [selectedWatch]);

    async function fetchData() {
        try {
            const token = localStorage.getItem('token');
            //console.log(token);
            const response = await API.get('/monhoc/getallmonhoc', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWatches(response.data.monhoc);
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
    }

    const handleAddGiangVien = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(
                '/monhoc/themmonhoc',
                {
                    TenMH: addTenMH,
                    SoTietLT: addSoTietLT,
                    SoTietTH: addSoTietTH,
                    SoTinChi: addSoTinChi,
                    HeSoCC: addHeSoCC,
                    HeSoGK: addHeSoGK,
                    HeSoCK: addHeSoCK,
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
        { field: 'TenMH', headerName: 'Tên Môn Học', width: 200 },
        { field: 'SoTietLT', headerName: 'Số Tiết Lý Thuyết', width: 100 },
        { field: 'SoTietTH', headerName: 'Số Tiết Thực Hành', width: 170 },
        { field: 'SoTinChi', headerName: 'Địa Chỉ', width: 120 },
        { field: 'HeSoCC', headerName: 'Khóa Học', width: 120 },
        { field: 'HeSoCK', headerName: 'Khóa Học', width: 120 },
        { field: 'Active', headerName: 'Trạng Thái', width: 120 },
    ];

    const rows = watches.map((watch) => ({
        id: watch.MaMH,
        MaGV: watch.MaMH,
        TenMH: watch.TenMH,
        SoTietLT: watch.SoTietLT,
        SoTietTH: watch.SoTietTH,
        SoTinChi: watch.SoTinChi,
        HeSoCC: watch.HeSoCC,
        HeSoGK: watch.HeSoGK,
        HeSoCK: watch.HeSoCK,
        Active: watch.Active ? 'Đang Hoạt Động' : 'Đã Nghỉ',
    }));

    const handleRowClick = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRow = params.row;
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
                `/monhoc/suaMonHoc/${selectedWatch.id}`,
                {
                    MaMH: selectedWatch.id,
                    TenMH: editedTenMH,
                    SoTietLT: editedSoTietLT,
                    SoTietTH: editedSoTietTH,
                    SoTinChi: editedSoTinChi,
                    HeSoCC: editedHeSoCC,
                    HeSoGK: editedHeSoGK,
                    HeSoCK: editedHeSoCK,
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
                    TenMH: editedTenMH,
                    SoTietLT: editedSoTietLT,
                    SoTietTH: editedSoTietTH,
                    SoTinChi: editedSoTinChi,
                    HeSoCC: editedHeSoCC,
                    HeSoGK: editedHeSoGK,
                    HeSoCK: editedHeSoCK,
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
            const response = await API.delete(`/monhoc/xoaMonHoc/${selectedWatch.id}`, {
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
                                <h1 className="title-72">Môn Học</h1>
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
                                                placeholder="Tên Môn Học"
                                                value={addTenMH}
                                                onChange={(e) => setaddTenMH(e.target.value)}
                                            />

                                            <input
                                                type="number"
                                                placeholder="Số Tiết Lý Thuyết"
                                                value={addSoTietLT}
                                                onChange={(e) => setaddSoTietLT(e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Số Tiết Thực Hành"
                                                value={addSoTietTH}
                                                onChange={(e) => setaddQSoTietTH(e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Số Tín Chỉ"
                                                value={addSoTinChi}
                                                onChange={(e) => setaddSoTinChi(e.target.value)}
                                            />

                                            <input
                                                type="number"
                                                placeholder="Chuyên Cần"
                                                value={addHeSoCC}
                                                onChange={(e) => setaddHeSoCC(e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Giữa Kì"
                                                value={addHeSoGK}
                                                onChange={(e) => setaddHeSoGK(e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Cuối kì"
                                                value={addHeSoCK}
                                                onChange={(e) => setaddHeSoCK(e.target.value)}
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
                                                <h2>Thông Tin Môn Học</h2>
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
                                                                placeholder="Tên Môn Học"
                                                                value={editedTenMH}
                                                                onChange={(e) => setEditedTenMH(e.target.value)}
                                                            />

                                                            <input
                                                                type="number"
                                                                placeholder="Số Tiết Lý Thuyết"
                                                                value={editedSoTietLT}
                                                                onChange={(e) => setEditedSoTietLT(e.target.value)}
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Số Tiết Thực Hành"
                                                                value={editedSoTietTH}
                                                                onChange={(e) => setEditedQSoTietTH(e.target.value)}
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Số Tín Chỉ"
                                                                value={editedSoTinChi}
                                                                onChange={(e) => setEditedSoTinChi(e.target.value)}
                                                            />

                                                            <input
                                                                type="number"
                                                                placeholder="Chuyên Cần"
                                                                value={editedHeSoCC}
                                                                onChange={(e) => setEditedKHeSoCC(e.target.value)}
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Giữa Kì"
                                                                value={editedHeSoGK}
                                                                onChange={(e) => setEditedHeSoGK(e.target.value)}
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Cuối kì"
                                                                value={editedHeSoCK}
                                                                onChange={(e) => setEditedHeSoCK(e.target.value)}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text">Tên Môn Học: {selectedWatch.TenMH}</p>
                                                            <p className="text">
                                                                Số Tiết Lý Thuyết: {selectedWatch.SoTietLT}
                                                            </p>
                                                            <p className="text">
                                                                Số Tiết Thực Hành: {selectedWatch.SoTietTH}
                                                            </p>
                                                            <p className="text">Số Tín Chỉ: {selectedWatch.SoTinChi}</p>
                                                            <p className="text">Chuyên Cần: {selectedWatch.HeSoCC}</p>
                                                            <p className="text">Giữa Kì: {selectedWatch.HeSoGK}</p>
                                                            <p className="text">Cuối kì: {selectedWatch.HeSoCK}</p>
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
                                        THÊM MÔN HỌC
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

export default MonHoc;
