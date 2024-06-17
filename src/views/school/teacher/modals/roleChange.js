import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import Select from 'modules/Form/Select'

const roleChange = ({ onClose, onSubmit, teacher }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [selectedRoles, setSelectedRoles] = useState([])
    const [roleOptions, setRoleOptions] = useState([{value: '121', text: '123123'}, {value: '23123', text: 'text2'}])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(schoolTeacherRoleChange, 'POST', { teacher })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { roles, roleIds } = res?.data
    //                 setRoleOptions(roles || [])
    //                 setSelectedRoles(roleIds || [])
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }, [])

    const handleSave = () => {
        if (!selectedRoles.length) return message(translations(locale)?.err?.fill_all_fields)
        onSubmit(selectedRoles)
    }

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='xl'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                {translations(locale)?.manage_roles}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group m-form__group row">
                    <label className="col-4 col-form-label text-right label-pinnacle-bold">
                        {translations(locale)?.role}*
                    </label>
                    <div className="col-5">
                        <Select
                            multiple={true}
                            additionPosition='bottom'
                            value={selectedRoles}
                            options={roleOptions}
                            onChange={(data) => setSelectedRoles(data)}
                        />
                        {/* <Dropdown
                            placeholder={'-' + translations(locale)?.select + '-'}
                            fluid
                            selection
                            multiple
                            additionPosition='bottom'
                            upward={false}
                            selectOnBlur={false}
                            value={selectedRoles}
                            options={roleOptions}
                            onChange={(e, data) => setSelectedRoles(data?.value)}
                        /> */}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <div className='text-center w-100'>
                    <button
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                        onClick={onClose}
                    >
                        {translations(locale)?.back}
                    </button>
                    <button
                        className="btn m-btn--pill btn-success m-btn--wide"
                        onClick={handleSave}
                    >
                        {translations(locale)?.save}
                    </button>
                </div>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
        </Modal>
    )
}

export default roleChange