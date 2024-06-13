import React, {useState} from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import { fetchRequest } from 'utils/fetchRequest'
import { studentCouncilJoinRequest } from 'utils/fetchRequest/Urls';
import message from 'modules/message'

const useStyles = makeStyles({
    root: {
        
    },
});

const Tabs = ({
    tabList,
    selectedTab,
    searchValue,
    onTabChange,
    onHandlerInputChange,
    onHandleKeyDown
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [loading, setLoading] = useState(false)
    const [isApproved, setIsApproved] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)

    return (
        <div className='d-flex flex-row align-items-center justify-content-between study-plan-tab-style mb-3 fs-16'>
            <div>
                {
                    tabList.map((obj, index) => {
                        return <Button
                            key={index}
                            variant={selectedTab == obj.code ? 'outline-primary' : 'empty'}
                            onClick={() => onTabChange(obj.code)}
                            className='mr-2'
                        >
                            <h5 className={selectedTab != obj.code ? 'text-black m-0' : 'm-0'}>
                                {obj.name || ''}
                            </h5>
                        </Button>
                    })
                }
            </div>
            <div>
                <input
                    value={searchValue}
                    className='council-search-input'
                    placeholder={t('common.search')}
                    onChange={e => onHandlerInputChange(e)}
                    onKeyDown={onHandleKeyDown}
                />
            </div>
        </div>
    );
};

export default Tabs;
