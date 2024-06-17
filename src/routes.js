import { lazy } from "react";
import { DEFAULT_PATHS } from "config.js";

const dashboards = {
    mainGroup: lazy(() => import("views/groups/MainGroup")),
    groupDetails: lazy(() => import("views/groups/groupDetails/GroupDetails")),
    exam: lazy(() => import("views/dashboard/exam")),
};

const curriculum = {
    dashboard: lazy(() => import("views/curriculum/index")),
    curriculumPlan: lazy(() => import("views/curriculum/plan"))
}

const onlineExam = {
    // question bank
    questions: lazy(() => import("views/onlineExam/questions")),
    questionAdd: lazy(() => import("views/onlineExam/questions/add")),
    questionEdit: lazy(() => import("views/onlineExam/questions/edit")),

    // exam template
    examTemplate: lazy(() => import("views/onlineExam/examTemplate")),
    examTemplateAdd: lazy(() => import("views/onlineExam/examTemplate/add")),
    examTemplateEdit: lazy(() => import("views/onlineExam/examTemplate/edit")),

    // exam
    exam: lazy(() => import("views/onlineExam/exam")),
    examAdd: lazy(() => import("views/onlineExam/exam/add")),
    examEdit: lazy(() => import("views/onlineExam/exam/edit")),
    quizReport: lazy(() => import("views/onlineExam/quizReport/QuizReport")),
    analysis: lazy(() => import("views/onlineExam/analysis/Analysis")),

    // exam print
    examPrint: lazy(() => import("views/onlineExam/examPrint")),
    examPrintAdd: lazy(() => import("views/onlineExam/examPrint/add")),
    examPrintEdit: lazy(() => import("views/onlineExam/examPrint/edit")),
    // quizReport: lazy(() => import("views/onlineExam/quizReport/QuizReport")),
    // analysis: lazy(() => import("views/onlineExam/analysis/Analysis")),
};

const school = {
    teacher: lazy(() => import("views/school/teacher/index")),
    worker: lazy(() => import("views/school/worker/index")),
    group: lazy(() => import("views/school/group/index"))
}

const adminQuestion = {
    // question bank
    questions: lazy(() => import("views/adminQuestion/index")),
    // questionAdd: lazy(() => import("views/onlineExam/questions/add")),
    // questionEdit: lazy(() => import("views/onlineExam/questions/edit")),

    // exam template
    // examTemplate: lazy(() => import("views/onlineExam/examTemplate")),
    // examTemplateAdd: lazy(() => import("views/onlineExam/examTemplate/add")),
    // examTemplateEdit: lazy(() => import("views/onlineExam/examTemplate/edit")),

    // exam
    // exam: lazy(() => import("views/onlineExam/exam")),
    // examAdd: lazy(() => import("views/onlineExam/exam/add")),
    // examEdit: lazy(() => import("views/onlineExam/exam/edit")),
    // quizReport: lazy(() => import("views/onlineExam/quizReport/QuizReport")),
    // analysis: lazy(() => import("views/onlineExam/analysis/Analysis")),
};

const onlineLesson = {
    lesson: lazy(() => import("views/onlineLesson/lesson/index")),
    report: lazy(() => import("views/onlineLesson/lesson/report/index")),
    reportUser: lazy(() => import("views/onlineLesson/lesson/report/userDetail")),
    reportSyllabus: lazy(() => import("views/onlineLesson/lesson/report/syllabusDetail")),
    lessonAdd: lazy(() => import("views/onlineLesson/lesson/SubmitLesson")),
    lessonDetail: lazy(() => import("views/onlineLesson/lesson/DetailSubmit")),
    setting: lazy(() => import("views/onlineLesson/setting/index")),
}

const studentOnlineExam = {
    exam: lazy(() => import("views/student/onlineExam/index")),
    detail: lazy(() => import("views/student/onlineExam/components/Detail")),
    view: lazy(() => import("views/student/onlineExam/components/View")),
    questions: lazy(() => import("views/student/onlineExam/components/Questions"))
}

