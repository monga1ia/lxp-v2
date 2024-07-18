// import {Form, Radio, Modal} from 'semantic-ui-react'
import {Col, Row, Modal} from 'react-bootstrap'
import React, {useEffect, useState} from 'react'
import secureLocalStorage from 'react-secure-storage'
import {translations} from 'utils/translations'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {NDropdown as Dropdown} from "widgets/Dropdown";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const edit = ({onClose, onSubmit, esisData = {}, title = '', options = []}) => {
    const [loading, setLoading] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null)

    useEffect(() => {
        console.log('OP', esisData)
        console.log('OP', options)
    }, [])

    const onSelect = (e, data) => {
        setSelectedOption(data?.value)
    }

    const handleSubmit = () => {
        onSubmit({...esisData, ...{paramId: selectedOption}})
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='br-20 border-orange p-3 text-grey'>
                    {
                        options && options.length > 0 &&
                        <Dropdown
                            placeholder={'-' + translations(locale).select + '-' || ""}
                            fluid
                            selection
                            search={true}
                            additionPosition='bottom'
                            upward={false}
                            selectOnBlur={false}
                            value={selectedOption}
                            options={options}
                            onChange={onSelect}
                        />
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button 
                    onClick={onClose}
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                >
                    {translations(locale)?.close}        
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn m-btn--pill btn-success text-uppercase"
                >
                    {translations(locale)?.connect}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </Modal>
    )
}

export default edit