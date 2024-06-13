import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LogoutIcon from '@mui/icons-material/Logout';
import { capitalize } from 'utils/utils'

const StudentInfoMenu = () => {
    const history = useHistory();
    const { person } = useSelector(state => state)

    const onHandlerLogout = () => {
        history.push('/logout')
    }

    return (
        <div className="list-unstyled list-inline menu-student-info student-info-mobile-style">
            <div>
                <div className="g-0 sh-10 sh-sm-6 ml-4 row">
                    <div className="col-auto">
                        {
                            person.avatar
                                ?
                                <img src={person.avatar} className="card-img rounded-xl sh-6 sw-6" alt="thumb"/>
                                :
                                <img src="/img/profile/avatar.png" className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
                        }
                    </div>
                    <div className="col">
                        <div className="d-flex flex-column flex-sm-row ps-3 h-100 align-items-sm-center justify-content-sm-between">
                            <div className="d-flex flex-column mb-2 mb-sm-0 text-left">
                                <div className="text-muted">{(person && person.lastName?.substring(0,1).toUpperCase()) + '.' + (person && person.firstName?.toUpperCase())}</div>
                                {
                                    person.isEstudentUser
                                    ?
                                        <></>
                                    :
                                        <div className='d-inline' style={{ fontSize: 12 }}>
                                            <div className="d-inline text-muted">{person && person.className && person.className}</div>
                                            <div className="d-inline text-muted ml-2 mr-2"><FiberManualRecordIcon style={{ fontSize: 10, position: 'relative', bottom: 2 }} /></div>
                                            <div className="d-inline text-muted">{person && person.code && person.code}</div>
                                        </div>
                                }
                            </div>
                            <div className="d-flex student-logout-button-style">
                                <button type="button" className="btn btn-sm" onClick={onHandlerLogout}>
                                    <LogoutIcon style={{ fontSize: 28, position: 'relative', right: 3 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(StudentInfoMenu);
