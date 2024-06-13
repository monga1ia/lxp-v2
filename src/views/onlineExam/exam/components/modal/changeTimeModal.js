import React, {useState} from "react";
import MainModal from "modules/MainModal";
import { useTranslation } from "react-i18next";
import DatePicker from "modules/Form/DatePicker";

export default function ChangeTimeModal({ show, onClose, tableRow, onSave }) {

    const { t } = useTranslation()
    const [selectedStartDate, setSelectedStartDate] = useState(tableRow?.startDate || null);
    const [selectedEndDate, setSelectedEndDate] = useState(tableRow?.endDate || null);
    const [duration, setDuration] = useState(tableRow.duration || '');

    const onDurationHandler = (e) => {
        setDuration(e.target.value)
    }

    const handleClose = () => {
        onSave(selectedStartDate, selectedEndDate, duration);
    };

    return (
        <MainModal title={t("quiz.changeTime")} show={show} onClose={onClose} onSave={handleClose} showFooter>
            <div className="row">
                <div className="d-flex flex-column align-items-center">
                    <div className="font-bold icon-15 font-heading mb-4">
                        {selectedStartDate} - {selectedEndDate}
                    </div>
                </div>
                <div className="col-3"/>
                <div className="col-6">
                    <div className="d-flex flex-column align-items-center" style={{position: 'relative', right: 60}}>
                        <div className="d-flex flex-row justify-content-end align-items-center mb-3" style={{width: '100%'}}>
                            <span className="modal-select-title mr-4" style={{width: 280, textAlign: 'right'}}>{t("common.begin")}*</span>
                            <DatePicker
                                className='datepicker-style'
                                wrapperClassName='w-100'
                                selectedDate={selectedStartDate}
                                onChange={(date) => setSelectedStartDate(date)}
                                showTimeInput={false}
                                showTimeSelect
                            />
                        </div>

                        <div className="d-flex flex-row justify-content-end align-items-center mb-3" style={{width: '100%'}}>
                            <span className="modal-select-title mr-4" style={{width: 280, textAlign: 'right'}}>{t("common.end")}*</span>
                            <DatePicker
                                className='datepicker-style'
                                wrapperClassName='w-100'
                                selectedDate={selectedEndDate}
                                onChange={(date) => setSelectedEndDate(date)}
                                showTimeInput={false}
                                showTimeSelect
                                minDate={new Date(selectedStartDate)}
                            />
                        </div>

                        <div className="d-flex flex-row justify-content-end align-items-center mb-3" style={{width: '100%'}}>
                            <span className="modal-select-title mr-4" style={{width: 280, textAlign: 'right'}}>{t("menu.examLength")}*</span>
                            <input
                                className="form-control"
                                value={duration}
                                onChange={onDurationHandler}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-3"/>
            </div>
        </MainModal>
    );
}
