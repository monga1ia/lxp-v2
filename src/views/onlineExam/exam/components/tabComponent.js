import React from "react";
import { useTranslation } from "react-i18next";

export default function SchoolTab({ selectedTabIndex, onSelectTab, disabled = false }) {
    const { t } = useTranslation()

    return (
        <div className="register-tab-container d-flex">
            <span
                onClick={() => {
                    if(!disabled) {
                        onSelectTab(0)
                    }
                }}
                className={`tab cursor-pointer ${selectedTabIndex === 0 && "active"}`}
            >
                {t('menu.mainGroup')}
            </span>
            <span
                onClick={() => {
                    if(!disabled) {
                        onSelectTab(1)
                    }
                }}
                className={`tab cursor-pointer ${selectedTabIndex === 1 && "active"}`}
            >
                {t('menu.schools')}
            </span>
        </div>
    );
}
