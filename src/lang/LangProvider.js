import React from "react";
import { IntlProvider, ReactIntlErrorCode } from "react-intl";
import { useSelector } from "react-redux";

const LangProvider = ({ children }) => {
    const { currentLang } = useSelector((state) => state.lang);

    const onError = (e) => {
        if (e.code == ReactIntlErrorCode.MISSING_DATA) {
            return null
        }
    }

    return (
        <IntlProvider
            locale={currentLang.locale}
            onError={onError}
            defaultLocale={currentLang.locale}
        >
            {children}
        </IntlProvider>
    );
};
export default LangProvider;
