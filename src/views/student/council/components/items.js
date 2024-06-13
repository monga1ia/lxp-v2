import React from 'react'
import { Grid } from '@material-ui/core'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Target, Smile, Star, Frown } from 'lucide-react';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

const ListItems = ({councils = [], selectedTab = null, onSave = {}, accordionAction = {}, accordionInvite = {}, accordionCancel = {}, accordionNameClick = {}}) => {
    const { t } = useTranslation()

    const handlerAccordion = (e, id) => {
        // accordionAction(e, id)
    }

    const onHandlerInvite = (e, id) => {
        accordionInvite(e, id)
    }

    const onHandlerCancel = (e, id) => {
        accordionCancel(e, id)
    }

    const onHandlerNameClick = (e, id) => {
        accordionNameClick(e, id)
    }

    const calculateButton = (type, object) => {
        if(type == 'OPEN'){
            return (
                <button type="button" className="btn btn-primary fs-14" onClick={(e) => onHandlerInvite(e, object)}>
                    {t('council.invite')}
                </button>
            )
            
        } else if(type == 'MEMBER'){
            if(object.recruitingId){
                return (
                    <button type="button" className="btn btn-danger fs-14" onClick={(e) => onHandlerCancel(e, object)}>
                        {t('common.cancel')}
                    </button>
                )
            }
        }

        return null
    }

    const Items = ({ list = [] }) => {
        return list.map((obj, index) => {
            return (
                <Grid key={index} item md={12} xs={12}>
                    <Accordion
                        // expanded={obj?.isExpand || false}
                        // onChange={(e) => handlerAccordion(e, obj.id)}
                        className="accordion-container-regular council-accordion"
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id={obj.id}
                            className="accordion-header d-flex justify-content-between"
                        >
                            <ul className="list-group">
                                <li className="d-flex justify-content-between align-items-center mt-2 mb-2" style={{width: 'max-content'}}>
                                    <div className="d-flex align-items-center">
                                        <img className="profile" alt={'council_' + index} src={obj.logo ? obj.logo : 'https://lxp-test.eschool.mn/images/placeholder.jpg'} width={120} height={120} style={{borderRadius: 6}}/>
                                        <div className="fs-13 ms-3">
                                            <span className='d-block main-color fs-18 mb-3' style={{fontWeight: 700}} onClick={(e) => onHandlerNameClick(e, obj)}>{obj?.name?.toUpperCase() || '-'}</span>
                                            <span className='d-block black-color fs-16' style={{fontWeight: 400}}>{t('council.totalCount') + ': ' + (obj?.totalStudentCount || '-')}</span>
                                            <span className='d-inline black-color fs-16' style={{fontWeight: 400}}>{t('council.openTotalCount') + ': '} <div className='red-color d-inline'>{(obj?.recruitingStudentCount || '-')}</div></span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <Typography  sx={{ width: '100%' }}>
                                <div className='col-12 d-flex justify-content-end align-items-center h-100'>
                                    {calculateButton(selectedTab, obj)}
                                </div>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{padding: '0 1.5rem 1.5rem 1.5rem'}}>
                            <div dangerouslySetInnerHTML={{ __html: obj.description || '' }} />
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            )
        })
    }

    return (
        <>
            <Grid container spacing={2} className='mb-3'>
                <Items list={councils} />
            </Grid>
        </>
    )
}

export default ListItems