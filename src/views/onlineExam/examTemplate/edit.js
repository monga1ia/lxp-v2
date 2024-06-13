import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import HtmlHead from "components/html-head/HtmlHead";
import TabComponent from "components/tab/Tab";
import QuizDetails from "./components/quizDetails";
import Information from "./components/information";

export default function TemplateQuestions() {
    const { t } = useTranslation();
    const location = useLocation();
    const [selectedId] = useState(location?.state?.id || null)
    const [tabIndex, setTabIndex] = useState(1)
    const [tabCode, setTabCode] = useState('DETAIL')

    const onTabChange = (activeIndex, code) => {
        setTabIndex(activeIndex)
        setTabCode(code)
    }

    const onChangeTabAction = () => {
        setTabIndex(1)
        setTabCode('DETAIL')
    }

    return (
        <>
            <HtmlHead title="quiz-questions" />

            <div className="screen-padding">
                <div className="layoutless-page">
                    <TabComponent
                        selectedTabIndex={tabIndex}
                        onChange={onTabChange}
                        tabs={[
                            {
                                title: t("menu.generalInformation"),
                                code: 'INFORMATION',
                                children: (
                                    <Information
                                        id={selectedId}
                                        tabCode={tabCode}
                                        onChangeTabAction={onChangeTabAction}
                                    />
                                )
                            },
                            {
                                title: t("menu.task"),
                                code: 'DETAIL',
                                children: (
                                    <QuizDetails
                                        id={selectedId}
                                        tabCode={tabCode}
                                        // quizCreateMethodIndex={quizCreateMethodIndex}
                                        // setQuizCreateMethodIndex={setQuizCreateMethodIndex}
                                        // sendArray={(qDetail) => receiveArray(qDetail)}
                                    />
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
}
