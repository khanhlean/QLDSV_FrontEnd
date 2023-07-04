import React, { useEffect, useState } from 'react';
import API from '@/services/api';
import DefaultLayout from '../DefaultLayout/DefaultLayout';
import './Menu.scss';

const Menu = () => {
    const [staffName, setStaffName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Nếu không có token thì chuyển hướng đến trang đăng nhập
            // Vui lòng thay đổi đường dẫn '/login' nếu cần thiết
            window.location.href = '/';
        } else {
            // Lấy thông tin tài khoản từ API
            //getStaffProfile();
        }
    }, []);

    // const getStaffProfile = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await API.get('/account/get-staff', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         const { data } = response;
    //         if (data.success) {
    //             const staffProfile = data.data;
    //             console.log(staffProfile); // Thông tin người dùng nhân viên
    //         } else {
    //             console.log(data.message); // In thông báo lỗi từ server
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    return (
        <div>
            <div>
                <DefaultLayout>
                    <h1 className="text"></h1>
                </DefaultLayout>
            </div>
        </div>
    );
};

export default Menu;
