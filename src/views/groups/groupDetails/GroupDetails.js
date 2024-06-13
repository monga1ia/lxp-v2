import { React, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { t } from "i18next";
import secureLocalStorage from 'react-secure-storage'
import TabComponent from "components/tab/Tab";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { groupEditData, groupEdit } from "utils/fetchRequest/Urls";
import { fetchRequest } from 'utils/fetchRequest';
import message from 'modules/message'
import StudentsTab from "../components/StudentsTab";
import TeachersTab from "../components/TeachersTab";
import GroupEditModal from "../components/GroupEditModal";

const teacherTableIndex = ['group_teacher_table_index']
const studentTableIndex = ['group_student_table_index']

const GroupDetails = () => {
    const history = useHistory();
    const location = useLocation();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [urlData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState([]);
    const [studentTableData, setStudentTableData] = useState([]);
    const [teacherTableData, setTeacherTableData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [groupData, setGroupData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(null);

    const [curriculums, setCurriculums] = useState([]);
    const [grades, setGrades] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [schools, setSchools] = useState([]);

    const [selectedTab, setSelectedTab] = useState('students');
    const state =
        selectedTab == 'students'
            ?
            secureLocalStorage.getItem(studentTableIndex)
            :
            secureLocalStorage.getItem(teacherTableIndex)

    const [studentTableState, setStudentTableState] = useState(
        {
            page: state?.page || 1,
            pageSize: state?.pageSize || 10,
            search: state?.search || '',
            sort: state?.sort || 'firstName',
            order: state?.order || 'asc'
        }
    )

    const [tableState, setTableState] = useState(
        {
            page: state?.page || 1,
            pageSize: state?.pageSize || 10,
            search: state?.search || '',
            sort: state?.sort || 'firstName',
            order: state?.order || 'asc'
        }
    )

    const onBackHandler = () => {
        if (urlData) {
            history.push(urlData.url)
        } else {
            history.push('/groups/index')
        }
    }

    const init = (params) => {
        setLoading(true)
        fetchRequest(groupEdit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setStudentTableData(res?.students || [])
                    setTeacherTableData(res?.userList || [])
                    setTotalCount(res?.totalCount || 0)
                    setGroupData(res?.groupData || [])
                    setTreeData(res?.schoolList || [])
                    setLoading(false)
                } else {
                    message(res.message)
                    setLoading(false)
                }
            })
            .catch(() => {
                message(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        let params = {
            group: location?.state?.id,
            type: selectedTab,
            page: tableState.page,
            pageSize: tableState.pageSize,
            search: tableState.search,
            order: tableState.order,
            sort: tableState.sort,
        }

        init(params)
    }, [])

    const onEditButtonHandler = () => {
        setLoading(true)
        const params = {
            school: selectedSchool.id,
            curriculum: groupData.curriculumId,
            grade: groupData.gradeId
        }

        fetchRequest(groupEditData, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const curriculumList = res.curriculums;
                    const gradeList = res.grades;
                    const subjectList = res.subjects;
                    const schoolList = res.schools;

                    if (curriculumList && curriculumList.length) {
                        setCurriculums(curriculumList.map(curriculum => ({ value: curriculum.id, text: curriculum.name, code: curriculum.code })))
                    }

                    if (gradeList && gradeList.length) {
                        setGrades(gradeList.map(grade => ({ value: grade.id, text: grade.name, code: grade.code })))
                    }

                    if (schoolList && schoolList.length) {
                        setSchools(schoolList.map(school => ({ value: school.id, text: school.name, grades: school.schoolGrades })))
                    }

                    if (subjectList && subjectList.length) {
                        setSubjects(subjectList.map(subject => ({ value: subject.id, text: subject.name, code: subject.code })))
                    }

                    setShowEditModal(true)
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

    const onEditSubmit = (params) => {
        setLoading(true)
        fetchRequest(groupEdit, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setGroupData(res?.groupData || null)
                    setTreeData(res?.schoolList || [])
                    setShowEditModal(false)
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

    const onTabChange = (activeIndex, code) => {
        setSelectedTab(code)

        let params = {
            group: location?.state?.id,
            type: code,
            page: tableState.page,
            pageSize: tableState.pageSize,
            search: tableState.search,
            order: tableState.order,
            sort: tableState.sort,
        }

        init(params)
    }

    const studentChangeTableData = (data) => {
        setStudentTableData(data)
    }

    const studentChangeTreeData = (data) => {
        setTreeData(data)
    }

    const teacherChangeTableData = (data) => {
        setTeacherTableData(data)
    }

    const teacherChangeTreeData = (data) => {
        setTreeData(data)
    }

    const studentInteraction = (data) => {
        if(data.search){
            if (data.page) {
                setStudentTableState(data)
                secureLocalStorage.setItem(studentTableIndex, data)
    
                let params = {
                    group: location?.state?.id,
                    type: selectedTab,
                    school: data.school,
                    page: state.search == data.search ? data.page : 1,
                    pageSize: data.pageSize,
                    search: data.search,
                    order: data.order,
                    sort: data.sort,
                }
    
                init(params)
            }
        } else {
            if (data.page) {
                setStudentTableState(data)
                secureLocalStorage.setItem(studentTableIndex, data)
    
                let params = {
                    group: location?.state?.id,
                    type: selectedTab,
                    school: data.school,
                    page: data.page,
                    pageSize: data.pageSize,
                    search: data.search,
                    order: data.order,
                    sort: data.sort,
                }
    
                init(params)
            }
        }
    }

    const teacherUserInteraction = (data) => {
        if (data.search) {
            setTableState(data)
            secureLocalStorage.setItem(teacherTableIndex, data)

            let params = {
                group: location?.state?.id,
                type: selectedTab,
                school: data.school,
                page: state.search == data.search ? data.page : 1,
                pageSize: data.pageSize,
                search: data.search,
                order: data.order,
                sort: data.sort,
            }

            init(params)
        } else {
            if(data.page){
                setTableState(data)
                secureLocalStorage.setItem(teacherTableIndex, data)
    
                let params = {
                    group: location?.state?.id,
                    type: selectedTab,
                    school: data.school,
                    page: data.page,
                    pageSize: data.pageSize,
                    search: data.search,
                    order: data.order,
                    sort: data.sort,
                }
    
                init(params)
            }
        }
    }

    return (
        <>
            <div className="layoutless-page">
                <div className="header">
                    <div>
                        {groupData?.name || ''}
                    </div>
                    <span>
                        <button type='button' className='cancel-button btn btn-link' onClick={onBackHandler}>
                            {t('common.back_to_list')}
                        </button>
                    </span>
                </div>

                <div className="d-flex flex-row w-100 p-5 flex-wrap">
                    <div className="d-flex flex-column flex-grow-1">
                        <div className="icon-16 text-end" style={{color: 'black'}}>Төлөв</div>
                        <div className="icon-16 text-end" style={{color: 'black'}}>{t('exam.level')}</div>
                        <div className="icon-16 text-end" style={{color: 'black'}}>Судлагдахуун</div>
                        <div className="icon-16 text-end" style={{color: 'black'}}>Нэгдсэн группийн нэр</div>
                        <div className="icon-16 text-end" style={{color: 'black'}}>Сурагчид</div>
                    </div>
                    <div
                        className="d-flex ml-4 flex-column flex-grow-1"
                        style={{ marginTop: 2 }}
                    >
                        <div className={`tag fixed-width ${groupData?.isActive && "active"}`}>
                            {groupData?.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                        </div>
                        <div className="icon-16 text-primary font-bold">{groupData?.gradeName}</div>
                        <div className="icon-16 text-primary font-bold">{groupData?.subjectName}</div>
                        <div className="icon-16 text-primary font-bold">
                            {groupData?.name || ''}
                        </div>
                        <div className="icon-16 text-primary font-bold">{groupData?.totalStudentNumber || 0}</div>
                    </div>
                    <button onClick={onEditButtonHandler} type='button' className="edit-button cursor-pointer">
                        <CsLineIcons icon="edit-square" className="mr-2" />
                        ЗАСАХ
                    </button>
                </div>

                <TabComponent
                    tabs={[
                        {
                            code: 'students',
                            title: "Сурагчид",
                            children: <StudentsTab
                                groupId={location?.state?.id}
                                treeData={treeData}
                                changeTreeData={studentChangeTreeData}
                                tableData={studentTableData}
                                totalCount={totalCount}
                                changeTableData={studentChangeTableData}
                                tableState={studentTableState}
                                setTableState={studentInteraction}
                                setTotalCount={(value) => setTotalCount(value)}
                                setGroupData={(value) => setGroupData(value)}
                            />
                        },
                        {
                            code: 'teachers',
                            title: "Багш, ажилтан",
                            children: <TeachersTab
                                groupId={location?.state?.id}
                                treeData={treeData}
                                changeTreeData={teacherChangeTreeData}
                                tableData={teacherTableData}
                                totalCount={totalCount}
                                changeTableData={teacherChangeTableData}
                                tableState={tableState}
                                setTableState={teacherUserInteraction}
                                setTotalCount={(value) => setTotalCount(value)}
                            />,
                        },
                    ]}
                    onChange={onTabChange}
                />
                {
                    showEditModal &&
                    <GroupEditModal
                        show={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        onSubmit={onEditSubmit}
                        curriculums={curriculums}
                        grades={grades}
                        subjects={subjects}
                        schools={schools}
                        groupData={groupData}
                    />
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
            </div>
        </>
    );
};

export default GroupDetails;
