import { WechatWorkOutlined } from '@ant-design/icons';
import { BiMessageSquareDetail } from "react-icons/bi";
import { PiUserListBold } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { IoSettingsOutline, IoClose } from "react-icons/io5";
import { IoIosInformationCircleOutline, IoMdCreate } from "react-icons/io";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Avatar, notification, Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Tool.css';
import { socket } from '../../socket/socket';
import { allUsers, changePasswords, getUser, update } from '../../api/allUser';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';

export default function Tool() {
  const users = useSelector((state) => state.user.users);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [avatar, setAvatar] = useState();
  const [changePassword, setChangePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const openChangePassword = () => {
    setIsOpenChangePassword(true);
  };

  const closeChangePassword = () => {
    setIsOpenChangePassword(false);
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${update}${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchUserInfo();
      notification.success("Ảnh đại diện đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh đại diện:", error);
      notification.error("Có lỗi xảy ra khi cập nhật ảnh đại diện");
    }
  };

  const changeAvatar = () => {
    const avatarInput = document.getElementById('avatarUpload');
    if (avatarInput) {
      avatarInput.click();
    }
  };

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${getUser}/${userId}`, config);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setError('Không thể tải thông tin người dùng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleUpdateUserInfo = async (values) => {
    try {
      const onlyLettersRegex = /^[\p{L}\s]+$/u;
      if(values.fullname !== ''){
        if (!onlyLettersRegex.test(values.fullname)) {
          throw new Error('Tên chỉ được chứa chữ cái');
        }
      }
      if (users.some(user => user.userName === values.userName)) {
        throw new Error('Trùng UserName');
      }
      const formData = new FormData();
      formData.append('fullname', values.fullname ?? userInfo.fullname);
      formData.append('userName', values.userName ?? userInfo.userName);
      formData.append('birthday', values.birthday ?? userInfo.birthday);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');
      await axios.post(`${update}${userId}`, formData);
      notification.success({ message: 'Thông tin đã được cập nhật thành công!' });
      setIsUpdateModalOpen(false);
      fetchUserInfo();
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
      notification.error({ message: `${error.message}` });
    }
  };

  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleConfirm = async () => {
    const userId = localStorage.getItem('userId');
    if (oldPassword === "", changePassword === "", confirmPassword === ""){
      setError('Nhập trường còn trống');
      return;
    }

    if (oldPassword === changePassword) {
      setError('Mật khẩu mới phải khác mật khẩu cũ');
      return;
    }

    if (changePassword !== confirmPassword) {
      setError('Mật khẩu mới và mật khẩu xác nhận không khớp');
      return;
    }

    if (!isValidPassword(changePassword)) {
      setError('Mật khẩu mới không đủ mạnh');
      return;
    }
    try {
      const response = await axios.put(changePasswords, {
          userId: userId,
          oldPassword: oldPassword,
          newPassword: confirmPassword
      });
      setError('');
      message.success('Đã đổi mật khẩu thành công, tự động đăng xuất sau 10 giây', 10, () => {
        handleLogout();
      });
    } catch (error) {
      setError("Mật khẩu cũ không đúng");
    }
  };

  return (
    <div className="tool-container">
      <Avatar size={50} style={{ border: '2px solid white' }} src={userInfo.avatar } onClick={() => setIsPopupOpen(true)} />
      <div className='wrapper' title='Chat' >
        <BiMessageSquareDetail className="icon" style={{ fontSize: 30 ,}} onClick={() => navigate('/home')} />
      </div>
      <div className='wrapper' title='Danh sách bạn bè'>
        <PiUserListBold className="icon" style={{ fontSize: 30 }} onClick={() => navigate('/optionlist')} />
      </div>
      <div onClick={openChangePassword} className='wrapper' title='Đổi Mật Khẩu'>
        <IoSettingsOutline className="icon" style={{ fontSize: 30 }} />
      </div>
      <Modal width="500px" centered={true} bodyStyle={{ height: '300px' }} title="Đổi Mật Khẩu" visible={isOpenChangePassword} onCancel={closeChangePassword} footer={null}>
        <div style={{ flexDirection:'column',justifyContent:'space-around',height: "100%", width: "100%",display: 'flex' }}>
          <label>Nhập mật khẩu cũ</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input style={{height:30,borderRadius:7,borderColor:'#76ABAE', flex: 1}} type={showOldPassword ? "text" : "password"} onChange={(e) => setOldPassword(e.target.value)} value={oldPassword} />
            <span onClick={() => setShowOldPassword(!showOldPassword)} style={{ cursor: 'pointer', marginLeft: 430,position:'absolute' }}>
              {showOldPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>
          <label>Nhập mật khẩu mới</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input style={{height:30,borderRadius:7,borderColor:'#76ABAE', flex: 1}} type={showNewPassword ? "text" : "password"} onChange={(e) => setChangePassword(e.target.value)} value={changePassword} />
            <span onClick={() => setShowNewPassword(!showNewPassword)} style={{ cursor: 'pointer', marginLeft: 430,position:'absolute' }}>
              {showNewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>
          <label>Nhập lại Mật Khẩu Mới</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input style={{height:30,borderRadius:7,borderColor:'#76ABAE', flex: 1}} type={showConfirmPassword ? "text" : "password"} onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}style={{ cursor: 'pointer', marginLeft: 430,position:'absolute' }}>
              {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button style={{borderRadius:7,backgroundColor:'#76ABAE',color:'white',borderWidth:1}} onClick={handleConfirm}>Xác Nhận</button>
        </div>
      </Modal>
      <div className='wrapper' title='Đăng xuất'>
        <HiOutlineLogout onClick={handleLogout} className="icon" style={{ fontSize: 30 }} />
      </div>
      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <IoClose size={20} color='black'
              style={{
                top: 0,
                left: 0,
                cursor: 'pointer',
              }}
              onClick={() => setIsPopupOpen(false)}
            />
            <h2 style={{ paddingTop: '1px' }}>Thông tin cá nhân</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div style={{ textAlign:'left'}}>
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <div style={{
                    backgroundImage: 'url("https://source.unsplash.com/random/50")',
                    backgroundSize: 'cover',
                    borderRadius: '5px',
                    width: '100%',
                    height: '200px',
                    margin: '0 auto',
                  }}></div>
                  <Avatar size={100} src={userInfo.avatar || 'path_to_defau_avatar.jpg'} style={{
                    position: 'absolute',
                    bottom: '-50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    border: '3px solid white',
                  }} />
                  <IoMdCreate size={24}
                    style={{
                      position: 'absolute',
                      bottom: '-75px',
                      left: 'calc(50% + 55px)',
                      zIndex: 3,
                      cursor: 'pointer',
                      color: '#76ABAE',
                    }}
                    onClick={() => setIsUpdateModalOpen(true)}
                  />
                  <Modal
                    title="Cập nhật thông tin"
                    open={isUpdateModalOpen}
                    onCancel={() => setIsUpdateModalOpen(false)}
                    footer={null}
                  >
                    <Form
                      layout="vertical"
                      onFinish={handleUpdateUserInfo}
                    >
                      <Form.Item label="Họ và tên" name="fullname">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Username" name="userName">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Ngày sinh" name="birthday">
                        <Input type="date"/>
                      </Form.Item>
                      <Button type="primary" htmlType="submit">
                        Cập nhật
                      </Button>
                    </Form>
                  </Modal>
                </div>
                <button
                  className="infor"
                  style={{
                    marginTop: 50,
                    marginLeft: 180,
                    marginBottom: -100,
                    width: 100,
                    height: 50,
                    borderRadius: 20,
                    backgroundColor: '#76ABAE'
                  }}
                  onClick={changeAvatar}
                >
                  <input type="file" id="avatarUpload" style={{ display: 'none' }} onChange={handleAvatarChange} />
                  Thay đổi Avatar
                </button>
                <div style={{ paddingTop: '100px' }}>
                  <p>Full Name: {userInfo.fullname}</p>
                  <p>Email: {userInfo.email}</p>
                  <p>Username: {userInfo.userName}</p>
                  <p>Phone Number: {userInfo.phoneNumber}</p>
                  <p>Birthday:{moment(userInfo.birthday).format('DD-MM-YYYY')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
