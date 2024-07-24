import React, { useState, useEffect } from 'react'
import { translations } from 'utils/translations'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
// import {
//     fetchClubTimetableRemove as fetchRemove,
//     fetchClubTimetable as fetch,
//     fetchClubTimetableOptions as fetchOptions
// } from 'Actions/action'
import popup from 'modules/message'
import CloseIcon from '@mui/icons-material/Close';

const DeleteModal = ({
    onClose,
    id,
    tab,
    club,
    lang = 'mn'
}) => {
    const dispatch = useDispatch()

    const loading = useSelector(state => state.clubTimetableRemove?.loading || false)
    const success = useSelector(state => state.clubTimetableRemove?.success || false)
    const message = useSelector(state => state.clubTimetableRemove?.data?.message || '')

    const [deleteClicked, setDeleteClicked] = useState(false)

    const onDelete = () => {
        if (id) {
            const params = {
                id,
                tab,
            }
            // dispatch(fetchRemove(params))
            setDeleteClicked(true)
        }
    }

    // useEffect(() => {
    //     if (deleteClicked && !loading) {
    //         if (success) {
    //             onClose()
    //             if (tab === 'group') {
    //                 dispatch(fetch())
    //             } else if (tab === 'timetable' && club) {
    //                 const params = {
    //                     group: club
    //                 }
    //                 dispatch(fetchOptions(params))
    //             }
    //         }
    //         popup(message, success)
    //     }
    // }, [loading])

    return (
        <Modal
            size='sm'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(lang).delete}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                {translations(lang).delete_confirmation}<br />
                {translations(lang).delete_confirmation_description}
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <div className="col-12 text-center">
                    <button className="btn m-btn--pill btn-link m-btn m-btn--custom" onClick={onClose}>
                        {translations(lang).back}
                    </button>
                    <button className="btn m-btn--pill btn-danger m-btn--wide text-uppercase" onClick={onDelete}>
                        {translations(lang).delete}
                    </button>
                </div>
            </Modal.Footer>
            {
                loading
                    ?
                    <div>
                        <div className="blockUI blockOverlay" />
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg" />
                        </div>
                    </div>
                    : null
            }
        </Modal>
    )
}

export default DeleteModal
