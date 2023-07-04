import React from 'react';
//import { push } from 'connected-react-router';
import { handleLogin } from '@/services/staffServices';
import './Login.scss';

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
        //alert('Login success');
        this.setState({
            errMessage: '',
        });
        try {
            const response = await handleLogin(this.state.username, this.state.password);
            const token = response.data.token;
            const maVaitro = response.data.MaVaitro;

            localStorage.setItem('token', token); // Lưu token vào local storage
            localStorage.setItem('MaVaitro', maVaitro);

            // Redirect đến trang menu
            if (maVaitro == 'QL') {
                this.props.history.push('/giangvien/menu');
                window.location.reload();
            } else {
                this.props.history.push('/sinhvien/menu');
                window.location.reload();
            }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMessage: e.response.data.message,
                    });
                }
            }
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
