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
    class: lazy(() => import("views/school/class/index")),
    group: lazy(() => import("views/school/group/index")),
}

const esis = {
    employee: lazy(() => import("views/esis/employee/index")),
    class: lazy(() => import("views/esis/class/index")),
    student: lazy(() => import("views/esis/student/index")),
    curriculum: lazy(() => import("views/esis/curriculum/index")),
    attendance: lazy(() => import("views/esis/attendance/index"))
}

const newsFeed = {
    newsFeed: lazy(() => import("views/newsFeed/newsFeed/index")),
    config: lazy(() => import("views/newsFeed/config/index")),
}

const group = {
    attendance: lazy(() => import("views/class/attendance/index")),
    student: lazy(() => import("views/class/student/index")),
    parents: lazy(() => import("views/class/parents/index")),
    timetable: lazy(() => import("views/class/timetable/index")),
    calendar: lazy(() => import("views/class/calendar/index")),
    exams: lazy(() => import("views/class/exams/index")),
    results: lazy(() => import("views/class/results/index")),
    reports: lazy(() => import("views/class/reports/index")),
}

const template = {
    exams: lazy(() => import("views/template/exams/index")),
    skills: lazy(() => import("views/template/skills/index")),
}

const movement = {
    in: lazy(() => import("views/movement/in/index")),
    out: lazy(() => import("views/movement/out/index")),
    between: lazy(() => import("views/movement/between/index")),
    up: lazy(() => import("views/movement/up/index")),
}

const manager = {
    groups: lazy(() => import("views/manager/groups/index")),
    excuses: lazy(() => import("views/manager/excuses/index")),
    clubs: lazy(() => import("views/manager/clubs/index")),
    timetable: lazy(() => import("views/manager/timetable/index")),
    transcript: lazy(() => import("views/manager/transcript/index")),
    classGroups: lazy(() => import("views/manager/classGroups/index")),
    detention: lazy(() => import("views/manager/detention/index")),
    curriculum: lazy(() => import("views/manager/curriculum/index")),
}

const teacher = {
    today: lazy(() => import("views/teacher/today/index")),
    timetable: lazy(() => import("views/teacher/timetable/index")),
    journals: lazy(() => import("views/teacher/journals/index")),
    excuses: lazy(() => import("views/teacher/excuses/index")),
    onlineLessons: lazy(() => import("views/teacher/onlineLessons/index")),
    year: lazy(() => import("views/teacher/year/index")),
    handToHand: lazy(() => import("views/teacher/handToHand/index")),
    calendar: lazy(() => import("views/teacher/calendar/index")),
}

const assessments = {
    exams: lazy(() => import("views/assessments/exams/index")),
    finalExams: lazy(() => import("views/assessments/finalExams/index")),
    skill: lazy(() => import("views/assessments/skill/index")),
}

