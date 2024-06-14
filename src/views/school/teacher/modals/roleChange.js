import message from 'modules/message'
import { Modal } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'Utilities/fetchRequest'
import { translations } from 'Utilities/translations'
import { schoolTeacherRoleChange } from 'Utilities/url'
import { NDropdown as Dropdown } from 'Widgets/Dropdown'

const roleChange = ({ onClose, onSubmit, teacher }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [selectedRoles, setSelectedRoles] = useState([])
    const [roleOptions, setRoleOptions] = useState([])

    useEffect(() => {
        setLoading(true)
        fetchRequest(schoolTeacherRoleChange, 'POST', { teacher })
            .then((res) => {
                if (res.success) {
                    const { roles, roleIds } = res?.data
                    setRoleOptions(roles || [])
                    setSelectedRoles(roleIds || [])
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }, [])

    const handleSave = () => {
        if (!selectedRoles.length) return message(translations(locale)?.err?.fill_all_fields)
        onSubmit(selectedRoles)
    }

    return (
        <Modal
            centered
            open={true}
            size='small'
            onClose={onClose}
            dimmer='blurring'
            className="react-modal overflow-modal"
        >
            <div className="header">
                {translations(locale)?.manage_roles}
                <button type="button" className="close" aria-label="Close" onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className="content">
                <div className="form-group m-form__group row">
                    <label className="col-4 col-form-label text-right label-pinnacle-bold">
                        {translations(locale)?.role}*
                    </label>
                    <div className="col-5">
                        <Dropdown
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
                        />
                    </div>
                </div>
            </div>
            <div className="actions modal-footer">
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
            </div>
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