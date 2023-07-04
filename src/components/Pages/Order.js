import './Order.scss';
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import urlImg from '@/services/urlImg';
import API from '@/services/api';
import Sidebar from '@/components/DefaultLayout/Sidebar/Sidebar';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setselectedOrder] = useState(null);

    useEffect(() => {
        fetchData();
    }, [selectedOrder]);

    async function fetchData() {
        try {
            const token = localStorage.getItem('token');
            // const response = await API.get('/watch/get-all-brands', {
            const response = await API.get('/order/get-all-orders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data.orders);
        } catch (error) {
            console.error(error);
            // Xử lý lỗi
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 0:
                return 'Progressing';
            case 1:
                return 'Purchasing';
            case 2:
                return 'Completed';
            case 3:
                return 'Aborting';
            case 4:
                return 'Aborted';
            default:
                return '';
        }
    };

    const columns = [
        { field: '_id', headerName: 'Order ID', width: 200 },
        { field: 'customerAddress', headerName: 'Customer Address', width: 120 },
        { field: 'customerPhone', headerName: 'Customer Phone', width: 120 },
        {
            field: 'items',
            headerName: 'Items',
            width: 300,
            renderCell: (params) => (
                <ul>
                    {params.value.map((item) => (
                        <li key={item._id}>{item.watch.name}</li>
                    ))}
                </ul>
            ),
        },
        { field: 'total', headerName: 'Total', width: 150 },
        { field: 'status', headerName: 'Status', width: 150, valueGetter: (params) => getStatusLabel(params.value) },
        { field: 'date', headerName: 'Date', width: 200 },
    ];

    const rows = orders.map((order) => ({
        id: order._id,
        _id: order._id,
        customerAddress: order.customer.address,
        customerPhone: order.customer.phone,
        items: order.items,
        total: order.total,
        status: order.status,
        date: order.date,
    }));

    const getItemNames = () => {
        if (selectedOrder && selectedOrder.items) {
            return selectedOrder.items.map((item) => item.watch.name).join(', ');
        }
        return '';
    };

    const handleRowClick = (params) => {
        // Lấy thông tin đồng hồ từ hàng được bấm
        const selectedRow = params.row;
        setselectedOrder(selectedRow);
    };

    const handleBtnProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(`/order/order-processing/${selectedOrder._id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data);
            fetchData();
            setselectedOrder(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBtnCancel = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.post(`/order/cancel-arborting-order/${selectedOrder._id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchData();
            setselectedOrder(false);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // const handleSaveClick = async () => {
    //     // Thực hiện các thao tác lưu dữ liệu tại đây
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await API.put(
    //             `/watch/update-brand-by-id/${selectedOrder.id}`,
    //             {
    //                 //watchId: selectedOrder.id,
    //                 name: editedName,
    //                 description: editedDescription,
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             },
    //         );

    //         if (response.data.success) {
    //             console.log('Brand updated successfully');
    //             // Xử lý thành công sau khi cập nhật đồng hồ
    //             setselectedOrder({
    //                 ...selectedOrder,
    //                 name: editedName,
    //                 description: editedDescription,
    //             });
    //         } else {
    //             console.log('Failed to update watch');
    //             // Xử lý khi cập nhật đồng hồ không thành công
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         // Xử lý lỗi
    //     }

    //     setIsEditing(false);
    // };

    // const handleDeleteWatch = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         console.log(selectedOrder.id);
    //         const response = await API.delete(`/watch/delete-watch-by-id/${selectedOrder.id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         if (response.data.success) {
    //             // Xóa đồng hồ thành công
    //             console.log('Watch deleted successfully');
    //         } else {
    //             // Lỗi khi xóa đồng hồ
    //             console.log('Error deleting watch');
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         // Xử lý lỗi
    //     }
    // };

    return (
        <div>
            <Sidebar />
            <div className="form_watchlist">
                <div id="watchlist_container">
                    <div className="watchlist_content">
                        <div className="pl_header">
                            <div className="pl_header__title">
                                <h1 className="title-72">All orders </h1>
                            </div>
                        </div>
                        <div className="pl_watches anchor-plp-sections">
                            <section className="pl_section js-plp-section" data-group="1612">
                                <div style={{ height: 600, width: '100%' }}>
                                    <DataGrid rows={rows} columns={columns} onRowClick={handleRowClick} />
                                </div>

                                {selectedOrder && (
                                    <div>
                                        <div className="show-order-form-overlay">
                                            <div className="show-order-form-container">
                                                <button
                                                    className="close-button"
                                                    onClick={() => {
                                                        setselectedOrder(false);
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </button>
                                                <h2>Order Details</h2>
                                                <form>
                                                    <div className="info-container">
                                                        <p className="text">Order ID: {selectedOrder._id}</p>
                                                        <p className="text">
                                                            Customer Address: {selectedOrder.customerAddress}
                                                        </p>
                                                        <p className="text">
                                                            Customer Phone: {selectedOrder.customerPhone}
                                                        </p>
                                                        <p className="text">Items: {getItemNames()}</p>
                                                        <p className="text">Total: {selectedOrder.total}$</p>
                                                        {/* <p className="text">Status: {selectedOrder.status}</p> */}
                                                        <p className="text">
                                                            Status: {getStatusLabel(selectedOrder.status)}
                                                        </p>

                                                        <p className="text">Date: {selectedOrder.date}</p>
                                                    </div>
                                                </form>
                                                <div className="btn-container">
                                                    {/* // 0:Progressing // 1:Purchasing // 2:Completed // 3:Arborting// 4:Arborted */}
                                                    {selectedOrder.status === 0 && (
                                                        <button
                                                            type="button"
                                                            className="button"
                                                            onClick={handleBtnProgress}
                                                        >
                                                            Purchasing
                                                        </button>
                                                    )}
                                                    {selectedOrder.status === 1 && (
                                                        <button
                                                            type="button"
                                                            className="button"
                                                            onClick={handleBtnProgress}
                                                        >
                                                            Completed
                                                        </button>
                                                    )}
                                                    {/* {selectedOrder.status === 2 && (
                                                            <button
                                                                type="button"
                                                                className="button"
                                                                onClick={handleBtnProgress}
                                                            >
                                                                Completed
                                                            </button>
                                                        )} */}
                                                    {selectedOrder.status === 3 && (
                                                        <div>
                                                            <button
                                                                type="button"
                                                                className="button"
                                                                onClick={handleBtnProgress}
                                                            >
                                                                Aborted
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="button"
                                                                onClick={handleBtnCancel}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                    {selectedOrder.status === 4 && (
                                                        <button
                                                            type="button"
                                                            className="button"
                                                            onClick={handleBtnProgress}
                                                        >
                                                            Processing
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
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

export default Order;
