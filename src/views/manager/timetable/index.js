import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { translations } from 'utils/translations'
import TimeTable from './TimeTable'
import AddTimeTable from './AddTimeTable'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useTranslation } from 'react-i18next'
import { Row, Col } from 'react-bootstrap'
// import {
//     fetchClubTimetable as fetch,
//     fetchClubTimetableOptions as fetchOptions
// } from 'Actions/action'
import secureLocalStorage from 'react-secure-storage'

const ClubTimeTable = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation()

    const lang = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const title = t('timetable.club_title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "manager/timetable", text: title }
    ];

    const loading = useSelector(state => state.clubTimetable?.loading || false) 
    const success = useSelector(state => state.clubTimetable?.success || false)
    const records = useSelector(state => state.clubTimetable?.data?.timetableList || {
        "518": [
            {
                "id": 53918,
                "subject": "Англи хэл ",
                "clubs": [
                    {
                        "2": [
                            {
                                "time": "08:00-08:40",
                                "room": null
                            }
                        ],
                        "id": 88339,
                        "groupId": 88339,
                        "groupName": "English Club ",
                        "groupType": "Дугуйлан",
                        "subjectId": 53918,
                        "subjectName": "Англи хэл ",
                        "subjectCode": "АХЛ0804",
                        "teacherFirstName": "Otgontsetseg",
                        "teacherLastName": "eSchool",
                        "teacherAvatar": null,
                        "teacherId": 11383,
                        "classIds": [
                            "5300"
                        ],
                        "classList": [
                            {
                                "id": "5300",
                                "className": "8А"
                            }
                        ],
                        "classes": "8А",
                        "studentCount": 0,
                        "isAll": false,
                        "pdfExported": false,
                        "seasonId": "518"
                    }
                ]
            },
            {
                "id": 64173,
                "subject": "English 0801",
                "clubs": [
                    {
                        "id": 140791,
                        "groupId": 140791,
                        "groupName": "а",
                        "groupType": "Дугуйлан",
                        "subjectId": 64173,
                        "subjectName": "English 0801",
                        "subjectCode": "EN0801",
                        "teacherFirstName": "Цэрэнсодном",
                        "teacherLastName": "Бямбадорж",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/65c37b2f0e0d2.jpeg",
                        "teacherId": 11163,
                        "classIds": [
                            "5299"
                        ],
                        "classList": [
                            {
                                "id": "5299",
                                "className": "7А"
                            }
                        ],
                        "classes": "7А",
                        "studentCount": 3,
                        "isAll": false,
                        "pdfExported": false
                    },
                    {
                        "id": 168071,
                        "groupId": 168071,
                        "groupName": "12",
                        "groupType": "Дугуйлан",
                        "subjectId": 64173,
                        "subjectName": "English 0801",
                        "subjectCode": "EN0801",
                        "teacherFirstName": "Цэрэнсодном",
                        "teacherLastName": "Бямбадорж",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663992ac17946.png",
                        "teacherId": 11163,
                        "classIds": [],
                        "classList": [],
                        "classes": "",
                        "studentCount": 0,
                        "isAll": true,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 65771,
                "subject": "Football",
                "clubs": [
                    {
                        "id": 147232,
                        "groupId": 147232,
                        "groupName": "Football",
                        "groupType": "Дугуйлан",
                        "subjectId": 65771,
                        "subjectName": "Football",
                        "subjectCode": "FBL1203",
                        "teacherFirstName": "eschool",
                        "teacherLastName": "Мөнх-Эрдэнэ",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/650ae14aaa237.png",
                        "teacherId": 13540,
                        "classIds": [
                            "11753"
                        ],
                        "classList": [
                            {
                                "id": "11753",
                                "className": "12Б Тони"
                            }
                        ],
                        "classes": "12Б Тони",
                        "studentCount": 1,
                        "isAll": false,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 71248,
                "subject": "japanese",
                "clubs": [
                    {
                        "id": 168106,
                        "groupId": 168106,
                        "groupName": "edf",
                        "groupType": "Дугуйлан",
                        "subjectId": 71248,
                        "subjectName": "japanese",
                        "subjectCode": "jpn08",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "11715"
                        ],
                        "classList": [
                            {
                                "id": "11715",
                                "className": "h"
                            }
                        ],
                        "classes": "h",
                        "studentCount": 1,
                        "isAll": false,
                        "pdfExported": true
                    }
                ]
            }
        ],
        "520": [
            {
                "id": 53918,
                "subject": "Англи хэл ",
                "clubs": [
                    {
                        "2": [
                            {
                                "time": "00:00-00:00",
                                "room": null
                            }
                        ],
                        "id": 88339,
                        "groupId": 88339,
                        "groupName": "English Club ",
                        "groupType": "Дугуйлан",
                        "subjectId": 53918,
                        "subjectName": "Англи хэл ",
                        "subjectCode": "АХЛ0804",
                        "teacherFirstName": "Otgontsetseg",
                        "teacherLastName": "eSchool",
                        "teacherAvatar": null,
                        "teacherId": 11383,
                        "classIds": [
                            "5300"
                        ],
                        "classList": [
                            {
                                "id": "5300",
                                "className": "8А"
                            }
                        ],
                        "classes": "8А",
                        "studentCount": 0,
                        "isAll": false,
                        "pdfExported": false,
                        "seasonId": "520"
                    }
                ]
            },
            {
                "id": 64173,
                "subject": "English 0801",
                "clubs": [
                    {
                        "id": 140791,
                        "groupId": 140791,
                        "groupName": "а",
                        "groupType": "Дугуйлан",
                        "subjectId": 64173,
                        "subjectName": "English 0801",
                        "subjectCode": "EN0801",
                        "teacherFirstName": "Цэрэнсодном",
                        "teacherLastName": "Бямбадорж",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/65c37b2f0e0d2.jpeg",
                        "teacherId": 11163,
                        "classIds": [
                            "5299"
                        ],
                        "classList": [
                            {
                                "id": "5299",
                                "className": "7А"
                            }
                        ],
                        "classes": "7А",
                        "studentCount": 3,
                        "isAll": false,
                        "pdfExported": false
                    },
                    {
                        "id": 168071,
                        "groupId": 168071,
                        "groupName": "12",
                        "groupType": "Дугуйлан",
                        "subjectId": 64173,
                        "subjectName": "English 0801",
                        "subjectCode": "EN0801",
                        "teacherFirstName": "Цэрэнсодном",
                        "teacherLastName": "Бямбадорж",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663992ac17946.png",
                        "teacherId": 11163,
                        "classIds": [],
                        "classList": [],
                        "classes": "",
                        "studentCount": 0,
                        "isAll": true,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 65771,
                "subject": "Football",
                "clubs": [
                    {
                        "id": 147232,
                        "groupId": 147232,
                        "groupName": "Football",
                        "groupType": "Дугуйлан",
                        "subjectId": 65771,
                        "subjectName": "Football",
                        "subjectCode": "FBL1203",
                        "teacherFirstName": "eschool",
                        "teacherLastName": "Мөнх-Эрдэнэ",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/650ae14aaa237.png",
                        "teacherId": 13540,
                        "classIds": [
                            "11753"
                        ],
                        "classList": [
                            {
                                "id": "11753",
                                "className": "12Б Тони"
                            }
                        ],
                        "classes": "12Б Тони",
                        "studentCount": 1,
                        "isAll": false,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 67067,
                "subject": "ah",
                "clubs": [
                    {
                        "id": 152766,
                        "groupId": 152766,
                        "groupName": "ah",
                        "groupType": "Дугуйлан",
                        "subjectId": 67067,
                        "subjectName": "ah",
                        "subjectCode": "ah1404",
                        "teacherFirstName": "carter",
                        "teacherLastName": "john",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/main/65f91cf66c451.png",
                        "teacherId": 14537,
                        "classIds": [
                            "10255"
                        ],
                        "classList": [
                            {
                                "id": "10255",
                                "className": "10А"
                            }
                        ],
                        "classes": "10А",
                        "studentCount": 9,
                        "isAll": false,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 71248,
                "subject": "japanese",
                "clubs": [
                    {
                        "id": 168106,
                        "groupId": 168106,
                        "groupName": "edf",
                        "groupType": "Дугуйлан",
                        "subjectId": 71248,
                        "subjectName": "japanese",
                        "subjectCode": "jpn08",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "11715"
                        ],
                        "classList": [
                            {
                                "id": "11715",
                                "className": "h"
                            }
                        ],
                        "classes": "h",
                        "studentCount": 1,
                        "isAll": false,
                        "pdfExported": true
                    }
                ]
            }
        ],
        "1138": [
            {
                "id": 27997,
                "subject": "Бүжгийн дугуйлан",
                "clubs": [
                    {
                        "3": [
                            {
                                "time": "08:00-08:40",
                                "room": null
                            }
                        ],
                        "id": 64125,
                        "groupId": 64125,
                        "groupName": "Бүжгийн дугуйлан 8",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Admin",
                        "teacherLastName": "eSchool",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6629c48a99218.png",
                        "teacherId": 474,
                        "classIds": [
                            "5300"
                        ],
                        "classList": [
                            {
                                "id": "5300",
                                "className": "8А"
                            }
                        ],
                        "classes": "8А",
                        "studentCount": 2,
                        "isAll": false,
                        "pdfExported": false,
                        "seasonId": "1138"
                    },
                    {
                        "id": 64165,
                        "groupId": 64165,
                        "groupName": "тест",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5296",
                            "5301"
                        ],
                        "classList": [
                            {
                                "id": "5296",
                                "className": "2В"
                            },
                            {
                                "id": "5301",
                                "className": "7Б"
                            }
                        ],
                        "classes": "2В, 7Б",
                        "studentCount": 6,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 64298,
                        "groupId": 64298,
                        "groupName": "TEST",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5293",
                            "5301"
                        ],
                        "classList": [
                            {
                                "id": "5293",
                                "className": "2A"
                            },
                            {
                                "id": "5301",
                                "className": "7Б"
                            }
                        ],
                        "classes": "2A, 7Б",
                        "studentCount": 22,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 67110,
                        "groupId": 67110,
                        "groupName": "эн",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5293",
                            "5301"
                        ],
                        "classList": [
                            {
                                "id": "5293",
                                "className": "2A"
                            },
                            {
                                "id": "5301",
                                "className": "7Б"
                            }
                        ],
                        "classes": "2A, 7Б",
                        "studentCount": 3,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 71872,
                        "groupId": 71872,
                        "groupName": "t12",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5293"
                        ],
                        "classList": [
                            {
                                "id": "5293",
                                "className": "2A"
                            }
                        ],
                        "classes": "2A",
                        "studentCount": 2,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 84436,
                        "groupId": 84436,
                        "groupName": "Монгол бүжгийн дугуйлан ",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5300",
                            "9947"
                        ],
                        "classList": [
                            {
                                "id": "5300",
                                "className": "8А"
                            },
                            {
                                "id": "9947",
                                "className": "8Б"
                            }
                        ],
                        "classes": "8А, 8Б",
                        "studentCount": 3,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 125730,
                        "groupId": 125730,
                        "groupName": "рөбахиуэху",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5296",
                            "9947"
                        ],
                        "classList": [
                            {
                                "id": "5296",
                                "className": "2В"
                            },
                            {
                                "id": "9947",
                                "className": "8Б"
                            }
                        ],
                        "classes": "2В, 8Б",
                        "studentCount": 6,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 146151,
                        "groupId": 146151,
                        "groupName": "Test0205",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Admin",
                        "teacherLastName": "eSchool",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6629c48a99218.png",
                        "teacherId": 474,
                        "classIds": [
                            "10255",
                            "5301"
                        ],
                        "classList": [
                            {
                                "id": "10255",
                                "className": "10А"
                            },
                            {
                                "id": "5301",
                                "className": "7Б"
                            }
                        ],
                        "classes": "10А, 7Б",
                        "studentCount": 45,
                        "isAll": false,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 50240,
                "subject": "test duguilan",
                "clubs": [
                    {
                        "id": 71874,
                        "groupId": 71874,
                        "groupName": "Математикч ",
                        "groupType": "Дугуйлан",
                        "subjectId": 50240,
                        "subjectName": "test duguilan",
                        "subjectCode": "test02",
                        "teacherFirstName": "Elbegzaya",
                        "teacherLastName": "eSchool",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/664d6b92c106d.png",
                        "teacherId": 9634,
                        "classIds": [
                            "5303",
                            "5299",
                            "5300"
                        ],
                        "classList": [
                            {
                                "id": "5303",
                                "className": "1В"
                            },
                            {
                                "id": "5299",
                                "className": "7А"
                            },
                            {
                                "id": "5300",
                                "className": "8А"
                            }
                        ],
                        "classes": "1В, 7А, 8А",
                        "studentCount": 3,
                        "isAll": false,
                        "pdfExported": false
                    },
                    {
                        "id": 112947,
                        "groupId": 112947,
                        "groupName": "test",
                        "groupType": "Дугуйлан",
                        "subjectId": 50240,
                        "subjectName": "test duguilan",
                        "subjectCode": "test02",
                        "teacherFirstName": "Baatar",
                        "teacherLastName": "Bayarbat",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6323efca71f87.png",
                        "teacherId": 1587,
                        "classIds": [
                            "5300"
                        ],
                        "classList": [
                            {
                                "id": "5300",
                                "className": "8А"
                            }
                        ],
                        "classes": "8А",
                        "studentCount": 18,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 114293,
                        "groupId": 114293,
                        "groupName": "tEST",
                        "groupType": "Дугуйлан",
                        "subjectId": 50240,
                        "subjectName": "test duguilan",
                        "subjectCode": "test02",
                        "teacherFirstName": "Baatar",
                        "teacherLastName": "Bayarbat",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6323efca71f87.png",
                        "teacherId": 1587,
                        "classIds": [
                            "5295"
                        ],
                        "classList": [
                            {
                                "id": "5295",
                                "className": "3А"
                            }
                        ],
                        "classes": "3А",
                        "studentCount": 11,
                        "isAll": false,
                        "pdfExported": true
                    }
                ]
            },
            {
                "id": 53918,
                "subject": "Англи хэл ",
                "clubs": [
                    {
                        "id": 88339,
                        "groupId": 88339,
                        "groupName": "English Club ",
                        "groupType": "Дугуйлан",
                        "subjectId": 53918,
                        "subjectName": "Англи хэл ",
                        "subjectCode": "АХЛ0804",
                        "teacherFirstName": "Otgontsetseg",
                        "teacherLastName": "eSchool",
                        "teacherAvatar": null,
                        "teacherId": 11383,
                        "classIds": [
                            "5300"
                        ],
                        "classList": [
                            {
                                "id": "5300",
                                "className": "8А"
                            }
                        ],
                        "classes": "8А",
                        "studentCount": 0,
                        "isAll": false,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 64173,
                "subject": "English 0801",
                "clubs": [
                    {
                        "id": 140791,
                        "groupId": 140791,
                        "groupName": "а",
                        "groupType": "Дугуйлан",
                        "subjectId": 64173,
                        "subjectName": "English 0801",
                        "subjectCode": "EN0801",
                        "teacherFirstName": "Цэрэнсодном",
                        "teacherLastName": "Бямбадорж",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/65c37b2f0e0d2.jpeg",
                        "teacherId": 11163,
                        "classIds": [
                            "5299"
                        ],
                        "classList": [
                            {
                                "id": "5299",
                                "className": "7А"
                            }
                        ],
                        "classes": "7А",
                        "studentCount": 3,
                        "isAll": false,
                        "pdfExported": false
                    },
                    {
                        "id": 168071,
                        "groupId": 168071,
                        "groupName": "12",
                        "groupType": "Дугуйлан",
                        "subjectId": 64173,
                        "subjectName": "English 0801",
                        "subjectCode": "EN0801",
                        "teacherFirstName": "Цэрэнсодном",
                        "teacherLastName": "Бямбадорж",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663992ac17946.png",
                        "teacherId": 11163,
                        "classIds": [],
                        "classList": [],
                        "classes": "",
                        "studentCount": 0,
                        "isAll": true,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 65771,
                "subject": "Football",
                "clubs": [
                    {
                        "id": 147232,
                        "groupId": 147232,
                        "groupName": "Football",
                        "groupType": "Дугуйлан",
                        "subjectId": 65771,
                        "subjectName": "Football",
                        "subjectCode": "FBL1203",
                        "teacherFirstName": "eschool",
                        "teacherLastName": "Мөнх-Эрдэнэ",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/650ae14aaa237.png",
                        "teacherId": 13540,
                        "classIds": [
                            "11753"
                        ],
                        "classList": [
                            {
                                "id": "11753",
                                "className": "12Б Тони"
                            }
                        ],
                        "classes": "12Б Тони",
                        "studentCount": 1,
                        "isAll": false,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 67067,
                "subject": "ah",
                "clubs": [
                    {
                        "3": [
                            {
                                "time": "17:00-19:00",
                                "room": ""
                            }
                        ],
                        "id": 152766,
                        "groupId": 152766,
                        "groupName": "ah",
                        "groupType": "Дугуйлан",
                        "subjectId": 67067,
                        "subjectName": "ah",
                        "subjectCode": "ah1404",
                        "teacherFirstName": "carter",
                        "teacherLastName": "john",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/main/65f91cf66c451.png",
                        "teacherId": 14537,
                        "classIds": [
                            "10255"
                        ],
                        "classList": [
                            {
                                "id": "10255",
                                "className": "10А"
                            }
                        ],
                        "classes": "10А",
                        "studentCount": 9,
                        "isAll": false,
                        "pdfExported": false,
                        "seasonId": "1138"
                    }
                ]
            },
            {
                "id": 71248,
                "subject": "japanese",
                "clubs": [
                    {
                        "id": 168106,
                        "groupId": 168106,
                        "groupName": "edf",
                        "groupType": "Дугуйлан",
                        "subjectId": 71248,
                        "subjectName": "japanese",
                        "subjectCode": "jpn08",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "11715"
                        ],
                        "classList": [
                            {
                                "id": "11715",
                                "className": "h"
                            }
                        ],
                        "classes": "h",
                        "studentCount": 1,
                        "isAll": false,
                        "pdfExported": true
                    }
                ]
            }
        ],
        "1176": [
            {
                "id": 27997,
                "subject": "Бүжгийн дугуйлан",
                "clubs": [
                    {
                        "3": [
                            {
                                "time": "08:00-08:40",
                                "room": null
                            }
                        ],
                        "id": 64125,
                        "groupId": 64125,
                        "groupName": "Бүжгийн дугуйлан 8",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Admin",
                        "teacherLastName": "eSchool",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6629c48a99218.png",
                        "teacherId": 474,
                        "classIds": [
                            "5300"
                        ],
                        "classList": [
                            {
                                "id": "5300",
                                "className": "8А"
                            }
                        ],
                        "classes": "8А",
                        "studentCount": 2,
                        "isAll": false,
                        "pdfExported": false,
                        "seasonId": "1176"
                    },
                    {
                        "id": 64165,
                        "groupId": 64165,
                        "groupName": "тест",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5296",
                            "5301"
                        ],
                        "classList": [
                            {
                                "id": "5296",
                                "className": "2В"
                            },
                            {
                                "id": "5301",
                                "className": "7Б"
                            }
                        ],
                        "classes": "2В, 7Б",
                        "studentCount": 6,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 64298,
                        "groupId": 64298,
                        "groupName": "TEST",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5293",
                            "5301"
                        ],
                        "classList": [
                            {
                                "id": "5293",
                                "className": "2A"
                            },
                            {
                                "id": "5301",
                                "className": "7Б"
                            }
                        ],
                        "classes": "2A, 7Б",
                        "studentCount": 22,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 67110,
                        "groupId": 67110,
                        "groupName": "эн",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5293",
                            "5301"
                        ],
                        "classList": [
                            {
                                "id": "5293",
                                "className": "2A"
                            },
                            {
                                "id": "5301",
                                "className": "7Б"
                            }
                        ],
                        "classes": "2A, 7Б",
                        "studentCount": 3,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 71872,
                        "groupId": 71872,
                        "groupName": "t12",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5293"
                        ],
                        "classList": [
                            {
                                "id": "5293",
                                "className": "2A"
                            }
                        ],
                        "classes": "2A",
                        "studentCount": 2,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 84436,
                        "groupId": 84436,
                        "groupName": "Монгол бүжгийн дугуйлан ",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5300",
                            "9947"
                        ],
                        "classList": [
                            {
                                "id": "5300",
                                "className": "8А"
                            },
                            {
                                "id": "9947",
                                "className": "8Б"
                            }
                        ],
                        "classes": "8А, 8Б",
                        "studentCount": 3,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 125730,
                        "groupId": 125730,
                        "groupName": "рөбахиуэху",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "5296",
                            "9947"
                        ],
                        "classList": [
                            {
                                "id": "5296",
                                "className": "2В"
                            },
                            {
                                "id": "9947",
                                "className": "8Б"
                            }
                        ],
                        "classes": "2В, 8Б",
                        "studentCount": 6,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 146151,
                        "groupId": 146151,
                        "groupName": "Test0205",
                        "groupType": "Дугуйлан",
                        "subjectId": 27997,
                        "subjectName": "Бүжгийн дугуйлан",
                        "subjectCode": "DNC0801",
                        "teacherFirstName": "Admin",
                        "teacherLastName": "eSchool",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6629c48a99218.png",
                        "teacherId": 474,
                        "classIds": [
                            "10255",
                            "5301"
                        ],
                        "classList": [
                            {
                                "id": "10255",
                                "className": "10А"
                            },
                            {
                                "id": "5301",
                                "className": "7Б"
                            }
                        ],
                        "classes": "10А, 7Б",
                        "studentCount": 45,
                        "isAll": false,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 50240,
                "subject": "test duguilan",
                "clubs": [
                    {
                        "id": 71874,
                        "groupId": 71874,
                        "groupName": "Математикч ",
                        "groupType": "Дугуйлан",
                        "subjectId": 50240,
                        "subjectName": "test duguilan",
                        "subjectCode": "test02",
                        "teacherFirstName": "Elbegzaya",
                        "teacherLastName": "eSchool",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/664d6b92c106d.png",
                        "teacherId": 9634,
                        "classIds": [
                            "5303",
                            "5299",
                            "5300"
                        ],
                        "classList": [
                            {
                                "id": "5303",
                                "className": "1В"
                            },
                            {
                                "id": "5299",
                                "className": "7А"
                            },
                            {
                                "id": "5300",
                                "className": "8А"
                            }
                        ],
                        "classes": "1В, 7А, 8А",
                        "studentCount": 3,
                        "isAll": false,
                        "pdfExported": false
                    },
                    {
                        "id": 112947,
                        "groupId": 112947,
                        "groupName": "test",
                        "groupType": "Дугуйлан",
                        "subjectId": 50240,
                        "subjectName": "test duguilan",
                        "subjectCode": "test02",
                        "teacherFirstName": "Baatar",
                        "teacherLastName": "Bayarbat",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6323efca71f87.png",
                        "teacherId": 1587,
                        "classIds": [
                            "5300"
                        ],
                        "classList": [
                            {
                                "id": "5300",
                                "className": "8А"
                            }
                        ],
                        "classes": "8А",
                        "studentCount": 18,
                        "isAll": false,
                        "pdfExported": true
                    },
                    {
                        "id": 114293,
                        "groupId": 114293,
                        "groupName": "tEST",
                        "groupType": "Дугуйлан",
                        "subjectId": 50240,
                        "subjectName": "test duguilan",
                        "subjectCode": "test02",
                        "teacherFirstName": "Baatar",
                        "teacherLastName": "Bayarbat",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6323efca71f87.png",
                        "teacherId": 1587,
                        "classIds": [
                            "5295"
                        ],
                        "classList": [
                            {
                                "id": "5295",
                                "className": "3А"
                            }
                        ],
                        "classes": "3А",
                        "studentCount": 11,
                        "isAll": false,
                        "pdfExported": true
                    }
                ]
            },
            {
                "id": 53918,
                "subject": "Англи хэл ",
                "clubs": [
                    {
                        "id": 88339,
                        "groupId": 88339,
                        "groupName": "English Club ",
                        "groupType": "Дугуйлан",
                        "subjectId": 53918,
                        "subjectName": "Англи хэл ",
                        "subjectCode": "АХЛ0804",
                        "teacherFirstName": "Otgontsetseg",
                        "teacherLastName": "eSchool",
                        "teacherAvatar": null,
                        "teacherId": 11383,
                        "classIds": [
                            "5300"
                        ],
                        "classList": [
                            {
                                "id": "5300",
                                "className": "8А"
                            }
                        ],
                        "classes": "8А",
                        "studentCount": 0,
                        "isAll": false,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 64173,
                "subject": "English 0801",
                "clubs": [
                    {
                        "id": 140791,
                        "groupId": 140791,
                        "groupName": "а",
                        "groupType": "Дугуйлан",
                        "subjectId": 64173,
                        "subjectName": "English 0801",
                        "subjectCode": "EN0801",
                        "teacherFirstName": "Цэрэнсодном",
                        "teacherLastName": "Бямбадорж",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/65c37b2f0e0d2.jpeg",
                        "teacherId": 11163,
                        "classIds": [
                            "5299"
                        ],
                        "classList": [
                            {
                                "id": "5299",
                                "className": "7А"
                            }
                        ],
                        "classes": "7А",
                        "studentCount": 3,
                        "isAll": false,
                        "pdfExported": false
                    },
                    {
                        "id": 168071,
                        "groupId": 168071,
                        "groupName": "12",
                        "groupType": "Дугуйлан",
                        "subjectId": 64173,
                        "subjectName": "English 0801",
                        "subjectCode": "EN0801",
                        "teacherFirstName": "Цэрэнсодном",
                        "teacherLastName": "Бямбадорж",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663992ac17946.png",
                        "teacherId": 11163,
                        "classIds": [],
                        "classList": [],
                        "classes": "",
                        "studentCount": 0,
                        "isAll": true,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 65771,
                "subject": "Football",
                "clubs": [
                    {
                        "id": 147232,
                        "groupId": 147232,
                        "groupName": "Football",
                        "groupType": "Дугуйлан",
                        "subjectId": 65771,
                        "subjectName": "Football",
                        "subjectCode": "FBL1203",
                        "teacherFirstName": "eschool",
                        "teacherLastName": "Мөнх-Эрдэнэ",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/650ae14aaa237.png",
                        "teacherId": 13540,
                        "classIds": [
                            "11753"
                        ],
                        "classList": [
                            {
                                "id": "11753",
                                "className": "12Б Тони"
                            }
                        ],
                        "classes": "12Б Тони",
                        "studentCount": 1,
                        "isAll": false,
                        "pdfExported": false
                    }
                ]
            },
            {
                "id": 67067,
                "subject": "ah",
                "clubs": [
                    {
                        "3": [
                            {
                                "time": "17:00-19:00",
                                "room": null
                            }
                        ],
                        "id": 152766,
                        "groupId": 152766,
                        "groupName": "ah",
                        "groupType": "Дугуйлан",
                        "subjectId": 67067,
                        "subjectName": "ah",
                        "subjectCode": "ah1404",
                        "teacherFirstName": "carter",
                        "teacherLastName": "john",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/main/65f91cf66c451.png",
                        "teacherId": 14537,
                        "classIds": [
                            "10255"
                        ],
                        "classList": [
                            {
                                "id": "10255",
                                "className": "10А"
                            }
                        ],
                        "classes": "10А",
                        "studentCount": 9,
                        "isAll": false,
                        "pdfExported": false,
                        "seasonId": "1176"
                    }
                ]
            },
            {
                "id": 71248,
                "subject": "japanese",
                "clubs": [
                    {
                        "id": 168106,
                        "groupId": 168106,
                        "groupName": "edf",
                        "groupType": "Дугуйлан",
                        "subjectId": 71248,
                        "subjectName": "japanese",
                        "subjectCode": "jpn08",
                        "teacherFirstName": "Enkhdelger",
                        "teacherLastName": "Ankhbayar",
                        "teacherAvatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                        "teacherId": 6702,
                        "classIds": [
                            "11715"
                        ],
                        "classList": [
                            {
                                "id": "11715",
                                "className": "h"
                            }
                        ],
                        "classes": "h",
                        "studentCount": 1,
                        "isAll": false,
                        "pdfExported": true
                    }
                ]
            }
        ]
    })
    const seasons = useSelector(state => state.clubTimetable?.data?.seasonList || [
        {
            "code": "01",
            "startDate": "2023-08-01",
            "endDate": "2023-11-03",
            "isCurrent": false,
            "key": "518",
            "text": "1-р улирал"
        },
        {
            "code": "02",
            "startDate": "2023-11-09",
            "endDate": "2024-01-28",
            "isCurrent": false,
            "key": "520",
            "text": "2-р улирал"
        },
        {
            "code": "03",
            "startDate": "2024-01-29",
            "endDate": "2024-04-07",
            "isCurrent": false,
            "key": "1138",
            "text": "3-р улирал"
        },
        {
            "code": "04",
            "startDate": "2024-04-08",
            "endDate": "2024-07-14",
            "isCurrent": true,
            "key": "1176",
            "text": "4-р улирал"
        }
    ])
    const hasCustomDateAttendance = useSelector(state => state.clubTimetable?.data?.customDateAttendance || false)
    const currentSeason = seasons?.find(el => el?.isCurrent == true)?.key

    const opLoading = useSelector(state => state.clubTimetableOptions?.loading || false)
    const opSuccess = useSelector(state => state.clubTimetableOptions?.success || false)
    const schoolShifts = useSelector(state => state.clubTimetableOptions?.data?.schoolShiftList || [])
    const timeTemplates = useSelector(state => state.clubTimetableOptions?.data?.timeTemplateList || [])
    const groups = useSelector(state => state.clubTimetableOptions?.data?.groupList || [])
    const clubData = useSelector(state => state.clubTimetableOptions?.data?.groupData || null)
    const [showAddTimetable, setShowAddTimetable] = useState(false)

    const [tabKey, setTabKey] = useState('main')
    const [group, setGroup] = useState(null)
    const [selectedSeason, setSelectedSeason] = useState(currentSeason)

    useEffect(() => {
        setSelectedSeason(currentSeason)
    }, [currentSeason])

    // useEffect(() => {
    //     if (tabKey === 'main' || seasons.find(obj => obj.key?.toString() === tabKey?.toString())) {
    //         dispatch(fetch())
    //     } else {
    //         const params = {
    //             group
    //         }
    //         dispatch(fetchOptions(params))
    //     }
    // }, [tabKey])

    const onSeasonChange = (seasonId = null) => {
        setSelectedSeason(seasonId)
    }

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            {/* <SubHeader
                locale={lang}
                title={translations(lang).timetable?.club_title}
            /> */}

            <HtmlHead title={title} description={description} />
            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            <div className='m-content'>
                <TimeTable customDateAttendance={hasCustomDateAttendance} records={records} onSeasonChange={onSeasonChange} currentSeason={selectedSeason || currentSeason} seasons={seasons} setGroup={setGroup} lang={lang} toAdd={() => { setShowAddTimetable(true) }} />
                {/* {
                    (tabKey === 'main' || seasons.find(obj => obj.key?.toString() === tabKey?.toString()))
                        ?
                        <TimeTable customDateAttendance={hasCustomDateAttendance} records={records} onSeasonChange={onSeasonChange} currentSeason={selectedSeason || currentSeason} seasons={seasons} setGroup={setGroup} lang={lang} toAdd={() => { setTabKey('add') }} />
                        : <AddTimeTable
                            customDateAttendance={hasCustomDateAttendance}
                            lang={lang}
                            clubData={clubData}
                            clubs={groups}
                            season={selectedSeason}
                            schoolShifts={schoolShifts}
                            timeTemplates={timeTemplates}
                            toMain={(key) => {
                                setTabKey(key || 'main');
                                setGroup(null)
                            }}
                        />
                } */}
                {
                    loading || opLoading
                        ?
                        <div>
                            <div className="blockUI blockOverlay" />
                            <div className="blockUI blockMsg blockPage">
                                <div className="m-loader m-loader--brand m-loader--lg" />
                            </div>
                        </div>
                        : null
                }
                {
                    showAddTimetable &&
                    <AddTimeTable
                        customDateAttendance={hasCustomDateAttendance}
                        onClose={()=> setShowAddTimetable(false)}
                        lang={lang}
                        clubData={clubData}
                        clubs={groups}
                        season={selectedSeason}
                        schoolShifts={schoolShifts}
                        timeTemplates={timeTemplates}
                        toMain={(key) => {
                            setTabKey(key || 'main');
                            setGroup(null)
                        }}
                    />
                }
            </div>
        </div>
    )
}

export default ClubTimeTable
