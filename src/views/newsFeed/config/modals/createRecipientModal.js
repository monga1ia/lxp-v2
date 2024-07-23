import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { translations } from 'utils/translations';
import message from 'modules/message';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import Forms from 'modules/Form/Forms';
import { Checkbox, Container } from 'semantic-ui-react';
import { Row, Col} from 'react-bootstrap';

const locale = 'mn'

const CreateRecipient = ({ onClose, onSubmit, data, createRecipientParams }) => {
    
    const { t } = useTranslation();
    const [selectedRoleId, setSelectedRoleId] = useState(null)

    const [roleList, setRoleList] = useState(data?.roleList || [])
    const [recipientList, setRecipientList] = useState(data?.recipientList|| [])


    const [oldRecipientList, setOldRecipientList] = useState(data?.recipientList)
    // const [oldRecipientList, setOldRecipientList] = useState(data?.oldRecipientList) <--------- Change to this after connecting backend, line above is frontend debugging

    const [isRecipientAll, setIsRecipientAll] = useState(false)

    const [newRecipientFilter, setNewRecipientFilter] = useState('')

    const handlerRole = (e, data) => {
        let userList = [];
        if(data.value){
            if(oldRecipientList && oldRecipientList.length > 0){
                for(let i = 0; i < oldRecipientList.length; i++){

                    // console.log(oldRecipientList[i].roleIds.find(roleId => roleId == data.value))

                    if(oldRecipientList[i].roleIds.find(roleId => roleId == data.value)){
                        userList.push(oldRecipientList[i])
                    }
                }
            }

            setRecipientList(userList);
        } else {
            setRecipientList(oldRecipientList);
        }

        setSelectedRoleId(data.value) 
    }

    const filterUsers = () => {
        let users = [...recipientList];
        if (newRecipientFilter && newRecipientFilter.length > 0) {
            let filtered = [];
            for (let i = 0; i < users.length; i++) {
                let userObj = users[i];
                if ((userObj.lastName && userObj.lastName.toLowerCase().includes(newRecipientFilter.toLowerCase()))
                    || (userObj.firstName && userObj.firstName.toLowerCase().includes(newRecipientFilter.toLowerCase()))
                    || (userObj.roles && userObj.roles.toLowerCase().includes(newRecipientFilter.toLowerCase()))
                ) {
                    filtered.push(userObj)
                }
            }
            users = filtered;
        }

        return users;
    }

    const onUserClick = (userId) => {
        let modalUsers = [...recipientList]

        let selectedUser = modalUsers.find((user) => user.id === userId)

        if (selectedUser) {
            if (selectedUser['checked']) {
                selectedUser['checked'] = false;
            } else {
                selectedUser['checked'] = true;
            }
        }

        setRecipientList(modalUsers) 
    }

    const _onRecipientAllChange = (isChecked) => {
        let modalUsers = [...recipientList]

        for (let i = 0; i < modalUsers.length; i++) {
            let selectedUser = modalUsers[i];
            selectedUser['checked'] = isChecked
        }

        setRecipientList(modalUsers)
        setIsRecipientAll(isChecked)
    }

    const handleSubmit = () => {
        let modalUsers = [...recipientList];
        let selectedUserIds = [];
        for (let i = 0; i < modalUsers.length; i++) {
            let modalUser = modalUsers[i];
            if (modalUser.checked) {
                selectedUserIds.push(modalUser.id);
            }
        }

        if (selectedUserIds.length > 0) {
            let users = JSON.stringify(selectedUserIds)

            onSubmit(users)
        } else {
            message(translations(locale).newsfeedConfig.selectHdrRecipient);
        }
    }

    return (
        <Modal
            size='lg'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('action.delete')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <div className="row form-group">
                    <div className="col-12" style={{display: 'flex'}}>
                        <div style={{margin: 'auto'}}>
                            <table>
                                <tbody>
                                    <tr>
                                        <th className='pr-2'>
                                            {translations(locale).role}
                                        </th>
                                        <th className='pr-2'>
                                            <Dropdown
                                                fluid
                                                search
                                                clearable
                                                selection
                                                value={selectedRoleId}
                                                options={roleList}
                                                onChange={handlerRole}
                                                closeOnChange
                                                style={{
                                                    width: 200,
                                                    borderRadius: 8,
                                                }}
                                            />
                                        </th>
                                        <th>
                                            <input
                                                type="text"
                                                className={"form-control"}
                                                value={newRecipientFilter}
                                                style={{
                                                    maxWidth: 200,
                                                    borderRadius: 8,
                                                }}
                                                onChange={(e) => {
                                                    setNewRecipientFilter(e.target.value) 
                                                }} 
                                                placeholder={translations(locale).search}
                                            />
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-12">
                        <Checkbox 
                            label={translations(locale).select_all}
                            checked={isRecipientAll}
                            onChange={(e, data) => _onRecipientAllChange(data.checked)} 
                        />
                    </div>
                </div>
                <div className="row form-group">
                    {
                        recipientList && recipientList.length > 0 && 
                        filterUsers().map(function (user) {
                            return <div className="col-md-6 col-xs-12" key={'user_' + user.id}>

                                <Container textAlign='center' style={{ display: 'inline-flex', marginBottom: 10 }}>
                                    <Checkbox 
                                        label=''
                                        checked={user.checked}
                                        onChange={(e, data) => onUserClick(user.id, data.checked)} 
                                        style={{position: 'relative', top: 13, right: 5}}
                                    />
                                    <img className="m--img-rounded m--marginless m--img-centered"
                                        onError={(e) => {
                                            e.target.onError = null,
                                                e.target.src = '/img/profile/avatar.png'
                                        }}
                                        onClick={() => onUserClick(user.id)}
                                        width="45" height="45"
                                        src={user.avatar || '/img/profile/avatar.jpg'} />
                                    <div
                                        onClick={() => onUserClick(user.id)}
                                        style={{ 
                                            cursor: 'pointer', 
                                            marginLeft: 10, 
                                            textAlign: 'left',
                                            width: '100%',
                                            display: 'grid'
                                        }}>
                                        <span style={{color: '#ff5b1d', marginBottom: 3}}><b>{user.firstName.toUpperCase()} {user.lastName}</b></span>
                                        <span 
                                            style={{
                                                display: 'table-caption',
                                                background: '#c2c3c4',
                                                borderRadius: 6,
                                                padding: 5,
                                                width: '100%'
                                            }}
                                        >
                                            {user.roles}
                                        </span>
                                    </div>
                                </Container>
                            </div>
                        })
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    onClick={onClose}
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                >
                    {t('back').toUpperCase()}
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn btn-success m-btn--pill m-btn--air"
                    style={{fontSize: '13px'}}
                >
                    {t('save').toUpperCase()}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default CreateRecipient