const analysis = {
    exam: lazy(() => import("views/analysis/exam/index")),
    examTemplate: lazy(() => import("views/analysis/examTemplate/index")),
    seasonResult: lazy(() => import("views/analysis/seasonResult/index")),
    scoreboard: lazy(() => import("views/analysis/scoreboard/index")),
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
            to: `${appRoot}/school/teacher`,
        },
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
                    path: "/class",
                    label: "class_name",
                    component: school.class,
                },
                // {
                //     path: "/group",
                //     label: "menu.group",
                //     component: school.group,
                // }
            ],
        },
        {
            path: `${appRoot}/esis`,
            label: "menu.esis",
            icon: "folder",
            exact: true,
            redirect: true,
            to: `${appRoot}/esis/employee`,
            subs: [
                {
                    path: "/employee",
                    label: "menu.employee",
                    component: esis.employee,
                },
                {
                    path: "/class",
                    label: "menu.class",
                    component: esis.class,
                },
                {
                    path: "/student",
                    label: "menu.student",
                    component: esis.student,
                },
                {
                    path: "/curriculum",
                    label: "menu.curriculum",
                    component: esis.curriculum,
                },
                {
                    path: "/attendance",
                    label: "menu.attendance",
                    component: esis.attendance,
                }
            ],
        },
        {
            path: `${appRoot}/newsfeed`,
            label: "menu.newsfeed",
            icon: "inbox",
            exact: true,
            redirect: true,
            to: `${appRoot}/newsfeed`,
            subs: [
                {
                    path: '/index',
                    label: "menu.employee",
                    component: newsFeed.newsFeed,
                },
                {
                    path: "/config",
                    label: "menu.config",
                    component: newsFeed.config,
                },
            ],
        },
        {
            path: `${appRoot}/class`,
            label: "menu.class",
            icon: "graduation",
            exact: true,
            redirect: true,
            to: `${appRoot}/class`,
            subs: [
                {
                    path: '/attendance',
                    label: "menu.attendance",
                    component: group.attendance,
                },
                {
                    path: "/student",
                    label: "menu.student",
                    component: group.student,
                },
                {
                    path: "/parents",
                    label: "menu.parents",
                    component: group.parents,
                },
                {
                    path: "/timetable",
                    label: "menu.timetable",
                    component: group.timetable,
                },
                {
                    path: "/calendar",
                    label: "menu.calendar",
                    component: group.calendar,
                },
                {
                    path: "/exams",
                    label: "menu.exams",
                    component: group.exams,
                },
                {
                    path: "/results",
                    label: "menu.results",
                    component: group.results,
                },
                {
                    path: "/reports",
                    label: "menu.reports",
                    component: group.reports,
                },
            ],
        },
        {
            path: `${appRoot}/template`,
            label: "menu.template",
            icon: "edit",
            exact: true,
            redirect: true,
            to: `${appRoot}/template`,
            subs: [
                {
                    path: '/exams',
                    label: "menu.exams",
                    component: template.exams,
                },
                {
                    path: "/skills",
                    label: "menu.skills",
                    component: template.skills,
                },
            ],
        },
        {
            path: `${appRoot}/movement`,
            label: "menu.movement",
            icon: "handbag",
            exact: true,
            redirect: true,
            to: `${appRoot}/movement`,
            subs: [
                {
                    path: '/in',
                    label: "menu.in",
                    component: movement.in,
                },
                {
                    path: "/out",
                    label: "menu.out",
                    component: movement.out,
                },
                {
                    path: "/between",
                    label: "menu.between",
                    component: movement.between,
                },
                {
                    path: "/up",
                    label: "menu.up",
                    component: movement.up,
                },
            ],
        },
        {
            path: `${appRoot}/manager`,
            label: "menu.manager",
            icon: "lecture",
            exact: true,
            redirect: true,
            to: `${appRoot}/manager`,
            subs: [
                {
                    path: '/groups',
                    label: "menu.groups",
                    component: manager.groups,
                },
                {
                    path: "/excuses",
                    label: "menu.excuses",
                    component: manager.excuses,
                },
                {
                    path: "/clubs",
                    label: "menu.clubs",
                    component: manager.clubs,
                },
                {
                    path: "/timetable",
                    label: "menu.timetable",
                    component: manager.timetable,
                },
                {
                    path: '/groups',
                    label: "menu.groups",
                    component: manager.groups,
                },
                {
                    path: "/transcript",
                    label: "menu.transcript",
                    component: manager.transcript,
                },
                {
                    path: "/class-groups",
                    label: "menu.class-groups",
                    component: manager.classGroups,
                },
                {
                    path: "/detention",
                    label: "menu.detention",
                    component: manager.detention,
                },
                {
                    path: "/curriculum",
                    label: "menu.curriculum",
                    component: manager.curriculum,
                },
            ],
        },
        {
            path: `${appRoot}/teacher`,
            label: "menu.teacher",
            icon: "presentation",
            exact: true,
            redirect: true,
            to: `${appRoot}/teacher`,
            subs: [
                {
                    path: '/today',
                    label: "menu.today",
                    component: teacher.today,
                },
                {
                    path: "/timetable",
                    label: "menu.timetable",
                    component: teacher.timetable,
                },
                {
                    path: "/journals",
                    label: "menu.journals",
                    component: teacher.journals,
                },
                {
                    path: "/excuses",
                    label: "menu.excuses",
                    component: teacher.excuses,
                },
                {
                    path: '/online-lessons',
                    label: "menu.online-lessons",
                    component: teacher.onlineLessons,
                },
                {
                    path: "/year",
                    label: "menu.year",
                    component: teacher.year,
                },
                {
                    path: "/hand-to-hand",
                    label: "menu.hand-to-hand",
                    component: teacher.handToHand,
                },
                {
                    path: "/calendar",
                    label: "menu.calendar",
                    component: teacher.calendar,
                },
            ],
        },
        {
            path: `${appRoot}/assessments`,
            label: "menu.assessments",
            icon: "folders",
            exact: true,
            redirect: true,
            to: `${appRoot}/assessments`,
            subs: [
                {
                    path: '/exams',
                    label: "menu.exams",
                    component: assessments.exams,
                },
                {
                    path: "/final-exams",
                    label: "menu.final-exams",
                    component: assessments.finalExams,
                },
                {
                    path: "/skill",
                    label: "menu.skill",
                    component: assessments.skill,
                },
            ],
        },
        {
            path: `${appRoot}/analysis`,
            label: "menu.analysis",
            icon: "electricity",
            exact: true,
            redirect: true,
            to: `${appRoot}/analysis`,
            subs: [
                {
                    path: '/exam',
                    label: "menu.exam",
                    component: analysis.exam,
                },
                {
                    path: "/exam-template",
                    label: "menu.exam-template",
                    component: analysis.examTemplate,
                },
                {
                    path: "/season-result",
                    label: "menu.season-result",
                    component: analysis.seasonResult,
                },
                {
                    path: "/scoreboard",
                    label: "menu.scoreboard",
                    component: analysis.scoreboard,
                },
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
