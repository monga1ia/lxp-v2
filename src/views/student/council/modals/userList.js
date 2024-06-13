import React, {useState} from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const UserListModal = ({
    onClose = () => { },
    show = false,
    object,
    list = []
}) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false)

    return (
        <Modal
            show={show}
            onHide={onClose}
            size='xl'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-3">
                <Modal.Title className="d-flex flex-row justify-content-between w-100 black-color fs-20">
                    {object?.name || ''}
                    <button type="button" className="btn-close" onClick={onClose} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{padding: '1rem 1rem 2rem 1rem'}}>
                <div className="col-12 mb-4">
                    <div className="fs-16" dangerouslySetInnerHTML={{ __html: object.description || '' }} />
                </div>
                <div className="d-flex" style={{flexWrap: 'wrap'}}>
                    {
                        list && list.length > 0 &&
                        list.map((data, index) => {
                            return (
                                <div className='mb-3' style={{width: 'calc(100% / 5)'}} key={'student_' + index}>
                                    <div className="col-12 text-center">
                                        <img
                                            className="profile"
                                            alt={data?.firstName}
                                            src={data?.avatar || '/img/profile/placeholder.jpg'}
                                            width={150}
                                            height={150}
                                            style={{borderRadius: 6}}
                                        />
                                    </div>
                                    <div className='col-12 text-center mt-3 black-color fs-14 font-weight-400'>
                                        {data?.className || '-'}
                                    </div>
                                    <div className='col-12 text-center black-color fs-14 font-weight-400'>
                                        {data?.lastName || '-'}
                                    </div>
                                    <div className='col-12 text-center fs-16 font-weight-700' style={{color: '#3C358F'}}>
                                        {data?.firstName?.toUpperCase() || '-'}
                                    </div>
                                    <div className='col-12 text-center black-color fs-14 font-weight-400' style={{paddingLeft: 15, paddingRight: 15}}>
                                        {data?.memberType || '-'}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className="p-3">
                <div className="d-flex flex-row justify-content-center align-items-center w-100">
                    <Button className='btn btn-primary' variant='empty' onClick={onClose} style={{padding: '8px 20px'}}>
                        <span className="fs-14">{t('common.close')}</span>
                    </Button>
                </div>
            </Modal.Footer>
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
        </Modal>
    );
};

export default UserListModal;
