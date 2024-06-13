import { React, useState, useEffect, useRef } from "react";
import { Modal, Button, Row } from "react-bootstrap";
import Checkbox from '@mui/material/Checkbox';
import Select from "modules/Form/Select";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import generator from "crossword-layout-generator";
import { makeStyles } from "@material-ui/core";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import message from 'modules/message';

const useStyles = makeStyles({
    rowLabel: {
        display: 'flex',
        width: '12%',
        justifyContent: 'flex-end',
        fontFamily: 'Mulish',
        position: 'relative',
        top: 4
    },
    rowComponent: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        width: 'auto',
        marginBottom: 10,
    },
    rowBlank: {
        display: 'flex',
        flex: 0.8,
        flexDirection: 'column',
        marginLeft: 10,
        width: 'auto',
    },
    rowBlankSmall: {
        display: 'flex',
        flex: 0.3,
        flexDirection: 'column',
        marginLeft: 10,
        width: 'auto',
    }
});

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}
  
const a11yProps = (index) => {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const CrosswordModal = ({
    onClose = () => { },
    show = false,
    onSave = () => {},
    data = []
}) => {
    const { t } = useTranslation();
    const style = useStyles();
    const [value, setValue] = useState(0);
    const [list, setList] = useState([
        {
            clue: '',
            answer: '',
            score: ''
        }
    ])

    useEffect(() => {
        if(data && data.length > 0){
            for(let i = 0; i < data.length; i++){
                delete data[i].row
                delete data[i].col
                delete data[i].orientation
                delete data[i].position
                delete data[i].startx
                delete data[i].starty
            }

            setList(data)
        }
    }, [data]);
    
    const onHandlerCrosswordWordAdd = () => {
        let cloneList = [...list]

        cloneList.push({
            clue: '',
            answer: '',
            score: ''
        })

        setList(cloneList)
    }
    
    const onHandlerCrosswordWordRemove = (index) => {
        const cloneList = [...list];
        cloneList.splice(index, 1);
        setValue(cloneList.length - 1);
        setList(cloneList)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const onHandlerClueChange = (e, index) => {
        let cloneList = [...list]
        cloneList[index].clue = e.target.value
        setList(cloneList)
    }

    const onHandlerAnswerChange = (e, index) => {
        let cloneList = [...list]
        if(e.target.value){
            cloneList[index].answer = e.target.value.toUpperCase()
        } else {
            cloneList[index].answer = ''
        }
        
        setList(cloneList)
    }

    const onHandlerScoreChange = (e, index) => {
        let cloneList = [...list]
        cloneList[index].score = e.target.value
        setList(cloneList)
    }

    const onSubmit = () => {
        if(list && list.length > 0){
            for(let i = 0; i < list.length; i++){
                if(!list[i].clue){
                    message(t('crossWord.errorMessage.errorClue'), false)
                    return
                }

                if(!list[i].answer){
                    message(t('crossWord.errorMessage.errorAnswer'), false)
                    return
                }
            }
        }

        if(list.length == 1){
            message(t('crossWord.errorMessage.errorLength'), false)
        }

        const layout = generator.generateLayout(list);
        let result = layout.result;

        if(result && result.length > 0){
            let lastClue = null
            for(let i = 0; i < result.length; i++){
                if(result[i].orientation == "none"){
                    lastClue = result[i].clue
                }
            }

            if(lastClue){
                let messageString = t('crossWord.errorMessage.errorNotMatch')
                message(messageString.replace('[clue]', lastClue), false)
                return
            }
        }

        onSave(list)
    }

    return (
        <Modal
            show={show}
            onHide={onClose}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-3">
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100" style={{ textTransform: 'none' }}>
                    {t('crossWord.addCrossword')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 400 }}>
                    <Tabs
                        className="crossword-tab-style"
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        {
                            list && list.length > 0 &&
                            list.map((data, index) => {
                                return(
                                    <Tab 
                                        className='cross-label-style'
                                        key={'tab_' + index} 
                                        label={data?.clue || 'Асуулт оруулна уу'}  
                                        icon={<RemoveCircleRoundedIcon onClick={() => onHandlerCrosswordWordRemove(index)}/>}
                                        iconPosition="end"
                                    />
                                )
                            })
                        }
                        <Tab 
                            key={'tab_#'}
                            className='cross-add-style'
                            icon={
                                <AddCircleOutlineRoundedIcon />
                            } 
                            onClick={onHandlerCrosswordWordAdd}
                            label={t('common.add')}
                            iconPosition="start"
                        />
                    </Tabs>
                    {
                        list && list.length > 0 &&
                        list.map((data, index) => {
                            return(
                                <TabPanel key={'tab_panel_' + index} value={value} index={index} className='w-100 crossword-tab-panel-style'>
                                    <div className='card-alternate'>
                                        <Row style={{ display: 'flex' }}>
                                            <label className={style.rowLabel}>
                                                {t('onlineExam.question') + '*'}
                                            </label>
                                            <div className={style.rowComponent}>
                                                <textarea
                                                    value={data.clue || ''}
                                                    className="form-control resize-vertical"
                                                    rows={5}
                                                    onChange={(e) => onHandlerClueChange(e, index)}
                                                />
                                            </div>
                                        </Row>
                                        <Row style={{ display: 'flex' }}>
                                            <label className={style.rowLabel}>
                                                {t('onlineLesson.answer') + '*'}
                                            </label>
                                            <div className={style.rowComponent}>
                                                <input
                                                    value={data.answer || ''}
                                                    className="form-control"
                                                    onChange={(e) => onHandlerAnswerChange(e, index)}
                                                />
                                            </div>
                                        </Row>
                                        <Row style={{ display: 'flex' }}>
                                            <label className={style.rowLabel}>
                                                {t('common.score')}
                                            </label>
                                            <div className={style.rowComponent}>
                                                <input
                                                    type='number'
                                                    value={data.score || ''}
                                                    className="form-control"
                                                    onChange={(e) => onHandlerScoreChange(e, index)}
                                                />
                                            </div>
                                        </Row>
                                    </div>
                                </TabPanel>
                            )
                        })
                    }
                </Box>
            </Modal.Body>
            <Modal.Footer className="p-3 text-center">
                <div style={{ display: 'flex', flexDirection: 'row', display: 'inline-block' }}>
                    <Button className="cursor-pointer cancel-button pr-4" variant='link' onClick={onClose}>
                        <span style={{ color: '#ff2f1a' }}>{t("common.back")}</span>
                    </Button>
                    <Button className="cursor-pointer save-button" variant='empty' onClick={onSubmit}>
                        <span style={{ color: '#555555' }}>{t("common.save")}</span>
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CrosswordModal;
