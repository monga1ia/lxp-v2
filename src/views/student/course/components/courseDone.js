import React, { useState, useEffect } from "react";
import { Row, Image } from "react-bootstrap";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchRequest } from "utils/fetchRequest";
import { onlineLessonIndex } from 'utils/fetchRequest/Urls';
import showMessage from "modules/message";
import "react-h5-audio-player/lib/styles.css";

const StudentCourseDone = () => {
    const { t } = useTranslation();
    const history = useHistory();

    const title = "Үндэсний бичгийн зурлага, эгшиг үсэг";
    const description = "Elearning Portal Course List Page";

    const { selectedSchool } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState(false)

    const init = (params) => {
        setLoading(true)
        fetchRequest(onlineLessonIndex, 'POST', params)
            .then((res) => {

                if (res.success) {
                    const { data } = res
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        let params = {
            school: selectedSchool.id,
        }
        init(params);
    }, []);

    return (
        <>
            <HtmlHead title={title} description={description} />
            <Row>
                <div className="page-title-container">
                    <div className="w-auto">
                        <NavLink
                            to=""
                            className="d-flex body-link stretched-link"
                        >
                            <CsLineIcons
                                icon="arrow-left"
                                className="mr-2"
                                size="20"
                            />
                            <div style={{ fontSize: '16px', fontWeight: '600' }}>{title}</div>
                        </NavLink>
                    </div>
                </div>

                <div className="border-0 pt-0 text-center">
                    <div className="p-2 mx-auto"
                        style={{ color: '#FFC82C', marginTop: '100px', fontSize: '46px', fontWeight: '700' }}
                    >
                        Дууслаа! Сайн байна шүү.
                    </div>
                    <Image src='/img/done.png' />
                    <div
                        onClick={() => history.push("/onlineLesson/groupCourse")}
                        className="rounded-md text-white p-2 mx-auto"
                        style={{ cursor: 'pointer', backgroundColor: '#3C358F', width: '250px', marginTop: '100px' }}
                    >
                        Нүүр хуудас руу буцах
                    </div>
                </div>
            </Row>
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
        </>
    );
};

export default StudentCourseDone;
