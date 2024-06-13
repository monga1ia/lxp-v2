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

const ListItems = ({plans = [], onSave = {}, accordionAction = {}, editAction = {}, inputAction = {}, backAction = {}}) => {
    const { t } = useTranslation()

    const handlerAccordion = (e, id) => {
        accordionAction(e, id)
    }

    const calculateIcon = (estimatedScore, takenScore, hasScore, type, maxScore, object) => {
        if(!takenScore){
            takenScore = 0
        }

        if(!estimatedScore){
            estimatedScore = 0
        }

        if(hasScore){
            if(estimatedScore > 0 && estimatedScore < takenScore){
                return (<Star className='mr-2' color="green" size={24} />)
            } else if (estimatedScore > 0 && estimatedScore == takenScore){
                return (<Smile className='mr-2' color="green" size={24} />)
            } else if (estimatedScore > takenScore){
                return (<Frown className='mr-2' color="red" size={24} />)
            }
        }

        return null
    }

    const calculateIconTotal = (estimatedScore, takenScore, hasScore) => {
        if(!takenScore){
            takenScore = 0
        }

        if(!estimatedScore){
            estimatedScore = 0
        }
        
        if(hasScore){
            if(estimatedScore > 0 && estimatedScore < takenScore){
                return (<Star className='mr-2' color="green" size={24} />)
            } else if (estimatedScore > 0 && estimatedScore == takenScore){
                return (<Smile className='mr-2' color="green" size={24} />)
            } else if (estimatedScore > takenScore){
                return (<Frown className='mr-2' color="red" size={24} />)
            }
        }

        return null
    }

    const handlerInput = (e, index, object) => {
        inputAction(e, index, object)
    }

    const handlerEdit = (object) => {
        editAction(object)
    }

    const isInt = (n) => {
        return Number(n) === n && n % 1 === 0;
    }
    
    const isFloat = (n) => {
        return Number(n) === n && n % 1 !== 0;
    }

    const checkIsFloat = (n) => {
        if(n && n > 0){
            let result = n.split('.');

            if(result.length == 2){
                if(result[1] > 0){
                    return true    
                } else {
                    return false
                }
            } else {
                return true
            }
        }
        
        return false
    }

    const handlerBack = (object) => {
        backAction(object)
    }

    const calculateBackgroundColor = (hasExam, type, estimatedScore, takenScore, maxScore) => {
        if(!takenScore){
            takenScore = 0
        }

        if(!estimatedScore){
            estimatedScore = 0
        }

        if(hasExam){
            if(estimatedScore > 0 && estimatedScore > takenScore){
                return 'red-background'
            } else {
                return 'green-background'
            }
        }

        return ''
    }

    const renderTable = (object, list) => {
        if(object.hasPlan && !object.isEdit){ 
            let totalScore = 0
            let planTotalScore = 0
            let studentTotalScore = 0
            if(list && list.length > 0){
                for(let i = 0; i < list.length; i++){
                    totalScore = totalScore + parseFloat(list[i].maxScore)
                    if(list[i].estimatedScore){
                        planTotalScore = planTotalScore + parseFloat(list[i].estimatedScore)
                    }
                    
                    if(list[i].takenScore){
                        studentTotalScore = studentTotalScore + parseFloat(list[i].takenScore)
                    }
                }

                if(object.viewType == 'PERCENTAGE'){
                    planTotalScore = planTotalScore / list.length
                    studentTotalScore = studentTotalScore / list.length
                }
            }

            return (
                <>
                    <div className='col-12' style={{color: '#101214'}}>
                        {
                            !object.hasExam &&
                            <button type="button" className="btn btn-primary" onClick={() => handlerEdit(object)}>
                                {t('common.edit')}
                            </button>
                        }
                        <table className='center' style={{marginLeft: 'auto', marginRight: 'auto', lineHeight: 2.8, borderCollapse: 'separate', borderSpacing: '0 0.2em'}}>
                            <thead>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td className='pr-6'>{t('common.planned')}</td>
                                    {
                                        object.hasExam &&
                                        <td>{t('common.performance')}</td>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    list.map((data, i) => {
                                        return (
                                            <tr key={'table_' + i} className={calculateBackgroundColor(object.hasExam, object.viewType, parseFloat(data?.estimatedScore), parseFloat(data?.takenScore), parseFloat(data?.maxScore))}>
                                                <td style={{paddingRight: 100}}>{data.itemName}</td>
                                                <td style={{paddingRight: 30}}>{checkIsFloat(data?.maxScore) == true ? data?.maxScore : parseInt(data?.maxScore)}</td>
                                                <td className='text-center'>{checkIsFloat(data?.estimatedScore) == true ? data?.estimatedScore : (data?.estimatedScore > 0 ? parseInt(data?.estimatedScore) : 0)}{object.viewType == 'PERCENTAGE' ? '%' : ''}</td>
                                                {
                                                    object.hasExam &&
                                                    <td className='text-center'>{checkIsFloat(data?.takenScore) == true ? data?.takenScore : (data?.takenScore > 0 ? parseInt(data?.takenScore) : 0)}{object.viewType == 'PERCENTAGE' ? '%' : ''}</td>
                                                }
                                                {
                                                    object.hasExam &&
                                                    <td className='text-right' style={{paddingLeft: 30}}>{calculateIcon(parseFloat(data?.estimatedScore), parseFloat(data?.takenScore), object.hasExam, object.viewType, parseFloat(data?.maxScore), object)}</td>
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                            <tfoot>
                                <tr className={object.hasExam ? (planTotalScore > studentTotalScore ? 'red-background' : 'green-background') : ''}>
                                    <td style={{paddingRight: 100}}><b>{t('common.total')}</b></td>
                                    <td><b>{totalScore}</b></td>
                                    <td className='text-center'><b>{planTotalScore}{object.viewType == 'PERCENTAGE' ? '%' : ''}</b></td>
                                    {
                                        object.hasExam &&
                                        <td className='text-center'><b>{studentTotalScore}{object.viewType == 'PERCENTAGE' ? '%' : ''}</b></td>
                                    }
                                    {
                                        object.hasExam &&
                                        <td className='text-right'>{calculateIconTotal(parseFloat(planTotalScore), parseFloat(studentTotalScore), object.hasExam)}</td>
                                    }
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </>
            )
        } else {
            let totalScore = 0
            let studentTotalScore = 0
            if(list && list.length > 0){
                let td = [];
                for(let i = 0; i < list.length; i++){
                    if(list[i].maxScore){
                        totalScore = totalScore + parseFloat(list[i].maxScore)
                    }
                    
                    if(list[i].estimatedScore){
                        studentTotalScore = studentTotalScore + parseFloat(list[i].estimatedScore)
                    }
                }

                if(object.viewType == 'PERCENTAGE'){
                    studentTotalScore = studentTotalScore / list.length
                }

                list.map((data, i) => {
                    td.push(
                        <tr key={'table_' + i}>
                            <td style={{paddingRight: 100}}>{data.itemName}</td>
                            <td style={{paddingRight: 30}}>{data.maxScore}</td>
                            <td style={{display: 'inline-flex'}}>
                                <input 
                                    type='number' 
                                    className='form-control' 
                                    style={{width: 80, height: 30}} 
                                    onWheel={(e) => e.target.blur()}
                                    onChange={(e) => handlerInput(e, i, object)}
                                    value={checkIsFloat(data?.estimatedScore) == true ? data?.estimatedScore : (parseInt(data?.estimatedScore) > 0 ? parseInt(data?.estimatedScore) : '')}
                                    autoFocus={data?.isFocus || false}
                                    disabled={object.hasExam ? true : false}
                                />
                                {object.viewType == 'PERCENTAGE' ? <div className='ml-2'>%</div> : ''}
                            </td>
                        </tr>
                    )
                })

                return (
                    <>
                        <div className='col-12' style={{color: '#101214'}}>
                            {
                                !object.hasExam && object.isEdit &&
                                <button type="button" className="btn btn-link" onClick={() => handlerBack(object)}>
                                    {t('common.back')}
                                </button>
                            }
                            <table className='center' style={{marginLeft: 'auto', marginRight: 'auto', lineHeight: 2.8}}>
                                <thead>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div className="mb-1 btn-group btn-group-sm study-plan-button-group">
                                                <button type="button" className="btn btn-primary" 
                                                    // onClick={() => handlerButtonGroup(object, 'PERCENTAGE')}
                                                >
                                                    <span className={object.viewType == 'PERCENTAGE' ? 'active' : ''}>
                                                        {t('common.percent')}
                                                    </span>
                                                </button>
                                                <button type="button" className="btn btn-primary" 
                                                    // onClick={() => handlerButtonGroup(object, 'SCORE')}
                                                >
                                                    <span className={object.viewType == 'SCORE' ? 'active' : ''}>
                                                        {t('common.score')}
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {td}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td style={{paddingRight: 100}}><b>{t('common.total')}</b></td>
                                        <td><b>{totalScore}</b></td>
                                        <td className='text-right' style={{position: 'relative', right: 15}}><b>{studentTotalScore}{object.viewType == 'PERCENTAGE' ? '%' : ''}</b></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {
                            object.hasExam 
                            ?
                                <div className='col-12 text-center mt-4'>
                                    <p><b>{t('errorMessage.hasExamStudyPlanText')}</b></p>
                                </div>
                            :
                            <div className='col-12 text-center mt-4'>
                                <Button className="cursor-pointer" variant='primary' onClick={() => onSave(object)}>
                                    {t("common.save")}
                                </Button>
                            </div>
                        }
                    </>
                )
            }

            return (
                <div className='col-12 text-center'>
                    <b>{t("errorMessage.noStudyPlanText")}</b>
                </div>  
            )
        }
    }

    const Items = ({ list = [] }) => {
        return list.map((obj, index) => {
            return (
                <Grid key={index} item md={12} xs={12}>
                    <Accordion
                        expanded={obj?.isExpand || false}
                        onChange={(e) => handlerAccordion(e, obj.id)}
                        className="accordion-container-regular"
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            className="accordion-header"
                        >
                            {
                                obj.hasExam
                                ?
                                    <Target className='mr-2' color="green" size={24} />
                                :
                                    <div className='mr-2' style={{width: 23}}/>
                            }
                            <Typography>
                                <span>{obj.subjectCode} <b>{obj.subjectName}</b> | {obj.teacherFirstname}</span>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className="p-5">
                            {renderTable(obj, obj?.details || [])}
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            )
        })
    }

    return (
        <>
            <Grid container spacing={2} className='mb-3'>
                <Items list={plans} />
            </Grid>
        </>
    )
}

export default ListItems