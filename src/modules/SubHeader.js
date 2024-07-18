import { Link } from 'react-router-dom'
import React from 'react';
import { useTranslation } from "react-i18next";
/*expected props {
        locale={'mn'},                          string
        links=[{                                array of objects
            to: '/',                            string url
            name: 'Сурагчдын жагсаалт'          string text
        }]
        title={'Сургуулийн тохиргоо'}           string
    }*/

// useNavigate || link

const SubHeader = ({ locale = 'mn', links, title, secondaryTitle, additional = null }) => {
    return (
        <div className="m-subheader ">
            <div className="d-flex align-items-center">
                <div className="mr-auto">
                    <h3 className="m-subheader__title m-subheader__title--separator">
                        {title}
                    </h3>
                    <ul className="m-subheader__breadcrumbs m-nav m-nav--inline">
                        <li className="m-nav__item m-nav__item--home">
                            <Link to='/' className='m-nav__link m-nav__link--icon' >
                                <i className="m-nav__link-icon la la-home" />
                            </Link>
                        </li>
                        <li className="m-nav__separator">
                            -&emsp;
                        </li>
                        <li className="m-nav__item">    {/*Эхлэл*/}
                            <Link to='/' className='m-nav__link' >
                                <span
                                    className="m-nav__link-text">
                                    {t('home')}&emsp;
                                </span>
                            </Link>
                        </li>
                        {
                            links && links.length > 0
                                ?
                                links.map((link, index) => {
                                    return ([
                                        <li className="m-nav__separator" key={link.name + index}>
                                            -&emsp;
                                        </li>,
                                        <li className="m-nav__item" key={index}>
                                            <Link to={link.to} className='m-nav__link' >
                                                <span
                                                    className="m-nav__link-text">
                                                    {link.name}&emsp;
                                                </span>

                                            </Link>
                                        </li>,
                                    ])
                                })
                                :
                                null
                        }
                        <li className="m-nav__separator">
                            -&emsp;
                        </li>
                        <li className="m-nav__item">
                            <span className="m-nav__link-text">
                                {
                                    secondaryTitle
                                        ?
                                        secondaryTitle
                                        : title
                                }
                            </span>
                        </li>
                    </ul>
                </div>

                {
                    additional || null
                }
            </div>
        </div>
    )
};

export default SubHeader;