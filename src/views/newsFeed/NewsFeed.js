import React, { useEffect, useRef, useState } from 'react'
import { translations } from "utils/translations";
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import NewsfeedTree from "./NewsfeedTree";
import Post from "./Post";
import Item from "./Item";
import { Modal } from "semantic-ui-react";
import { Row, Col } from 'react-bootstrap';
import Compress from 'compress.js'
import secureLocalStorage from 'react-secure-storage'
// import { newsFeedAction, newsFeedComment, newsFeedCommentCreate, newsFeedCommentEdit, newsFeedCommentDelete, newsFeedDelete, newsFeedEdit, newsFeedInit, newsFeedList, newsFeedSubmit, newsFeedView } from 'utils/fetchRequest/Urls';
// import { fetchRequest } from 'utils/fetchRequest';
import { useTranslation } from 'react-i18next';
import ActionModal from './modals/actionModal';
import message from 'modules/message';

const Newsfeed = () => {

    const { t } = useTranslation()

    const title = t('newsfeed.title')
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "newsfeed/index", text: title }
    ];

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn';
    const localeTreeData = 'newsfeed_tree_index';

    const containerLoaded = useRef(false)
    const [loading, setLoading] = useState(false)

    const [treeData, setTreeData] = useState([
        // {
        //     "key": "all",
        //     "title": "Бүгд",
        //     "canPost": false,
        //     "children": [
        //         {
        //             "key": "6",
        //             "title": "Тестийн сургууль",
        //             "canPost": true,
        //             "postRoleCodes": [
        //                 "ROLE_STUDENT",
        //                 "ROLE_ADMIN",
        //                 "ROLE_TEACHER",
        //                 "ROLE_FINANCE",
        //                 "ROLE_MANAGER"
        //             ],
        //             "isAll": true,
        //             "children": []
        //         }
        //     ]
        // }
    ]);
    const [selectedTreeId, setSelectedTreeId] = useState(secureLocalStorage?.getItem(localeTreeData)?.key ? [secureLocalStorage?.getItem(localeTreeData)?.key] : []);

    const [notificationId, setNotificationId] = useState(secureLocalStorage?.getItem('notification_click')?.notification || null);
    const [newsfeeds, setNewsfeeds] = useState(
        [
            {
                "id": 20620,
                "title": null,
                "content": "What is Lorem Ipsum?\r\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\r\n\r\nWhy do we use it?\r\nIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
                "viewCount": 2,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-06-27 17:04:23",
                "createdUserId": 113059,
                "avatar": "https://lxp-cdn.eschool.mn/u/655ac986d2ca3.png",
                "schoolId": 195,
                "roleId": 33,
                "roleName": "Багш",
                "typeId": 2,
                "typeCode": "ANNOUNCEMENT",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Ариунжаргал",
                "lastName": "Бат",
                "isoDate": "2024-06-27 17:04:23",
                "viewed": true,
                "liked": false,
                "isComment": false,
                "update": false,
                "files": [
                    {
                        "id": "26875",
                        "name": "secret-santa.png",
                        "path": "https://lxp-cdn.eschool.mn/nf/667d2b1d6f076.jpg",
                        "size": "46008.00",
                        "type": "image/jpeg",
                        "isImage": true,
                        "isFile": false
                    }
                ],
                "canDelete": true
            },
            {
                "id": 19292,
                "title": null,
                "content": "Тест",
                "viewCount": 7,
                "likeCount": 1,
                "commentCount": 1,
                "createdDate": "2024-05-07",
                "createdUserId": 194694,
                "avatar": "https://lxp-cdn.eschool.mn/u/664c494922af9.png",
                "schoolId": 195,
                "roleId": 33,
                "roleName": "Багш",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Tserensodnom",
                "lastName": "eSchool",
                "isoDate": "2024-05-07 10:59:57",
                "viewed": true,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [],
                "canDelete": true
            },
            {
                "id": 18850,
                "title": null,
                "content": "test \n",
                "viewCount": 8,
                "likeCount": 1,
                "commentCount": 0,
                "createdDate": "2024-04-26",
                "createdUserId": 242306,
                "avatar": "https://lxp-cdn.eschool.mn/u/6634561882dd2.png",
                "schoolId": 195,
                "roleId": null,
                "roleName": "Сурагч",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Аригун",
                "lastName": "Ганбаатар",
                "isoDate": "2024-04-26 11:14:48",
                "viewed": true,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [],
                "canDelete": true
            },
            {
                "id": 18848,
                "title": null,
                "content": "Сайн байна уу. Тест хийж байна.",
                "viewCount": 7,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-04-26",
                "createdUserId": 113059,
                "avatar": "https://lxp-cdn.eschool.mn/u/655ac986d2ca3.png",
                "schoolId": 195,
                "roleId": 1647,
                "roleName": "Сургалтын менежер",
                "typeId": 2,
                "typeCode": "ANNOUNCEMENT",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Ариунжаргал",
                "lastName": "Бат",
                "isoDate": "2024-04-26 11:12:22",
                "viewed": true,
                "liked": false,
                "isComment": false,
                "update": false,
                "files": [
                    {
                        "id": "24615",
                        "name": "458_5f1a42ee431d4.png",
                        "path": "https://lxp-cdn.eschool.mn/nf/662b1b9ce395b.jpg",
                        "size": "28213.00",
                        "type": "image/jpeg",
                        "isImage": true,
                        "isFile": false
                    }
                ],
                "canDelete": true
            },
            {
                "id": 18828,
                "title": null,
                "content": "test again",
                "viewCount": 7,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-04-25",
                "createdUserId": 242306,
                "avatar": "https://lxp-cdn.eschool.mn/u/6634561882dd2.png",
                "schoolId": 195,
                "roleId": null,
                "roleName": "Сурагч",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Аригун",
                "lastName": "Ганбаатар",
                "isoDate": "2024-04-25 14:10:11",
                "viewed": true,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [
                    {
                        "id": "24589",
                        "name": "new_photo20240425.jpeg",
                        "path": "https://lxp-cdn.eschool.mn/nf/6629f3c8f05aa.jpeg",
                        "size": "61714.00",
                        "type": "image/jpeg",
                        "isImage": true,
                        "isFile": false
                    }
                ],
                "canDelete": true
            },
            {
                "id": 18827,
                "title": null,
                "content": "Өдрийн мэнд",
                "viewCount": 5,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-04-25",
                "createdUserId": 242306,
                "avatar": "https://lxp-cdn.eschool.mn/u/6634561882dd2.png",
                "schoolId": 195,
                "roleId": null,
                "roleName": "Сурагч",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Аригун",
                "lastName": "Ганбаатар",
                "isoDate": "2024-04-25 14:09:36",
                "viewed": false,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [],
                "canDelete": true
            },
            {
                "id": 18826,
                "title": null,
                "content": "123\n",
                "viewCount": 4,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-04-25",
                "createdUserId": 242306,
                "avatar": "https://lxp-cdn.eschool.mn/u/6634561882dd2.png",
                "schoolId": 195,
                "roleId": null,
                "roleName": "Сурагч",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Аригун",
                "lastName": "Ганбаатар",
                "isoDate": "2024-04-25 14:08:56",
                "viewed": true,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [],
                "canDelete": true
            },
            {
                "id": 18825,
                "title": null,
                "content": "Өдрийн мэнд \nТест хийж байна.\n",
                "viewCount": 2,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-04-25",
                "createdUserId": 242306,
                "avatar": "https://lxp-cdn.eschool.mn/u/6634561882dd2.png",
                "schoolId": 195,
                "roleId": null,
                "roleName": "Сурагч",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Аригун",
                "lastName": "Ганбаатар",
                "isoDate": "2024-04-25 14:04:48",
                "viewed": false,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [
                    {
                        "id": "24588",
                        "name": "new_photo20240425.jpeg",
                        "path": "https://lxp-cdn.eschool.mn/nf/6629f284efefa.jpeg",
                        "size": "35718.00",
                        "type": "image/jpeg",
                        "isImage": true,
                        "isFile": false
                    }
                ],
                "canDelete": true
            },
            {
                "id": 18753,
                "title": null,
                "content": "Test",
                "viewCount": 7,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-04-23",
                "createdUserId": 1897,
                "avatar": "https://lxp-cdn.eschool.mn/u/6627162b035ac.jpeg",
                "schoolId": 195,
                "roleId": 33,
                "roleName": "Багш",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Ganaa",
                "lastName": "B.",
                "isoDate": "2024-04-23 17:26:59",
                "viewed": false,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [],
                "canDelete": true
            },
            {
                "id": 18591,
                "title": null,
                "content": "Hello: testing",
                "viewCount": 8,
                "likeCount": 0,
                "commentCount": 2,
                "createdDate": "2024-04-19",
                "createdUserId": 242306,
                "avatar": "https://lxp-cdn.eschool.mn/u/6634561882dd2.png",
                "schoolId": 195,
                "roleId": null,
                "roleName": "Сурагч",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Аригун",
                "lastName": "Ганбаатар",
                "isoDate": "2024-04-19 15:33:28",
                "viewed": false,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [],
                "canDelete": true
            },
            {
                "id": 18410,
                "title": null,
                "content": "",
                "viewCount": 8,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-04-17",
                "createdUserId": 113059,
                "avatar": "https://lxp-cdn.eschool.mn/u/655ac986d2ca3.png",
                "schoolId": 195,
                "roleId": 35,
                "roleName": "Санхүүч",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Ариунжаргал",
                "lastName": "Бат",
                "isoDate": "2024-04-17 16:42:31",
                "viewed": false,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [
                    {
                        "id": "23228",
                        "name": "image",
                        "path": "https://lxp-cdn.eschool.mn/nf/661f8b7d59014.jpg",
                        "size": "114909.00",
                        "type": "image/jpeg",
                        "isImage": true,
                        "isFile": false
                    }
                ],
                "canDelete": true
            },
            {
                "id": 17725,
                "title": null,
                "content": "Testing notifications",
                "viewCount": 12,
                "likeCount": 2,
                "commentCount": 0,
                "createdDate": "2024-04-05",
                "createdUserId": 1920,
                "avatar": "https://lxp-cdn.eschool.mn/u/64fe8b3382a36.png",
                "schoolId": 195,
                "roleId": 31,
                "roleName": "Сургуулийн админ",
                "typeId": 2,
                "typeCode": "ANNOUNCEMENT",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Q",
                "lastName": "Qh",
                "isoDate": "2024-04-05 15:25:43",
                "viewed": false,
                "liked": false,
                "isComment": false,
                "update": false,
                "files": [],
                "canDelete": true
            },
            {
                "id": 17723,
                "title": null,
                "content": "Өдрийн мэнд",
                "viewCount": 12,
                "likeCount": 2,
                "commentCount": 0,
                "createdDate": "2024-04-05",
                "createdUserId": 8,
                "avatar": "https://lxp-cdn.eschool.mn/u/663c4adce3a0a.png",
                "schoolId": 195,
                "roleId": 33,
                "roleName": "Багш",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Enkhdelger",
                "lastName": "Ankhbayar",
                "isoDate": "2024-04-05 15:14:23",
                "viewed": false,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [],
                "canDelete": true
            },
            {
                "id": 17640,
                "title": null,
                "content": "",
                "viewCount": 11,
                "likeCount": 1,
                "commentCount": 0,
                "createdDate": "2024-04-03",
                "createdUserId": 113059,
                "avatar": "https://lxp-cdn.eschool.mn/u/655ac986d2ca3.png",
                "schoolId": 195,
                "roleId": 31,
                "roleName": "Сургуулийн админ",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Ариунжаргал",
                "lastName": "Бат",
                "isoDate": "2024-04-03 15:47:12",
                "viewed": false,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [],
                "canDelete": true
            },
            {
                "id": 17630,
                "title": null,
                "content": "Hihi",
                "viewCount": 11,
                "likeCount": 1,
                "commentCount": 0,
                "createdDate": "2024-04-03",
                "createdUserId": 194694,
                "avatar": "https://lxp-cdn.eschool.mn/u/664c494922af9.png",
                "schoolId": 195,
                "roleId": 33,
                "roleName": "Багш",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Tserensodnom",
                "lastName": "eSchool",
                "isoDate": "2024-04-03 10:34:53",
                "viewed": false,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [],
                "canDelete": true
            },
            {
                "id": 17463,
                "title": null,
                "content": "Сайн байна уу. \r\nТест хийж байна.",
                "viewCount": 10,
                "likeCount": 1,
                "commentCount": 2,
                "createdDate": "2024-03-28",
                "createdUserId": 1805,
                "avatar": "https://lxp-cdn.eschool.mn/u/6434f913cf1c5.png",
                "schoolId": 195,
                "roleId": 31,
                "roleName": "Сургуулийн админ",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Admin",
                "lastName": "eSchool",
                "isoDate": "2024-03-28 12:40:16",
                "viewed": false,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [
                    {
                        "id": "21708",
                        "name": "s-l1600.jpg",
                        "path": "https://lxp-cdn.eschool.mn/nf/6604f4ce37d03.jpg",
                        "size": "81422.00",
                        "type": "image/jpeg",
                        "isImage": true,
                        "isFile": false
                    },
                    {
                        "id": "21709",
                        "name": "Сурагчдын_зөвлөл_Идэвхтэй (1).xlsx",
                        "path": "https://lxp-cdn.eschool.mn/nf/6604f4cf24cec.xlsx",
                        "size": "16323.00",
                        "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "isImage": false,
                        "isFile": true
                    }
                ],
                "canDelete": true
            },
            {
                "id": 16997,
                "title": null,
                "content": "Test",
                "viewCount": 11,
                "likeCount": 1,
                "commentCount": 0,
                "createdDate": "2024-03-20",
                "createdUserId": 1805,
                "avatar": "https://lxp-cdn.eschool.mn/u/6434f913cf1c5.png",
                "schoolId": 195,
                "roleId": 31,
                "roleName": "Сургуулийн админ",
                "typeId": 2,
                "typeCode": "ANNOUNCEMENT",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Admin",
                "lastName": "eSchool",
                "isoDate": "2024-03-20 14:26:13",
                "viewed": false,
                "liked": false,
                "isComment": false,
                "update": false,
                "files": [
                    {
                        "id": "20830",
                        "name": "1tpgtz.jpg",
                        "path": "https://lxp-cdn.eschool.mn/nf/65fa818c90d56.jpg",
                        "size": "50669.00",
                        "type": "image/jpeg",
                        "isImage": true,
                        "isFile": false
                    }
                ],
                "canDelete": true
            },
            {
                "id": 16976,
                "title": null,
                "content": "new post",
                "viewCount": 9,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-03-20",
                "createdUserId": 113059,
                "avatar": "https://lxp-cdn.eschool.mn/u/655ac986d2ca3.png",
                "schoolId": 195,
                "roleId": 33,
                "roleName": "Багш",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Ариунжаргал",
                "lastName": "Бат",
                "isoDate": "2024-03-20 12:44:37",
                "viewed": false,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [
                    {
                        "id": "20812",
                        "name": "image_jpeg (72).jfif",
                        "path": "https://lxp-cdn.eschool.mn/nf/65fa69bb65eb6.jpg",
                        "size": "43247.00",
                        "type": "image/jpeg",
                        "isImage": true,
                        "isFile": false
                    },
                    {
                        "id": "20813",
                        "name": "2023-2024, 3-р улирал, 8А, Математик хичээлийн улирлын дүн.xlsx",
                        "path": "https://lxp-cdn.eschool.mn/nf/65fa69bba41b8.xlsx",
                        "size": "10162.00",
                        "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "isImage": false,
                        "isFile": true
                    }
                ],
                "canDelete": true
            },
            {
                "id": 16974,
                "title": null,
                "content": "Өдрийн мэнд\r\n",
                "viewCount": 9,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-03-20",
                "createdUserId": 1805,
                "avatar": "https://lxp-cdn.eschool.mn/u/6434f913cf1c5.png",
                "schoolId": 195,
                "roleId": 31,
                "roleName": "Сургуулийн админ",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Admin",
                "lastName": "eSchool",
                "isoDate": "2024-03-20 12:32:02",
                "viewed": true,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [
                    {
                        "id": "20809",
                        "name": "2023-2024, 3-р улирал, 8А, Математик хичээлийн улирлын дүн.xlsx",
                        "path": "https://lxp-cdn.eschool.mn/nf/65fa66c897ede.xlsx",
                        "size": "10162.00",
                        "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "isImage": false,
                        "isFile": true
                    }
                ],
                "canDelete": true
            },
            {
                "id": 16973,
                "title": null,
                "content": "Сайн байна уу\r\n",
                "viewCount": 8,
                "likeCount": 0,
                "commentCount": 0,
                "createdDate": "2024-03-20",
                "createdUserId": 113059,
                "avatar": "https://lxp-cdn.eschool.mn/u/655ac986d2ca3.png",
                "schoolId": 195,
                "roleId": 33,
                "roleName": "Багш",
                "typeId": 1,
                "typeCode": "NEWSFEED",
                "hdrId": 6,
                "hdrName": "Тестийн сургууль",
                "firstName": "Ариунжаргал",
                "lastName": "Бат",
                "isoDate": "2024-03-20 12:30:59",
                "viewed": true,
                "liked": false,
                "isComment": true,
                "update": false,
                "files": [
                    {
                        "id": "20807",
                        "name": "image_jpeg (68).jfif",
                        "path": "https://lxp-cdn.eschool.mn/nf/65fa66898387f.jpg",
                        "size": "48005.00",
                        "type": "image/jpeg",
                        "isImage": true,
                        "isFile": false
                    },
                    {
                        "id": "20808",
                        "name": "2023-2024, 3-р улирал, 8А, Математик хичээлийн улирлын дүн.xlsx",
                        "path": "https://lxp-cdn.eschool.mn/nf/65fa668a10fad.xlsx",
                        "size": "10162.00",
                        "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "isImage": false,
                        "isFile": true
                    }
                ],
                "canDelete": true
            }
        ]
    );
    const [selectedNfCommentId, setSelectedNfCommentId] = useState(null);
    const [postHdrRoles, setPostHdrRoles] = useState([]);
    const [hidePost, setHidePost] = useState(true);
    const [selectedHeader, setSelectedHeader] = useState(secureLocalStorage?.getItem(localeTreeData)?.key || null);

    const [user] = useState(secureLocalStorage?.getItem('personInfo') || null)

    const [trueOrFalse, setTrueOrFalse] = useState(false)
    const [availableHeaders, setAvailableHeaders] = useState(false)
    const [userRoles, setUserRoles] = useState([])

    const [loginPhone, setLoginName] = useState('')
    const [comments, setComments] = useState([])
    const [commentSaveSuccess, setCommentSaveSuccess] = useState(0)
    const [commentEditSuccess, setCommentEditSuccess] = useState(0)

    const [hasMorePage, setHasMorePage] = useState(false)

    const [submitSuccess, setSubmitSuccess] = useState(0)
    const [submitSuccessEdit, setSubmitSuccessEdit] = useState(0)

    const [errorHeaderIds, setErrorHeaderIds] = useState(false)
    const [errorDescription, setErrorDescription] = useState(false)
    const [errorDeletePhoneNumber, setErrorDeletePhoneNumber] = useState(false)
    const [errorDeleteDescription, setErrorDeleteDescription] = useState(false)
    const [errorDescriptionEdit, setErrorDescriptionEdit] = useState(false)

    const [deleteModal, setDeleteModal] = useState(false)
    const [modalAction, setModalAction] = useState(false)
    const [modalActionTitle, setModalActionTitle] = useState('')
    const [searchValue, setSearchValue] = useState('')

    const [stats, setStats] = useState([])
    const [filteredStats, setFilteredStats] = useState([])

    const [seenItemIds, setSeenItemIds] = useState([])

    const [page, setPage] = useState(1)
    const [pageSize] = useState(20)
    const [initLoader, setInitLoader] = useState(false);

    const [totalCount, setTotalCount] = useState(0);
    const [filterTotalCount, setFilterTotalCount] = useState(0);

    const getList = (params, isTreeChange = false, isForce) => {
        console.log('getlist')
        // setLoading(true)

        // console.log(notificationId)
        // if (notificationId && !isForce) {
        //     params.notification = notificationId
        //     params.hdr = secureLocalStorage?.getItem('notification_click')?.hdrId
        // }

        // fetchRequest(newsFeedList, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const news = res.data?.newsfeeds || [];
        //             let totalCount = res.data?.totalCount || [];
        //             let filterTotalCount = res.data?.filterTotalCount || [];

        //             let morePage = !(pageSize > news.length);
        //             setHasMorePage(morePage)

        //             if (newsfeeds && newsfeeds.length > 0 && !isTreeChange) {
        //                 let cloneNewsfeeds = [...newsfeeds];

        //                 for (let i = 0; i < news.length; i++) {
        //                     cloneNewsfeeds.push(news[i])
        //                 }

        //                 setNewsfeeds(cloneNewsfeeds);
        //             } else {
        //                 if (news && news.length > 0) {
        //                     // Эхний 3 нь item id нь view action орж амжихгүй байгаа тул хүчээр оруулав VisibilitySensor
        //                     let firstItemIds = []
        //                     for (let i = 0; i < news.length; i++) {
        //                         if (i < 4) {
        //                             if (!news[i].viewed) {
        //                                 firstItemIds.push(news[i].id)
        //                             }
        //                         }
        //                     }

        //                     setSeenItemIds(firstItemIds);
        //                 }
        //                 setNewsfeeds(news || []);
        //             }

        //             secureLocalStorage.removeItem('notification_click')
        //             setTotalCount(totalCount)
        //             setFilterTotalCount(filterTotalCount)
        //             setInitLoader(false)
        //             containerLoaded.current = false
        //         } else {
        //             message(res.data.message)
        //             containerLoaded.current = false;
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const init = () => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(newsFeedInit, 'POST', {})
        //     .then((res) => {
        //         if (res.success) {
        //             const { hdrs, roles, postHdrs } = res.data

        //             setInitLoader(false);
        //             setTreeData(hdrs || [])

        //             if (postHdrs && postHdrs.length) {
        //                 let activeHdrs = postHdrs.map(obj => { return { value: obj.id, text: obj.name, ...obj } })
        //                 setAvailableHeaders(activeHdrs)
        //             }

        //             if (roles.length) {
        //                 let activeRoles = roles.map(obj => { return { value: obj.id, text: obj.name, code: obj.code } })
        //                 setUserRoles(activeRoles)
        //             }

        //             if (selectedTreeId && selectedTreeId.length == 0) {
        //                 let params = {
        //                     hdr: hdrs[0].key,
        //                     page: page,
        //                     pageSize
        //                 };
        //                 setSelectedTreeId([hdrs[0].key])

        //                 if (!containerLoaded?.current) {
        //                     containerLoaded.current = true
        //                     getList(params)
        //                 }
        //             } else {
        //                 let selectedTreeObj = null;
        //                 if (hdrs && hdrs.length > 0) {
        //                     for (let t = 0; t < hdrs.length > 0; t++) {
        //                         if (hdrs[t]['key'] == selectedTreeId[0]) {
        //                             selectedTreeObj = hdrs[t];
        //                             break;
        //                         } else if (hdrs[t].children && hdrs[t].children.length > 0) {
        //                             selectedTreeObj = getSelectedHdrObj(hdrs[t].children, selectedTreeId[0])
        //                             if (selectedTreeObj)
        //                                 break;
        //                         }
        //                     }
        //                 }

        //                 if (selectedTreeObj) {
        //                     setHidePost(!selectedTreeObj.canPost)
        //                     setPostHdrRoles(selectedTreeObj.postRoleCodes)
        //                 }

        //                 let params = {
        //                     hdr: selectedTreeId[0],
        //                     page: page,
        //                     pageSize
        //                 };

        //                 if (!containerLoaded?.current) {
        //                     containerLoaded.current = true
        //                     getList(params)
        //                 }
        //             }
        //             containerLoaded.current = false;
        //         } else {
        //             message(res.data.message)
        //             containerLoaded.current = false;
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        init()
    }, [])

    const _postHeaderIdChange = selectedHeader => {
        setSelectedHeader(selectedHeader)
    }

    const _postCheckBoxChange = trueOrFalse => {
        setTrueOrFalse(trueOrFalse)
    }

    const onSubmit = (formData) => {
        console.log('onSubmit')
        // setLoading(true)
        // fetchRequest(newsFeedSubmit, 'POST', formData, false, true)
        //     .then((res) => {
        //         if (res.success) {
        //             const { newPosts } = res.data

        //             if (newPosts && newPosts.length > 0 && selectedTreeId.length) {
        //                 for (let i = 0; i < newPosts.length; i++) {
        //                     if (selectedTreeId[0] == newPosts[i].hdrId) {
        //                         newsfeeds.unshift(newPosts[i])
        //                     }
        //                 }
        //             }

        //             setSubmitSuccess(submitSuccess + 1)
        //             message(res.data.message, true)
        //             containerLoaded.current = false;
        //         } else {
        //             message(res.data.message)
        //             containerLoaded.current = false;
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onEdit = (formData) => {
        console.log("onEdit")
        // setLoading(true)
        // fetchRequest(newsFeedEdit, 'POST', formData, false, true)
        //     .then((res) => {
        //         if (res.success) {
        //             const { editedNewsfeed } = res.data

        //             if (newsfeeds && newsfeeds.length > 0 && editedNewsfeed) {
        //                 for (let i = 0; i < newsfeeds.length; i++) {
        //                     if (editedNewsfeed.id == newsfeeds[i]['id']) {
        //                         newsfeeds[i] = editedNewsfeed;
        //                     }
        //                 }
        //             }

        //             message(res.data.message, true)
        //             setSubmitSuccessEdit(submitSuccessEdit + 1)
        //             containerLoaded.current = false;
        //         } else {
        //             containerLoaded.current = false;
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onDelete = (params) => {
        console.log('onDelete')
        // setLoading(true)
        // fetchRequest(newsFeedDelete, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const { deletedNewsfeed } = res.data;

        //             if (newsfeeds && newsfeeds.length > 0 && deletedNewsfeed) {
        //                 let cloneNewsfeeds = [...newsfeeds];

        //                 for (let i = 0; i < cloneNewsfeeds.length; i++) {
        //                     if (deletedNewsfeed.id == cloneNewsfeeds[i]['id']) {
        //                         cloneNewsfeeds.splice(i, 1);
        //                     }
        //                 }

        //                 setNewsfeeds(cloneNewsfeeds)
        //             }
        //             message(res.data.message, true)
        //             containerLoaded.current = false;
        //         } else {
        //             message(res.data.message)
        //             containerLoaded.current = false;
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onAction = (params) => {
        console.log(onAction)
        // if (params.action != 'view') {
        //     setLoading(true)
        // }
        // fetchRequest(newsFeedAction, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             if (params.action == 'view') {
        //                 setSeenItemIds([]);
        //             } else {
        //                 const { newsfeed } = res.data;

        //                 if (newsfeeds && newsfeeds.length > 0 && newsfeed) {
        //                     for (let i = 0; i < newsfeeds.length; i++) {
        //                         if (newsfeed.id == newsfeeds[i]['id']) {
        //                             newsfeeds[i] = newsfeed;
        //                         }
        //                     }
        //                 }
        //             }

        //             containerLoaded.current = false;
        //         } else {
        //             containerLoaded.current = false;
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onActionView = (params) => {
        setModalAction(true)
        containerLoaded.current = false;

        // setLoading(true)
        // fetchRequest(newsFeedView, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const { users } = res.data;

        //             setStats(users || []);
        //             setFilteredStats(users || []);
        //             setSeenItemIds([]);
        //             setModalAction(true);
        //             containerLoaded.current = false;
        //         } else {
        //             message(res.data.message)
        //             containerLoaded.current = false;
        //         }
        //         setLoading(false)
        //     })
        //     .catch((e) => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onComment = (params, isReply) => {
        console.log('onComment')
        // setLoading(true)
        // fetchRequest(newsFeedComment, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             if (isReply) {
        //                 const replies = res.data.comments;

        //                 if (newsfeeds && newsfeeds.length > 0 && replies && replies.length > 0) {
        //                     let cloneNewsfeed = [...newsfeeds]
        //                     for (let i = 0; i < cloneNewsfeed.length; i++) {
        //                         if (replies[0].newsfeedId == cloneNewsfeed[i]['id']) {
        //                             let comments = cloneNewsfeed[i]['comments'];
        //                             for (let c = 0; c < comments.length; c++) {
        //                                 if (comments[c]['id'] == replies[0].parentCommentId) {
        //                                     if (comments[c]['replies'] && comments[c]['replies'].length > 0) {
        //                                         let otherReplies = []
        //                                         for (let r = 0; r < replies.length; r++) {
        //                                             let existingInOldComments = comments[c]['replies'].find(comm => comm.id == replies[r].id);

        //                                             if (!existingInOldComments) {
        //                                                 otherReplies.unshift(replies[r])
        //                                             }
        //                                         }
        //                                         comments[c]['replies'] = [...otherReplies, ...comments[c]['replies']]
        //                                     } else {
        //                                         comments[c]['replies'] = replies.reverse();
        //                                     }

        //                                     comments[c]['page'] = res.data?.page || 1;
        //                                     comments[c]['replyPageSize'] = res.data?.pageSize || 20;
        //                                 }
        //                             }
        //                         }
        //                     }
        //                     setNewsfeeds(cloneNewsfeed)
        //                 }
        //             } else {
        //                 const { comments } = res.data;

        //                 if (newsfeeds && newsfeeds.length > 0 && comments && comments.length > 0) {
        //                     let cloneNewsfeed = [...newsfeeds]
        //                     for (let i = 0; i < cloneNewsfeed.length; i++) {
        //                         let commentArray = [];
        //                         for (let c = 0; c < comments.length; c++) {
        //                             if (cloneNewsfeed[i]['id'] == comments[c]['newsfeedId']) {
        //                                 (commentArray).push(comments[c]);
        //                             }
        //                         }

        //                         if (commentArray && commentArray.length > 0) {
        //                             // өмнө comment үүсэн эсэх
        //                             if (cloneNewsfeed[i]['comments'] && cloneNewsfeed[i]['comments'].length) {
        //                                 for (let n = 0; n < commentArray.length; n++) {
        //                                     cloneNewsfeed[i]['comments'].unshift(commentArray[n])
        //                                 }

        //                                 cloneNewsfeed[i]['page'] = parseInt(cloneNewsfeed[i]['page']) + 1;
        //                             } else {
        //                                 cloneNewsfeed[i]['comments'] = commentArray.reverse();
        //                                 cloneNewsfeed[i]['page'] = 1;
        //                                 cloneNewsfeed[i]['commentPageSize'] = 20
        //                             }

        //                             if (cloneNewsfeed[i]['isCommentView']) {
        //                                 cloneNewsfeed[i]['isCommentView'] = false;
        //                             } else {
        //                                 cloneNewsfeed[i]['isCommentView'] = true;
        //                             }
        //                         }
        //                     }
        //                     setNewsfeeds(cloneNewsfeed)
        //                 }
        //             }
        //             containerLoaded.current = false;
        //         } else {
        //             message(res.data.message)
        //             containerLoaded.current = false;
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onCommentSubmit = (params) => {
        console.log('onCommentSubmit')
        // setLoading(true)
        // fetchRequest(newsFeedCommentCreate, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const { comment } = res.data;

        //             if (newsfeeds && newsfeeds.length > 0 && comment) {
        //                 let cloneNewsfeeds = [...newsfeeds];
        //                 for (let i = 0; i < cloneNewsfeeds.length; i++) {
        //                     let commentArray = [];
        //                     if (cloneNewsfeeds[i]['id'] == comment['newsfeedId']) {
        //                         commentArray.push(comment);
        //                         cloneNewsfeeds[i]['commentCount'] = cloneNewsfeeds[i]['commentCount'] + 1;
        //                     }

        //                     if (commentArray && commentArray.length > 0) {
        //                         if (cloneNewsfeeds[i]['comments']) {
        //                             if (comment.parentCommentId) {
        //                                 let comments = cloneNewsfeeds[i]['comments'];
        //                                 for (let c = 0; c < comments.length; c++) {
        //                                     if (comments[c]['id'] == comment.parentCommentId) {
        //                                         if (comments[c]['replies']) {
        //                                             comments[c]['replies'].push(commentArray[0])
        //                                         } else {
        //                                             comments[c]['replies'] = commentArray;
        //                                         }

        //                                         if (!cloneNewsfeeds[i]['newReplyCount']) {
        //                                             cloneNewsfeeds[i]['newReplyCount'] = 1;
        //                                         } else {
        //                                             cloneNewsfeeds[i]['newReplyCount'] += 1;
        //                                         }
        //                                         comments[c]['replyCount'] = parseInt(comments[c]['replyCount']) + 1
        //                                     }
        //                                 }
        //                             } else {
        //                                 cloneNewsfeeds[i]['comments'].push(commentArray[0])
        //                             }
        //                         } else {
        //                             cloneNewsfeeds[i]['comments'] = commentArray;
        //                             cloneNewsfeeds[i]['isCommentView'] = true;
        //                         }
        //                     }
        //                 }

        //                 setCommentSaveSuccess(commentSaveSuccess + 1);
        //                 setNewsfeeds(cloneNewsfeeds);
        //             }
        //             containerLoaded.current = false;
        //         } else {
        //             message(res.data.message)
        //             containerLoaded.current = false;
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onCommentEdit = (params) => {
        console.log('onCommentEdit')
        // setLoading(true)
        // fetchRequest(newsFeedCommentEdit, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const { comment } = res.data;

        //             if (newsfeeds && newsfeeds.length > 0) {
        //                 let cloneNewsfeeds = [...newsfeeds]
        //                 for (let i = 0; i < cloneNewsfeeds.length; i++) {
        //                     if (parseInt(comment.newsfeedId) == cloneNewsfeeds[i]['id']) {
        //                         let comments = cloneNewsfeeds[i]['comments'];
        //                         for (let c = 0; c < comments.length; c++) {
        //                             if (comments[c]['id'] == parseInt(comment.id)) {
        //                                 comments[c]['comment'] = comment.comment;
        //                             } else if (comments[c]['replies']) {
        //                                 let replies = comments[c]['replies'];
        //                                 for (let r = 0; r < replies.length; r++) {
        //                                     if (replies[r]['id'] == parseInt(comment.id)) {
        //                                         replies[r]['comment'] = comment.comment;
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }

        //                 setNewsfeeds(cloneNewsfeeds)
        //             }

        //             setCommentEditSuccess(commentEditSuccess + 1)
        //             containerLoaded.current = false;
        //         } else {
        //             message(res.data.message)
        //             containerLoaded.current = false;
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onCommentDelete = (params) => {
        console.log('onCommentDelete')
        // setLoading(true)
        // fetchRequest(newsFeedCommentDelete, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const { comment } = res.data;

        //             if (newsfeeds && newsfeeds.length > 0) {
        //                 let cloneNewsfeeds = [...newsfeeds]
        //                 for (let i = 0; i < cloneNewsfeeds.length; i++) {
        //                     if (parseInt(comment.newsfeedId) == cloneNewsfeeds[i]['id']) {
        //                         let comments = cloneNewsfeeds[i]['comments'];
        //                         for (let c = 0; c < comments.length; c++) {
        //                             if (comments[c]['id'] == parseInt(comment.id)) {
        //                                 comments.splice(c, 1);

        //                                 cloneNewsfeeds[i]['commentCount'] = cloneNewsfeeds[i]['commentCount'] - 1;
        //                                 if (!cloneNewsfeeds[i]['deleteCommentCount']) {
        //                                     cloneNewsfeeds[i]['deleteCommentCount'] = 1;
        //                                 } else {
        //                                     cloneNewsfeeds[i]['deleteCommentCount'] += 1;
        //                                 }
        //                             } else if (comments[c]['replies']) {
        //                                 let replies = comments[c]['replies'];
        //                                 for (let r = 0; r < replies.length; r++) {
        //                                     if (replies[r]['id'] == parseInt(comment.id)) {
        //                                         replies.splice(r, 1);

        //                                         cloneNewsfeeds[i]['commentCount'] = cloneNewsfeeds[i]['commentCount'] - 1;

        //                                         if (!cloneNewsfeeds[i]['deleteReplyCount']) {
        //                                             cloneNewsfeeds[i]['deleteReplyCount'] = 1;
        //                                         } else {
        //                                             cloneNewsfeeds[i]['deleteReplyCount'] += 1;
        //                                         }

        //                                         comments[c]['replyCount'] = comments[c]['replyCount'] - 1;
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }

        //                 setNewsfeeds(cloneNewsfeeds)
        //             }

        //             setCommentEditSuccess(commentEditSuccess + 1)
        //             containerLoaded.current = false;
        //         } else {
        //             message(res.data.message)
        //             containerLoaded.current = false;
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const _postSubmit = (headers, description, images, files, video, isComment, selectedRole) => {
        let errorHeaderIds;
        let errorDescription;

        if (headers && headers.length == 0) {
            message(translations(locale).newsfeedConfig.insertParentHdrError, false)
            setErrorHeaderIds(true)
            errorHeaderIds = true;
        } else {
            setErrorHeaderIds(false)
            errorHeaderIds = false;
        }

        if (typeof headers == 'number' || typeof headers == 'string') {
            headers = [headers]
        }

        if (!description) {
            message(translations(locale).course_insert_text, false)
            setErrorDescription(true)
            errorDescription = true;
        } else {
            setErrorDescription(false)
            errorDescription = false;
        }

        if (!errorHeaderIds && !errorDescription) {
            let formData = new FormData();

            for (let i = 0; i < headers.length; i++) {
                formData.append('hdrs[]', headers[i]);
            }

            formData.append('content', description)
            formData.append('comment', isComment ? 1 : 0)
            formData.append('selectedHdr', selectedTreeId)
            formData.append('role', selectedRole)

            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i]);
            }

            for (let i = 0; i < video.length; i++) {
                formData.append('videos[]', video[i]);
            }

            if (images.length > 0) {
                const compress = new Compress()
                compress.compress(images, {
                    size: 2, // the max size in MB, defaults to 2MB
                    quality: .9, // the quality of the image, max is 1,
                    maxWidth: 1000, // the max width of the output image, defaults to 1920px
                    maxHeight: 1000, // the max height of the output image, defaults to 1920px
                    resize: true, // defaults to true, set false if you do not want to resize the image width and height
                }).then((data) => {
                    for (let d = 0; d < data.length; d++) {
                        const img = data[d];
                        const base64str = data[d].data;
                        const mime = img.ext;
                        const file = Compress.convertBase64ToFile(base64str, mime);

                        const updatedFile = new File([file], img['alt'], { type: mime });
                        formData.append('images[]', updatedFile);
                    }

                    onSubmit(formData)
                })
            } else {
                onSubmit(formData)
            }
        }
    }

    const getSelectedHdrObj = (children = [], selectedId = null) => {
        let selectedObj = null;
        if (children && children.length > 0) {
            for (let c = 0; c < children.length; c++) {
                if (children[c]['key'] == selectedId) {
                    selectedObj = children[c];
                    break;
                } else if (children[c].children && children[c].children.length > 0) {
                    selectedObj = getSelectedHdrObj(children[c].children, selectedId);
                    if (selectedObj)
                        break;
                }
            }
        }

        return selectedObj;
    }

    const _treeChange = (treeArray, node) => {
        let postHeaderIds = [];
        if (treeArray.length && treeArray[0] !== 'all') {
            postHeaderIds.push(treeArray[0])
            setHidePost(!node.canPost);
        } else {
            setHidePost(true);
        }

        setNotificationId(null)
        secureLocalStorage.removeItem('notification_click')

        setSelectedNfCommentId(null)
        setPostHdrRoles(node.postRoleCodes);

        setSelectedHeader(postHeaderIds);
        setSelectedTreeId(treeArray);
        setNewsfeeds([]);

        let nodeArray = {
            key: node.key,
            canPost: node.canPost,
            title: node.title,
            postRoles: node.postRoleCodes
        }

        secureLocalStorage.setItem(localeTreeData, nodeArray)

        let params = {
            hdr: treeArray[0]
        };

        if (!containerLoaded?.current) {
            containerLoaded.current = true
            getList(params, true, true)
        }
    }

    const _onItemDelete = (id, update, phoneNumber, description) => {
        let errorDeletePhoneNumber = false;
        let errorDeleteDescription = false;

        if (!update) {
            if (!phoneNumber) {
                errorDeletePhoneNumber = true;
                setErrorDeletePhoneNumber(true)
            } else {
                errorDeletePhoneNumber = false;
                setErrorDeletePhoneNumber(false)
            }
            if (!description) {
                errorDeleteDescription = true;
                setErrorDeleteDescription(true)
            } else {
                errorDeleteDescription = false;
                setErrorDeleteDescription(false)
            }
        }

        if (!errorDeletePhoneNumber && !errorDeleteDescription) {
            let params = {
                newsfeed: id,
                contact: phoneNumber,
                description: description
            }

            onDelete(params)
        }
    }

    const _postSubmitEdit = (id, description, images, files, video, isComment, removedArray, roleId) => {
        let errorDescriptionEdit;

        if (!description) {
            message(translations(locale).course_insert_text, false)
            setErrorDescriptionEdit(true);
            errorDescriptionEdit = true;
        } else {
            setErrorDescriptionEdit(false)
            errorDescriptionEdit = false;
        }

        if (!errorDescriptionEdit) {
            let formData = new FormData();

            formData.append('newsfeed', id)

            if (selectedTreeId && selectedTreeId.length && selectedTreeId[0] == 'all') {
                let selectedFeed = newsfeeds.find(data => data.id == id)

                if (newsfeeds) {
                    formData.append('hdr', selectedFeed.hdrId)
                } else {
                    message('Алдаа гарлаа админд хандана уу')
                }
            } else {
                formData.append('hdr', selectedTreeId.length ? selectedTreeId[0] : null)
            }

            formData.append('content', description)
            formData.append('comment', isComment ? 1 : 0)
            formData.append('role', roleId)

            for (let i = 0; i < images.length; i++) {
                formData.append('images[]', images[i]);
            }

            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i]);
            }

            for (let i = 0; i < video.length; i++) {
                formData.append('videos[]', video[i]);
            }

            for (let i = 0; i < removedArray.length; i++) {
                formData.append('removed_files_ids[]', removedArray[i]);
            }

            onEdit(formData)
        }
    }

    const _onItemLike = (id, isLike) => {
        let params = {};
        if (!isLike) {
            params = {
                newsfeed: id,
                action: 'like'
            }
        } else if (isLike) {
            params = {
                newsfeed: id,
                action: 'dislike'
            }
        }

        onAction(params)
    }

    useEffect(() => {
        let viewTimeout;
        if (seenItemIds && seenItemIds.length > 0) {
            viewTimeout = setTimeout(() => {

                let selectedNewsfeedId = null;
                for (let i = 0; i < newsfeeds.length; i++) {
                    if (!newsfeeds[i].viewed) {
                        selectedNewsfeedId = newsfeeds[i].id;
                    }
                }

                let params = {
                    newsfeed: selectedNewsfeedId,
                    newsfeedIds: JSON.stringify(seenItemIds),
                    action: 'view'
                }

                if (!containerLoaded?.current) {
                    containerLoaded.current = true
                    onAction(params)
                }
            }, 4000);
        }
        return () => {
            clearTimeout(viewTimeout);
        };
    }, [seenItemIds, window.scrollY]);

    const _onItemView = id => {
        let cloneItemIds = [...seenItemIds]

        if (!cloneItemIds.find(itemId => itemId == id)) {
            cloneItemIds.push(id)
        }

        let cloneNewsfeeds = [...newsfeeds]
        if (cloneNewsfeeds && cloneNewsfeeds.length > 0) {
            for (let i = 0; i < cloneNewsfeeds.length; i++) {
                if (cloneNewsfeeds[i].id == id) {
                    cloneNewsfeeds[i].viewCount = parseInt(cloneNewsfeeds[i].viewCount) + 1;
                    cloneNewsfeeds[i].viewed = true;
                }
            }
        }

        setSeenItemIds(cloneItemIds)
    }

    const _onItemAction = (id, action) => {
        if (action == 'like') {
            setModalActionTitle(translations(locale).newsfeed.likes)
        } else if (action == 'view') {
            setModalActionTitle(translations(locale).newsfeed.views)
        }

        setFilteredStats([]);

        let cloneItemIds = [...seenItemIds]
        let newsfeedFilter = newsfeeds.find(newsfeed => newsfeed.id == id)
        if (!newsfeedFilter.viewed) {
            if (!cloneItemIds.find(itemId => itemId == id)) {
                cloneItemIds.push(id)
            }
        }

        let params = {
            newsfeed: id,
            newsfeedIds: JSON.stringify(cloneItemIds),
            action: action.toUpperCase()
        }

        if (!containerLoaded?.current) {
            containerLoaded.current = true
            onActionView(params)
        }
    }

    const _onItemComment = (id) => {
        let params = {
            newsfeed: id,
        }

        onComment(params)
    }

    const _onCommentShowReplies = (newsfeedId, commentId) => {
        let params = {
            newsfeed: newsfeedId,
            parent: commentId,
        }

        onComment(params, true)
    }

    const _onItemShowMoreComments = (id, page, order) => {
        let params = {
            newsfeed: id,
            page: page + 1,
            order
        }

        onComment(params)
    }

    const _onItemCommentSave = (newsfeedId, comment, parent) => {
        let params = {
            newsfeed: newsfeedId,
            comment: comment,
            parent: parent,
        }

        if (!containerLoaded?.current) {
            containerLoaded.current = true
            onCommentSubmit(params)
        }
    }

    const _onItemCommentEdit = (newsfeedId, commentId, comment) => {
        let params = {
            id: commentId,
            comment: comment,
        }

        onCommentEdit(params)
    }

    const _onItemCommentDelete = (newsfeedId, commentId) => {
        let params = {
            id: commentId,
        }

        onCommentDelete(params)
    }

    const _onCommentShowMoreReplies = (newsfeedId, commentId, page) => {
        let params = {
            newsfeed: newsfeedId,
            parent: commentId,
            page: page + 1
        }

        onComment(params, true)
    }

    const _closeModalAction = () => {
        setModalAction(false)
    }

    const modalActionOnSearch = e => {
        setSearchValue(e.target.value)
        filterList(e.target.value)
    }

    const filterList = (searcher) => {
        let oldStats = [...stats];

        if (oldStats && oldStats.length > 0) {
            let filtered = oldStats.filter(user => user?.firstName?.toLowerCase()?.includes(searcher) || user?.role?.toLowerCase()?.includes(searcher))

            setFilteredStats(filtered)
        }
    }

    useEffect(() => {
        let timeout;
        if (initLoader) {
            timeout = setTimeout(() => {
                let params = {
                    hdr: selectedTreeId[0],
                    page: page + 1,
                    pageSize
                };

                setPage(page + 1)

                if (!containerLoaded?.current) {
                    containerLoaded.current = true
                    getList(params)
                }
            }, 1000);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [initLoader]);

    window.onscroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 200 && !initLoader && hasMorePage) {
            setInitLoader(true);
        }
    }

    const canPostFilter = () => {
        return !hidePost &&
            <Post
                locale={locale}
                user={user}
                checkBoxValue={trueOrFalse}
                availableHeaders={availableHeaders}
                selected={selectedHeader}
                postRoles={postHdrRoles}
                userRoles={userRoles}
                headerIdChange={_postHeaderIdChange}
                checkBoxChange={_postCheckBoxChange}
                onSubmit={_postSubmit}
                onSubmitSuccess={submitSuccess}
                errorHeaderIds={errorHeaderIds}
                errorDescription={errorDescription}
            />
    }

    const handlerReadNewPost = () => {
        secureLocalStorage.removeItem('notification_click')
        setNotificationId(null);
        window.location.href = '/newsfeed'
    }

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">

            <HtmlHead title={title} description={description} />
            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>  

            <div className='row nf-container'>
                <Col xl="3" xxl="3">
                    <NewsfeedTree
                        locale={locale}
                        data={treeData}
                        onTreeChange={_treeChange}
                        selectedTreeId={selectedTreeId}
                    />
                </Col>
                <Col xl="9" xxl="9">
                    {
                        !notificationId &&
                        canPostFilter()
                    }
                    {
                        totalCount != filterTotalCount && notificationId && totalCount > 0 &&
                        <div className='col-12 text-center mb-2'>
                            <button className='btn m-btn--pill btn-link' onClick={handlerReadNewPost}>
                                <span>{translations(locale).newsfeed.readNewPost}</span>
                            </button>
                        </div>
                    }
                    {
                        newsfeeds && newsfeeds.length > 0
                            ? newsfeeds.map(data => {
                                return (
                                    <Item
                                        key={data.id}
                                        locale={locale}
                                        loginPhone={loginPhone}
                                        data={data}
                                        commentData={comments}
                                        onDelete={_onItemDelete}
                                        errorDeletePhoneNumber={errorDeletePhoneNumber}
                                        errorDeleteDescription={errorDeleteDescription}
                                        onEdit={_postSubmitEdit}
                                        onLike={_onItemLike}
                                        onView={_onItemView}
                                        onAction={_onItemAction}
                                        onComment={_onItemComment}
                                        onCommentSave={_onItemCommentSave}
                                        onCommentDelete={_onItemCommentDelete}
                                        onShowReplies={_onCommentShowReplies}
                                        onShowMoreComments={_onItemShowMoreComments}
                                        commentSaveSuccess={commentSaveSuccess}
                                        user={user}
                                        deleteModal={deleteModal}
                                        onSubmitSuccessEdit={submitSuccessEdit}
                                        errorDescriptionEdit={errorDescriptionEdit}
                                        onShowMoreReply={_onCommentShowMoreReplies}
                                        onEditCommentSubmit={_onItemCommentEdit}
                                        editCommentSuccess={commentEditSuccess}
                                        selectedTreeData={secureLocalStorage?.getItem(localeTreeData) || null}
                                        userRoles={userRoles}
                                        hdrs={treeData}
                                    />
                                )
                            })
                            : null
                    }
                </Col>
            </div>
            {
                modalAction && 
                <ActionModal
                    onClose = {_closeModalAction}
                    onSearch = {modalActionOnSearch}
                    title = {modalActionTitle}
                    searchValue={searchValue}
                    filteredStats = {filteredStats}
                />
            }
            {/* <Modal
                size={'tiny'}
                dimmer={'blurring'}
                open={modalAction}
                onClose={_closeModalAction}
                className="react-modal"
            >
                <div className="header">{modalActionTitle}
                    <button type="button" className="close" onClick={_closeModalAction}>
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="content">
                    <div>
                        <input
                            type='text'
                            className='nf-action-modal-search-input form-control'
                            placeholder={translations(locale).search}
                            value={searchValue}
                            onChange={modalActionOnSearch}
                        />
                    </div>
                    <div className="m-widget3">
                        {
                            filteredStats && filteredStats.length > 0
                                ?
                                filteredStats.map((data, index) => {
                                    return (
                                        <div className="m-widget3__item" key={'action_key_' + index}>
                                            <div className="m-widget3__header">
                                                <div className="m-widget3__user-img">
                                                    <img className="m-widget3__img"
                                                        src={data.avatar || '/images/avatar.png'}
                                                        onError={(e) => {
                                                            e.target.onError = null,
                                                                e.target.src = '/images/avatar.png'
                                                        }}
                                                    />
                                                </div>
                                                <div className="m-widget3__info">
                                                    <span className="m-widget3__username">
                                                        {data.firstName}
                                                    </span>
                                                    <br></br>
                                                    <span className="m-widget3__time">
                                                        {`${data && data.role ? data.role : '-'}  •  ${data && data.createdDate ? data.createdDate : '-'}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                : null
                        }
                    </div>
                </div>
                <div className="actions modal-footer">
                    <div className="col-12 text-center">
                        <button className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                            onClick={_closeModalAction}>{translations(locale).close.toUpperCase() || null}
                        </button>
                    </div>
                </div>
            </Modal> */}
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
        </div>
    );
}

export default Newsfeed;