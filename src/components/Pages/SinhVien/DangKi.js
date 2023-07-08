import './DangKi.scss';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import API from '@/services/api';
import SidebarSV from '@/components/DefaultLayout/Sidebar/SidebarSV';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';

const EditWatch = () => {
    const [watches, setWatches] = useState([]);
    const [LTC, setLTC] = useState([]);
    const [KNDCo, setKNDCo] = useState([]);
    const [KNDChua, setKNDChua] = useState([]);
    const [TGBChua, setTGBChua] = useState([]);
    const [TGBCo, setTGBCo] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDataGridPC, setShowDataGridPC] = useState(false);
    const [showTGB, setshowTGB] = useState(false);
    const [showKND, setshowKND] = useState(false);
    const [selectedWatch, setSelectedWatch] = useState(null);
    const [selectedLTC, setSelectedLTC] = useState('');
    const [selectedKNDCo, setSelectedKNDCo] = useState('');
    const [selectedKNDChua, setSelectedKNDChua] = useState('');
    const [selectedTGBCo, setSelectedTGBCo] = useState('');
    const [selectedTGBChua, setSelectedTGBChua] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [addName, setaddName] = useState('');
    const [addHocVi, setaddHocVi] = useState('');
    const [addHocHam, setaddHocHam] = useState('');
    const [addPhai, setaddPhai] = useState(1);
    const [addNgaySinh, setaddNgaySinh] = useState('');
    const [addDiaChi, setaddDiaChi] = useState('');

    const [editedName, setEditedName] = useState(null);
    const [editedHocHam, setEditedHocHam] = useState(null);
    const [editedLine, setEditedLine] = useState(1);
    const [editedHocVi, setEditedHocVi] = useState(null);
    const [editedQuantity, setEditedQuantity] = useState(null);
    const [editedType, setEditedType] = useState(null);

    useEffect(() => {
        if (selectedWatch) {
            setEditedName(selectedWatch.HoTen);
            setEditedHocVi(selectedWatch.HocVi);
            setEditedHocHam(selectedWatch.HocHam);
            setEditedLine(selectedWatch.Phai === 'Nam' ? 1 : 0);
            setEditedQuantity(selectedWatch.NgaySinh);
            setEditedType(selectedWatch.DiaChi);
        }

        fetchData();
        LTCData();
    }, [selectedWatch]);

    async function fetchData() {
        try {
            const token = localStorage.getItem('token');
            //console.log(token);
            const response = await API.get('/sinhvien/hienThiLopTinChiChuaDangKi', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWatches(response.data.data);
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
    }

    async function LTCData() {
        try {
            const token = localStorage.getItem('token');
            //console.log(token);
            const response = await API.get('/sinhvien/hienThiLopTinChiDaDangKi', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLTC(response.data.data);
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
    }

    const handleAddGiangVien = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(
                '/giangvien/themgiangvien',
                {
                    HoTen: addName,
                    HocVi: addHocVi,
                    HocHam: addHocHam,
                    Phai: addPhai,
                    NgaySinh: addNgaySinh,
                    DiaChi: addDiaChi,
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

    const handleAddPC = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(
                '/giangvien/phanCongGiangVien',
                {
                    MaGV: selectedWatch.MaGV,
                    MaLTC: selectedLTC.MaLTC,
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
        setShowAddForm(false);

        fetchData();
    };

    const handleAddTGB = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(
                '/giangvien/themBuoiCoTheDay',
                {
                    MaGV: selectedWatch.MaGV,
                    MaTGB: selectedTGBChua.MaTGB,
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
        handleThoiGianBieuClick();
    };

    const handleDeleteTGB = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(
                '/giangvien/xoaBuoiCoTheDay',
                {
                    MaGV: selectedWatch.MaGV,
                    MaTGB: selectedTGBCo.MaTGB,
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
        handleThoiGianBieuClick();
    };

    const handleAddKND = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(
                '/sinhvien/dangKi1LopTinChi',
                {
                    MaLTC: selectedWatch.MaLTC,
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
        handleKhaNangDayClick();
    };

    const handleDeleteKND = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await API.post(
                '/giangvien/xoaKhaNangDay',
                {
                    MaGV: selectedWatch.MaGV,
                    MaMH: selectedKNDCo.MaMH,
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
        handleKhaNangDayClick();
    };

    //data
    const columnsChuaDK = [
        { field: 'MaLTC', headerName: 'Họ Tên', width: 200 },
        { field: 'NamHoc', headerName: 'Học Vị', width: 100 },
        { field: 'HocKi', headerName: 'Học Hàm', width: 120 },
        { field: 'SLToiDa', headerName: 'Phái', width: 100 },
        { field: 'NgayBD', headerName: 'Ngày Sinh', width: 170 },
        { field: 'NgayKT', headerName: 'Địa Chỉ', width: 120 },
    ];

    const rowsChuaDK = watches.map((watch) => ({
        id: watch.MaLTC,
        MaLTC: watch.MaLTC,
        NamHoc: watch.NamHoc,
        HocKi: watch.HocKi,
        SLToiDa: watch.SLToiDa,
        NgayBD: watch.NgayBD.substring(0, 10),
        NgayKT: watch.NgayKT.substring(0, 10),
    }));

    const handleRowClick = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRow = params.row;
        setSelectedWatch(selectedRow);
    };

    //data phân công
    const columnsDaDK = [
        { field: 'MaLTC', headerName: 'Họ Tên', width: 200 },
        { field: 'NamHoc', headerName: 'Học Vị', width: 100 },
        { field: 'HocKi', headerName: 'Học Hàm', width: 120 },
        { field: 'SLToiDa', headerName: 'Phái', width: 100 },
        { field: 'NgayBD', headerName: 'Ngày Sinh', width: 170 },
        { field: 'NgayKT', headerName: 'Địa Chỉ', width: 120 },
    ];

    const rowsDaDK = LTC.map((ltc) => ({
        id: ltc.MaLTC,
        MaLTC: ltc.MaLTC,
        NamHoc: ltc.NamHoc,
        HocKi: ltc.HocKi,
        SLToiDa: ltc.SLToiDa,
        NgayBD: ltc.NgayBD.substring(0, 10),
        NgayKT: ltc.NgayKT.substring(0, 10),
    }));

    const handleRowClickPC = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRowPC = params.row;
        setSelectedLTC(selectedRowPC);
    };

    //thời gian biểu
    const columnsTGBCo = [
        { field: 'MaTGB', headerName: 'Mã TBG', width: 200 },
        { field: 'Thu', headerName: 'Thứ', width: 100 },
        { field: 'Buoi', headerName: 'Buổi', width: 120 },
    ];

    const rowsTGBCo = TGBCo.map((tgbCo) => ({
        id: tgbCo.MaTGB,
        MaTGB: tgbCo.MaTGB,
        Thu: tgbCo.Thu,
        Buoi: tgbCo.Buoi ? 'Sáng' : 'Chiều',
    }));

    const handleRowClickTGBCo = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRowTGBCo = params.row;
        setSelectedTGBCo(selectedRowTGBCo);
    };

    const columnsTGBChua = [
        { field: 'MaTGB', headerName: 'Mã TBG', width: 200 },
        { field: 'Thu', headerName: 'Thứ', width: 100 },
        { field: 'Buoi', headerName: 'Buổi', width: 120 },
    ];

    const rowsTGBChua = TGBChua.map((tgbChua) => ({
        //id: tgbChua.MaTGB,

        id: tgbChua.MaTGB,
        MaTGB: tgbChua.MaTGB,
        Thu: tgbChua.Thu,
        Buoi: tgbChua.Buoi ? 'Sáng' : 'Chiều',
    }));

    const handleRowClickTGBChua = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRowTGBChua = params.row;
        setSelectedTGBChua(selectedRowTGBChua);
    };

    //dataKND
    const columnsKNDCo = [
        { field: 'MaMH', headerName: 'Mã MH', width: 200 },
        { field: 'TenMH', headerName: 'Tên MH', width: 200 },
    ];

    const rowsKNDCo = KNDCo.map((knd) => ({
        id: knd.MaMH,
        MaMH: knd.MaMH,
        TenMH: knd.TenMH,
    }));

    const handleRowClickKNDCo = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRowKNDCo = params.row;
        setSelectedKNDCo(selectedRowKNDCo);
    };

    const columnsKNDChua = [
        { field: 'MaMH', headerName: 'Mã MH', width: 200 },
        { field: 'TenMH', headerName: 'Tên MH', width: 200 },
    ];

    const rowsKNDChua = KNDChua.map((knd) => ({
        id: knd.MaMH,
        MaMH: knd.MaMH,
        TenMH: knd.TenMH,
    }));

    const handleRowClickKNDChua = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRowKNDChua = params.row;
        setSelectedKNDChua(selectedRowKNDChua);
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
            console.log(editedHocVi);
            console.log(editedHocHam);
            console.log(editedLine);
            console.log(editedQuantity);
            console.log(editedType);
            const response = await API.put(
                `/giangvien/suaGiangVien/${selectedWatch.id}`,
                {
                    //watchId: selectedWatch.id,
                    HoTen: editedName,
                    HocVi: editedHocVi,
                    HocHam: editedHocHam,
                    Phai: editedLine,
                    NgaySinh: editedQuantity,
                    DiaChi: editedType,
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
                    HocVi: editedHocVi,
                    HocHam: editedHocHam,
                    Phai: editedLine === 1 ? 'Nam' : 'Nữ',
                    NgaySinh: editedQuantity,
                    DiaChi: editedType,
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

    const handleThoiGianBieuClick = async () => {
        // Thực hiện các thao tác lưu dữ liệu tại đây
        const token = localStorage.getItem('token');
        try {
            const response = await API.get(`/giangvien/hienThiBuoiCoTheDay/${selectedWatch.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                console.log('Watch updated successfully');
                setTGBCo(response.data.buoiCoTheDay);
            } else {
                console.log('Failed to update watch');
                // Xử lý khi cập nhật đồng hồ không thành công
            }
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }

        try {
            const response = await API.get(`/giangvien/hienThiBuoiChuaTheDay/${selectedWatch.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                console.log('Watch updated successfully');
                setTGBChua(response.data.buoiChuaTheDay);
            } else {
                console.log('Failed to update watch');
                // Xử lý khi cập nhật đồng hồ không thành công
            }
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }

        setshowTGB(true);
    };

    const handlePhanCongClick = async () => {
        setShowDataGridPC(true);
    };

    const handleKhaNangDayClick = async () => {
        // Thực hiện các thao tác lưu dữ liệu tại đây
        try {
            const token = localStorage.getItem('token');

            const response = await API.get(
                `/giangvien/hienThiKhaNangDay/${selectedWatch.id}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                // Xử lý thành công sau khi cập nhật
                setKNDCo(response.data.khaNangDay);

                // Xử lý khi cập nhật đồng hồ không thành công
            }
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }

        try {
            const token = localStorage.getItem('token');

            const response = await API.get(
                `/giangvien/hienThiMonChuaTheDay/${selectedWatch.id}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                // Xử lý thành công sau khi cập nhật
                setKNDChua(response.data.monChuaTheDay);

                // Xử lý khi cập nhật đồng hồ không thành công
            }
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
        setshowKND(true);
    };

    const handleDeleteWatch = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await API.delete(`/giangvien/xoaGiangVien/${selectedWatch.id}`, {
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
                await API.put(`/giangvien/choGiangVienNghi/${selectedWatch.id}`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Giảng viên đã được xóa mềm thành công');
                setSelectedWatch(false);
            } else {
                console.log('Không xóa giảng viên');
            }
        }
    };

    return (
        <div>
            <SidebarSV />

            <div className="form_watchlist">
                <div id="watchlist_container">
                    <div className="watchlist_content">
                        <div className="pl_header">
                            <div className="pl_header__title">
                                <h1 className="title-72">Giảng Viên</h1>
                            </div>
                        </div>
                        <div className="pl_watches anchor-plp-sections">
                            <section className="pl_section js-plp-section" data-group="1612">
                                <div style={{ height: 450, width: '100%' }}>
                                    <DataGrid rows={rowsChuaDK} columns={columnsChuaDK} onRowClick={handleRowClick} />
                                </div>

                                <div class="button-container">
                                    <button class="add-table-knd-btn" onClick={handleAddKND}>
                                        THÊM
                                    </button>
                                    <button class="remove-table-knd-btn" onClick={handleDeleteKND}>
                                        XÓA
                                    </button>
                                </div>

                                <div style={{ height: 450, width: '100%' }}>
                                    <DataGrid rows={rowsDaDK} columns={columnsDaDK} onRowClick={handleRowClick} />
                                </div>

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
                                            <input
                                                type="text"
                                                placeholder="Học Vị"
                                                value={addHocVi}
                                                onChange={(e) => setaddHocVi(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Học Hàm"
                                                value={addHocHam}
                                                onChange={(e) => setaddHocHam(e.target.value)}
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

                                            <button className="add-button" onClick={handleAddGiangVien}>
                                                <span>Xác Nhận</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditWatch;