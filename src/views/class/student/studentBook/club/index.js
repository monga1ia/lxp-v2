import React, {useState, useEffect} from 'react'
import {Col, Row} from 'react-bootstrap'
import DTable from 'modules/DataTable/DTable'
import TreeView from 'modules/TreeView2'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import ClubModal from '../modal/clubModal'
import {studentBookClub} from 'utils/fetchRequest/Urls'
import {fetchRequest} from 'utils/fetchRequest'
import message from "modules/message";

const club = ({student}) => {
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    const [selectedGroupId, setSelectedGroupId] = useState(null)
    const [selectedTypeId, setSelectedTypeId] = useState(null)
    const [showClubModal, setShowClubModal] = useState(false)

    const [tableData, setTableData] = useState([])
    const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(null)

    const config = {
        excelExport: true,
        excelFileName: `${student?.studentCode}-${t(locale)?.student?.book_title}-${t(locale)?.club?.title}`,
        defaultSort: [{
            dataField: 'name',
            order: 'asc'
        }]
    }

    const [columns, setColumns] = useState([])

    const loadData = (season = null) => {
        setLoading(true)
        // fetchRequest(studentBookClub, 'POST', {id: student?.id, season})
        //     .then(res => {
        //         if (res.success) {
        //             const {groups, seasons, selectedSeason, attendanceTypes} = res.data

        //             const defaultColumns = [
        //                 {
        //                     dataField: "name",
        //                     text: t('club.title'),
        //                     sort: true
        //                 },
        //                 {
        //                     dataField: "teacherFirstname",
        //                     text: t('teacher_title'),
        //                     sort: true
        //                 }
        //             ]
        //             if (attendanceTypes && attendanceTypes.length > 0) {
        //                 for (let at = 0; at < attendanceTypes.length; at++) {
        //                     defaultColumns.push({
        //                         dataField: 'type_' + attendanceTypes[at].id,
        //                         text: attendanceTypes[at].name,
        //                         sort: true,
        //                         align: 'right',
        //                         formatter: (cell, row) => <span onClick={() => handleCellClick(row?.id, attendanceTypes[at].id)}
        //                                                         className='underline'> {cell || 0}</span>
        //                     })
        //                 }
        //             }
        //             setSelectedTreeData(selectedSeason)
        //             setColumns(defaultColumns)
        //             setTableData(groups || [])
        //             setTreeData(seasons || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        // loadData()
    }, [])

    const handleCellClick = (group, type) => {
        setSelectedGroupId(group)
        setSelectedTypeId(type)
        setShowClubModal(true)
    }


    const closeModal = () => {
        setSelectedGroupId(null)
        setSelectedTypeId(null)
        setShowClubModal(false)
    }

    const handleTreeChange = (key) => {
        setSelectedTreeData(key)
        loadData(key)
    }

    return (
        <div className='m-portlet__body'>
            <Row>
                <Col md={3} className='col-form-label text-right'>
                    <div className='m-portlet__body border-orange br-08 ' style={{borderWidth: 4, textAlign: 'left'}}>
                        <TreeView
                            defaultExpandAll
                            treeData={treeData}
                            selectedNodes={[selectedTreeData]}
                            onSelect={(key) => {
                                handleTreeChange(key?.[0])
                            }}
                        />
                    </div>
                </Col>
                <Col md={9}>
                    <div className='border-orange px-4 br-08 mt-2'>
                        <DTable
                            locale={locale}
                            config={config}
                            data={tableData}
                            columns={columns}
                        />
                    </div>
                </Col>
            </Row>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
            {showClubModal &&
            <ClubModal
                onClose={closeModal}
                season={selectedTreeData}
                group={selectedGroupId}
                type={selectedTypeId}
                studentId={student?.id}
                studentCode={student?.studentCode}
            />
            }
        </div>
    )
}


export default club