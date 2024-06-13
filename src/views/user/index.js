import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import HtmlHead from "components/html-head/HtmlHead";
import BreadcrumbList from "components/breadcrumb-list/BreadcrumbList";
import { useTranslation } from "react-i18next";
import showMessage from "modules/message";
import { fetchRequest } from "utils/fetchRequest";
import { userProfile } from 'utils/fetchRequest/Urls';
import { userProfileDestroyAvatar } from 'utils/fetchRequest/Urls';
import { userProfileUploadAvatar } from 'utils/fetchRequest/Urls';
import { userProfileUploadBio } from 'utils/fetchRequest/Urls';
import DeleteProfileImage from "./modals/deleteProfileImage";
import UploadProfileImage from "./modals/uploadProfileImage";
import message from 'modules/message';
import BioRegisterModal from './modals/BioRegister';
import ControlPointIcon from '@mui/icons-material/ControlPoint';


const UserProfile = () => {
    const { t } = useTranslation();
    const [showDeleteProfileImageModal, setShowDeleteProfileImageModal] = useState(false)
    const [showUploadProfileImageModal, setShowUploadProfileImageModal] = useState(false)
    const [showUploadBioModal, setShowUploadBioModal] = useState(false)
    const [avatarFileValue, setAvatarFileValue] = useState(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState([])
    const [initLoader, setInitLoader] = useState(true)
    const [bio, setBio] = useState([])

    const description = "";
    const title = t("menu.profile");

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "user/profile", text:  title},
    ];

    const init = () => {
        setLoading(true)
        fetchRequest(userProfile, 'GET')
            .then((res) => {
                if (res.success) {
                    setUser(res.user);
                    setBio(res.user.bio);
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        setInitLoader(false)
        init();
    }, []);

   
    const uploadPersonalInformation = () => {
        setShowUploadBioModal(true)
    }
    const onUploadBioModalClose = () => {
        setShowUploadBioModal(false)
        setBio(null)
    }

    const uploadImage = () => {
        setShowUploadProfileImageModal(true)
    }
    const onModalClose = () => {
        setShowDeleteProfileImageModal(false)
    }
    const onUploadAvatarModalClose = () => {
        setShowUploadProfileImageModal(false)
        setAvatarFileValue(null)
    }
    const handleFileSelect = (e) => {
        const getFile = e.target.files[0]
        setAvatarFileValue(getFile)
    }
    const handleButtonClick = () => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'image/jpg, image/jpeg, image/png, image/*;capture=profile_image'
        fileInput.onchange = handleFileSelect
        fileInput.click()
    }

    const deleteProfileImage = () => {
        setShowDeleteProfileImageModal(true)
    }
    const onDeleteProfileImage = () => {
        setLoading(true)
        fetchRequest(userProfileDestroyAvatar, "GET")
            .then(res => {
                if (res.success) {
                    onModalClose()
                    message(res.message, true)
                    init();
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(e => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }
    

    const onUploadProfileImage = async () => {
        let formData = new FormData();
        formData.append('file[]', avatarFileValue);
        setLoading(true)
        fetchRequest(userProfileUploadAvatar, "POST", formData, true, true)
            .then(res => {
                if (res.success) {
                    onUploadAvatarModalClose()
                    message(res.message, true)
                    init();
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(e => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    const uploadBio = (params) => {
        setLoading(true)
        fetchRequest(userProfileUploadBio, 'POST', params)
            .then((res) => {
                if (res.success) {
                    onUploadBioModalClose(false)
                    message(res.message, true)
                    init()
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    // const onSubmit = (params) => {
    //     setLoading(true)
    //     fetchRequest(groupCreate, 'POST', params)
    //         .then((res) => {
    //             if (res.success) {
    //                 setShowAddModal(false)
    //                 history.push({
    //                     pathname: '/groups/edit',
    //                     state: {
    //                         id: res.id,
    //                     }
    //                 })
    //             } else {
    //                 message(res.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('errorMessage.title'));
    //             setLoading(false)
    //         })
    // }

    const onImageValNull = () => {
        setAvatarFileValue(null)
    }
    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
            </div>

            <Row className="">
                <Col xl="5" xxl="2" className="mt-6">
                    <Card className="mb-5 mt-7">
                        <Card.Body className="vh-100 text-center">
                            <img
                                className="img-fluid profile-avatar"
                                alt={user.name}
                                src={user.avatar ? user.avatar : '/img/profile/avatar.png'}
                                // style={{
                                //     minHeight: '85px',
                                //     height: '136px',
                                //     minWidth: '71px',
                                //     width: '133px', 
                                //     borderRadius: '100px',
                                //   }}
                                onError={(e) => {
                                    e.target.onError = null,
                                        e.target.src = '/img/profile/avatar.png'
                                }}
                            />
                            <Row className="text-center">
                                <button className='pinnacle-bold upload-image-button mt-4 text-center text-uppercase' onClick={uploadImage}>
                                    <div>{t("profile.upload_image")} </div>
                                </button>
                            </Row>
                            <Row>
                                <button className='btn pinnacle-bold back-button mt-2' onClick={deleteProfileImage}>{t("action.delete")}</button> 
                            </Row>
                            <div className="name pinnacle-bold text-center color-black" style={{position:'relative', top: 25, fontSize: 14, color: 'black' }}>
                                <div className="lastName"><b>{user.lastName}</b></div>
                                <div className="firstName"><b>{user.firstName}</b></div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl="8" xxl="10">
                    <div className="d-flex flex-row">
                        <Button variant="primary" className="mb-2 add-button bio pinnacle-bold" onClick={uploadPersonalInformation}>
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />{t("profile.upload_personal_information").toUpperCase()}
                        </Button>
                    </div>

                    <Card className="mt-3">
                        <Card.Body className="vh-100">
                            <div className="info" style={{paddingLeft: 17, paddingBottom: 12, paddingRight: 17,}} dangerouslySetInnerHTML={{ __html: user.bio }}></div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {
                showDeleteProfileImageModal &&
                <DeleteProfileImage
                    show={showDeleteProfileImageModal}
                    onClose={onModalClose}
                    onDeleteProfileImage={onDeleteProfileImage}
                    title={t('warning.delete')}>
                    {t('warning.delete_confirmation')}
                    <br />
                    <br />
                    {t('warning.delete_confirmation_description')}
                </DeleteProfileImage>
            }
            {
                showUploadProfileImageModal &&
                <UploadProfileImage
                    show={showUploadProfileImageModal}
                    onClose={onUploadAvatarModalClose}
                    onUploadProfileImage={onUploadProfileImage}
                    title={t('profile.upload_image')}
                    handleButtonClick={handleButtonClick}
                    avatarFileValue={avatarFileValue}
                    onFileNull = {onImageValNull}>
                </UploadProfileImage>
            }
            {
                loading &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                        </svg>
                    </div>
                </>
                 
            }
            {
                showUploadBioModal &&
                <BioRegisterModal
                    show={showUploadBioModal}
                    onClose={onUploadBioModalClose}
                    onUploadBio={uploadBio}
                    userId={user?.id}
                    bio={bio}
                />
            }
        </>
    );
};

export default UserProfile;
