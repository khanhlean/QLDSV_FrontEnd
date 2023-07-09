import React from 'react';
//import { push } from 'connected-react-router';
import { handleLogin } from '@/services/staffServices';
import './Login.scss';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'gv5',
            password: '123456789',
            //username: '',
            //password: '',
            isShowPassword: false,
            errMessage: '',
        };
    }

    handleInputChangeUsername = (event) => {
        this.setState({
            username: event.target.value,
        });
    };

    handleInputChangePassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    };

    handleLogin = async () => {
        try {
            const response = await handleLogin(this.state.username, this.state.password);
            const token = response.data.token;
            const maVaitro = response.data.MaVaitro;

            localStorage.setItem('token', token); // Lưu token vào local storage
            localStorage.setItem('MaVaitro', maVaitro);

            // Redirect đến trang menu
            if (maVaitro === 'QL') {
                this.props.history.push('/giangvien/menu');
            } else {
                this.props.history.push('/sinhvien/menu');
            }

            Swal.fire({
                title: 'Đăng nhập thành công',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK',
            });

            window.location.reload();
        } catch (error) {
            let errorMessage = 'Đăng nhập thất bại';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            Swal.fire({
                title: errorMessage,
                text: '',
                icon: 'error',
                confirmButtonText: 'OK',
            });

            this.setState({
                errMessage: errorMessage,
            });
        }
    };
    handleShowPassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };

    render() {
        //JSX

        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="login-text">Login</div>
                        <div className="login-input">
                            <label className="label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                                value={this.state.username}
                                onChange={(event) => this.handleInputChangeUsername(event)}
                            />
                        </div>

                        <div className="login-input">
                            <label className="label">Password</label>
                            <div className="custom-input-password">
                                <input
                                    type={this.state.isShowPassword ? 'text' : 'password'}
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={this.state.password}
                                    onChange={(event) => this.handleInputChangePassword(event)}
                                />
                                <span
                                    onClick={() => {
                                        this.handleShowPassword();
                                    }}
                                >
                                    <i className={this.state.isShowPassword ? 'fa fa-eye' : 'fa fa-eye-slash'}></i>
                                </span>
                            </div>
                            <div className="col-12">{this.state.errMessage}</div>
                        </div>
                        <button
                            className="btn-login"
                            onClick={() => {
                                this.handleLogin();
                            }}
                        >
                            Login
                        </button>
                    </div>

                    <form></form>
                </div>
            </div>
        );
    }
}

// mapDispatchToProps = (dispatch) => {};

export default Login;