const studentStudyPlan = {
    index: lazy(() => import("views/student/studyPlan/index")),
}

const studentOnlineLesson = {
    groupCourse: lazy(() => import("views/student/course/index")),
    course: lazy(() => import("views/student/course/components/courseList")),
    info: lazy(() => import("views/student/course/components/courseDetail")),
    examQuestion: lazy(() => import("views/student/course/exam/examQuestions")),
    examView: lazy(() => import("views/student/course/exam/View")),
    crosswordView: lazy(() => import("views/student/course/crossword/index"))
}

const studentCouncilIndex = {
    index: lazy(() => import("views/student/council/index")),
};

const studentPodcast = {
    index: lazy(() => import("views/student/podcast/index")),
    view: lazy(() => import("views/student/podcast/components/view")),
};

const testing = {
    index: lazy(() => import("views/test"))
};
const user = {
    index: lazy(() => import("views/user/index"))
};

const webinar = {
    index: lazy(() => import("views/webinar/index")),
    add: lazy(() => import("views/webinar/add")),
    edit: lazy(() => import("views/webinar/edit")),
    view: lazy(() => import("views/webinar/view")),
    live: lazy(() => import("views/webinar/live")),
};

const podcast = {
    index: lazy(() => import("views/podcast/index")),
};

const appRoot = DEFAULT_PATHS.APP.endsWith("/")
    ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length)
    : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
    sidebarItems: [
        
    ],
    mainMenuItems: [
        {
            path: DEFAULT_PATHS.APP,
            exact: true,
            redirect: true,
            to: `${appRoot}/groups/index`,
        },
        // {
        //     path: `${appRoot}/dashboard`,
        //     icon: "grid-1",
        //     label: "dashboard.title",
        //     exact: true,
        //     redirect: true,
        //     to: `${appRoot}/dashboard/exam`,
        //     subs: [
        //         {
        //             path: "/exam",
        //             label: "dashboard.exam",
        //             component: dashboards.exam,
        //         }
        //     ],
        // },
        // {
        //     path: `${appRoot}/admin-question`,
        //     icon: "grid-1",
        //     label: "adminQuestion.title",
        //     exact: true,
        //     redirect: true,
        //     to: `${appRoot}/admin-question/index`,
        //     subs: [
        //         {
        //             path: "/index",
        //             label: "adminQuestion.questionBank",
        //             component: adminQuestion.questions,
        //         }
        //     ],
        // },
        // {
        //     path: `${appRoot}/curriculum`,
        //     icon: "home-garage",
        //     label: "curriculum.plan",
        //     exact: true,
        //     redirect: true,
        //     to: `${appRoot}/curriculum/dashboard`,
        //     subs: [
        //         {
        //             path: "/dashboard",
        //             label: "curriculum.dashboard",
        //             component: curriculum.dashboard,
        //         },
        //         {
        //             path: "/plan",
        //             label: "menu.curriculum",
        //             component: curriculum.curriculumPlan,
        //         },
        //         // {
        //         //     path: "/goal",
        //         //     label: "menu.curriculumLearningObjectives",
        //         //     component: curriculum.curriculumPlan,
        //         // },
        //         // {
        //         //     path: "/method",
        //         //     label: "menu.method",
        //         //     component: curriculum.curriculumPlan,
        //         // }
        //     ],
        // },
        // {
        //     path: `${appRoot}/groups`,
        //     icon: "home-garage",
        //     label: "menu.mainGroup",
        //     exact: true,
        //     redirect: true,
        //     to: `${appRoot}/groups/index`,
        //     subs: [
        //         {
        //             path: "/index",
        //             label: "menu.mainGroup",
        //             component: dashboards.mainGroup,
        //         }
        //         // {
        //         //     path: "/edit",
        //         //     label: "menu.mainGroup",
        //         //     component: dashboards.groupDetails,
        //         //     menuHidden: true,
        //         // }
        //     ],
        // }, 
        {
            path: `${appRoot}/school`,
            label: "menu.school",
            icon: "home-garage",
            exact: true,
            redirect: true,
            to: `${appRoot}/school/teacher`,
            subs: [
                {
                    path: "/teacher",
                    label: "menu.teacher",
                    component: school.teacher,
                },
                {
                    path: "/worker",
                    label: "menu.worker",
                    component: school.worker,
                },
                {
                    path: "/group",
                    label: "menu.group",
                    component: school.group,
                }
            ],
        },
        // {
        //     path: `${appRoot}/online-exam`,
        //     label: "menu.onlineExam",
        //     icon: "quiz",
        //     exact: true,
        //     redirect: true,
        //     to: `${appRoot}/online-exam/questions`,
        //     subs: [
        //         {
        //             path: "/questions",
        //             label: "menu.question",
        //             component: onlineExam.questions,
        //         },
        //         {
        //             path: "/template",
        //             label: "menu.examTemplate",
        //             component: onlineExam.examTemplate,
        //         },
        //         {
        //             path: "/exam",
        //             label: "menu.exam",
        //             component: onlineExam.exam,
        //         },
        //         {
        //             path: "/print-exam",
        //             label: "onlineExam.examPrint",
        //             component: onlineExam.examPrint,
        //         }
        //     ],
        // },
        // {
        //     path: `${appRoot}/onlineLesson`,
        //     label: "menu.onlineLesson",
        //     icon: "book-open",
        //     exact: true,
        //     redirect: true,
        //     to: `${appRoot}/onlineLesson/lesson`,
        //     subs: [
        //         {
        //             path: "/lesson",
        //             label: "subject.subjects",
        //             component: onlineLesson.lesson,
        //         },
        //         {
        //             path: "/report",
        //             label: "menu.report",
        //             component: onlineLesson.report,
        //             hideInMenu: true,
        //             menuHidden: true
        //         },
        //         {
        //             path: "/report-user",
        //             label: "menu.report",
        //             component: onlineLesson.reportUser,
        //             hideInMenu: true,
        //             menuHidden: true
        //         },
        //         {
        //             path: "/report-syllabus",
        //             label: "menu.report",
        //             component: onlineLesson.reportSyllabus,
        //             hideInMenu: true,
        //             menuHidden: true
        //         },
        //         {
        //             path: "/setting",
        //             label: "setting.title",
        //             component: onlineLesson.setting,
        //         }
        //     ],
        // },
        // {
        //     path: `${appRoot}/webinar`,
        //     icon: "grid-1",
        //     label: "webinar.title",
        //     exact: true,
        //     redirect: true,
        //     to: `${appRoot}/webinar/index`,
        //     hideInMenu: true,
        //     subs: [
        //         {
        //             path: "/index",
        //             label: "webinar.title",
        //             component: webinar.index,
        //         }
        //     ],
        // },
        // {
        //     path: `${appRoot}/podcast/index`,
        //     icon: "grid-1",
        //     label: "podcast.title",
        //     // exact: true,
        //     // redirect: true,
        //     // to: `${appRoot}/webinar/index`,
        //     hideInMenu: false,
        //     component: podcast.index,
        // },
        {
            path: `${appRoot}/webinar/add`,
            component: webinar.add,
            menuHidden: true,
        },
        {
            path: `${appRoot}/webinar/edit`,
            component: webinar.edit,
            menuHidden: true,
        },
        {
            path: `${appRoot}/webinar/view`,
            component: webinar.view,
            menuHidden: true,
        },
        {
            path: `${appRoot}/webinar/live`,
            component: webinar.live,
            menuHidden: true,
        },
        {
            path: `${appRoot}/groups/edit`,
            component: dashboards.groupDetails,
            hideSideBar: true
        },
        {
            path: `${appRoot}/onlineLesson/lesson-submit`,
            component: onlineLesson.lessonAdd,
            menuHidden: true,
        },
        {
            path: `${appRoot}/onlineLesson/lesson-detail-submit`,
            component: onlineLesson.lessonDetail,
            menuHidden: true,
        },
        {
            path: `${appRoot}/question-add`,
            component: onlineExam.questionAdd,
            menuHidden: true,
        },
        {
            path: `${appRoot}/question-edit`,
            component: onlineExam.questionEdit,
            menuHidden: true,
        },
        {
            path: `${appRoot}/online-exam/template-add`,
            component: onlineExam.examTemplateAdd,
            menuHidden: true,
        },
        {
            path: `${appRoot}/online-exam/template-edit`,
            component: onlineExam.examTemplateEdit,
            menuHidden: true,
        },
        {
            path: `${appRoot}/online-exam/exam-add`,
            component: onlineExam.examAdd,
            menuHidden: true,
        },
        {
            path: `${appRoot}/online-exam/exam-edit`,
            component: onlineExam.examEdit,
            menuHidden: true,
        },
        {
            path: `${appRoot}/online-exam/exam-print-add`,
            component: onlineExam.examPrintAdd,
            menuHidden: true,
        },
        {
            path: `${appRoot}/online-exam/exam-print-edit`,
            component: onlineExam.examPrintEdit,
            menuHidden: true,
        },
        {
            path: `${appRoot}/quiz-template`,
            component: onlineExam.quizTemplate,
            menuHidden: true,
        },
        {
            path: `${appRoot}/quiz-template-blueprint`,
            component: onlineExam.quizTemplateBlueprint,
            menuHidden: true,
        },
        {
            path: `${appRoot}/quiz-report`,
            component: onlineExam.quizReport,
            menuHidden: true,
        },
        {
            path: `${appRoot}/analysis`,
            component: onlineExam.analysis,
            menuHidden: true,
        },
        {
            path: `${appRoot}/quiz-start`,
            component: onlineExam.studentQuizStart,
            menuHidden: true,
        },
        {
            path: `${appRoot}/quiz-one`,
            component: onlineExam.studentQuizOne,
            menuHidden: true,
        },
        {
            path: `${appRoot}/quiz-two`,
            component: onlineExam.studentQuizTwo,
            menuHidden: true,
        },
        {
            path: `${appRoot}/student-result`,
            component: onlineExam.studentResult,
            menuHidden: true,
        },
        {
            path: `${appRoot}/testing`,
            component: testing.index,
            hideSideBar: true,
            menuHidden: true,
        },
        {
            path: `${appRoot}/user/profile`,
            component: user.index,
        }
    ],
    //student web
    studentMenuItems: [
        {
            path: DEFAULT_PATHS.APP,
            exact: true,
            redirect: true,
            to: `${appRoot}/exam/index`,
        },
        {
            path: `${appRoot}/exam/index`,
            label: "menu.onlineExam",
            icon: "quiz",
            exact: true,
            component: studentOnlineExam.exam,
            to: `${appRoot}/exam/index`
        },
        {
            path: `${appRoot}/lesson/index`,
            label: "menu.onlineLesson",
            icon: "book-open",
            component: studentOnlineLesson.groupCourse,
        },
        {
            path: `${appRoot}/lesson/course`,
            component: studentOnlineLesson.course,
            menuHidden: false
        },
        {
            path: `${appRoot}/lesson/crossword`,
            component: studentOnlineLesson.crosswordView,
            menuHidden: false
        },
        {
            path: `${appRoot}/lesson/info`,
            component: studentOnlineLesson.info,
            menuHidden: false
        },
        {
            path: `${appRoot}/exam/information`,
            component: studentOnlineExam.detail,
            menuHidden: true
        },
        {
            path: `${appRoot}/exam/exam`,
            component: studentOnlineExam.questions,
            menuHidden: true
        },
        {
            path: `${appRoot}/exam/view`,
            component: studentOnlineExam.view,
            menuHidden: true
        },
        {
            path: "/lesson/exam",
            component: studentOnlineLesson.examQuestion,
            menuHidden: false
        },
        {
            path: "/lesson/exam-view",
            component: studentOnlineLesson.examView,
            menuHidden: false
        },
        {
            path: `${appRoot}/study/index`,
            label: "menu.studyPlan",
            icon: "diploma",
            exact: true,
            component: studentStudyPlan.index,
            to: `${appRoot}/study/index`
        },
        {
            path: `${appRoot}/council/index`,
            label: "council.title",
            icon: "diploma",
            exact: true,
            hideInMenu: false,
            component: studentCouncilIndex.index,
        },
        {
            path: `${appRoot}/podcast/index`,
            label: "podcast.title",
            icon: "mic",
            exact: true,
            hideInMenu: false,
            component: studentPodcast.index,
        },
        {
            path: `${appRoot}/podcast/view`,
            component: studentPodcast.view,
            hideInMenu: true,
        },
    ],
    //public student web
    publicStudentMenuItems: [
        {
            path: DEFAULT_PATHS.APP,
            exact: true,
            redirect: true,
            to: `${appRoot}/lesson/index`,
        },
        // {
        //     path: `${appRoot}/exam/index`,
        //     label: "menu.onlineExam",
        //     icon: "quiz",
        //     exact: true,
        //     component: studentOnlineExam.exam,
        //     to: `${appRoot}/exam/index`
        // },
        {
            path: `${appRoot}/lesson/index`,
            label: "menu.onlineLesson",
            icon: "book-open",
            component: studentOnlineLesson.groupCourse,
        },
        {
            path: `${appRoot}/podcast/index`,
            label: "podcast.title",
            icon: "mic",
            exact: true,
            hideInMenu: false,
            component: studentPodcast.index,
        },
        {
            path: `${appRoot}/lesson/course`,
            component: studentOnlineLesson.course,
            menuHidden: false
        },
        {
            path: `${appRoot}/lesson/info`,
            component: studentOnlineLesson.info,
            menuHidden: false
        },
        // {
        //     path: `${appRoot}/exam/information`,
        //     component: studentOnlineExam.detail,
        //     menuHidden: true
        // },
        // {
        //     path: `${appRoot}/exam/exam`,
        //     component: studentOnlineExam.questions,
        //     menuHidden: true
        // },
        // {
        //     path: `${appRoot}/exam/view`,
        //     component: studentOnlineExam.view,
        //     menuHidden: true
        // },
        {
            path: "/lesson/exam",
            component: studentOnlineLesson.examQuestion,
            menuHidden: false
        },
        {
            path: "/lesson/exam-view",
            component: studentOnlineLesson.examView,
            menuHidden: false
        },
        {
            path: `${appRoot}/podcast/view`,
            component: studentPodcast.view,
            hideInMenu: true,
        },
    ],
    organizationUserMenuItems: [
        {
            path: DEFAULT_PATHS.APP,
            exact: true,
            redirect: true,
            to: `${appRoot}/dashboard/exam`,
        },
        {
            path: `${appRoot}/dashboard`,
            icon: "grid-1",
            label: "dashboard.title",
            exact: true,
            redirect: true,
            to: `${appRoot}/dashboard/exam`,
            subs: [
                {
                    path: "/exam",
                    label: "dashboard.exam",
                    component: dashboards.exam,
                }
            ],
        },
        {
            path: `${appRoot}/admin-question`,
            icon: "grid-1",
            label: "adminQuestion.title",
            exact: true,
            redirect: true,
            to: `${appRoot}/admin-question/index`,
            subs: [
                {
                    path: "/index",
                    label: "adminQuestion.questionBank",
                    component: adminQuestion.questions,
                }
            ],
        },
    ],
};
export default routesAndMenuItems;
