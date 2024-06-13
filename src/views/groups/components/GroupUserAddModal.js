import React, { useEffect, useState } from "react";
import DTable from "modules/DataTable/DTable";
import Select from "modules/Form/Select";
import { useTranslation } from "react-i18next";
import MainModal from "modules/MainModal";

const GroupUserAddModal = ({ 
    show,
    onClose,
    schools,
    users,
    onChangeSchool,
    selectedSchoolId,
    onChangeCheck,
    onSubmit
}) => {
    const { t } = useTranslation();
    const [schoolId, setSchoolId] = useState(null);

    useEffect(() => {
        if(selectedSchoolId){
            setSchoolId(selectedSchoolId)
        } else {
            if(schools && schools.length == 1){
                
            }
        }
    }, [selectedSchoolId])

    useEffect(() => {
        if(schools && schools.length == 1){
            setSchoolId(schools[0].value)
        }
    }, [schools])

    const config = {
        showPagination: false,
        showFilter: true,
        showAllData: true,
        tableMarginLess: true,
    };

    const columns = [
        {
            dataField: "title",
            text: t("menu.roles"),
            sort: true,
        },
        {
            dataField: "code",
            text: t("common.code"),
            sort: true,
        },
        {
            dataField: "lastName",
            text: t("common.lastName"),
            sort: true,
        },
        {
            dataField: "firstName",
            text: t("common.firstName"),
            sort: true,
        },
    ];

    const handleDropdownChange = (value) => {
        setSchoolId(value)
        onChangeSchool(value)
    }

    return (
        <MainModal 
            title="Хэрэглэгч нэмэх" 
            show={show} 
            onClose={onClose} 
            showFooter
            onSave={onSubmit}
        >
            <div className="d-flex flex-row justify-content-center align-items-center mb-4">
                <div className="mr-4 modal-select-title">Сургууль</div>
                <Select
                    className="modal-select" 
                    onChange={(e) => handleDropdownChange(e)}
                    value={schoolId}
                    searchable
                    clearable
                    options={schools}
                />
            </div>

            <DTable
                config={config}
                columns={columns}
                data={users}
                checkable
                onCheckable={onChangeCheck}
            />
        </MainModal>
    );
};

export default GroupUserAddModal;
