import React, {useEffect, useState, useRef} from 'react'
import { Button, Card, Col, Image, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ReactAudioPlayer from 'react-audio-player';
import Glide from "components/carousel/Glide";
import ReactFlipCard from 'reactjs-flip-card'
import { height } from '@mui/system';

const styles = {
    card: {background: 'blue', color: 'white', borderRadius: 20,},
}

const DialogCards = ({children = [], isStudent = false, index = 0}) => {
    const { t, i18n } = useTranslation()
    const [cards, setCards] = useState([])
    const [updateView, setUpdateView] = useState(false)
    const [selectedChildIndex, setSelectedChildIndex] = useState(null)
    const frontRef = useRef([])
    const backRef = useRef([])

    useEffect(() => {
        setCards(children || [])
    }, [children])

    const onDialogCardFlip = (index) => {
        const dialogCards = [...cards];
        if (dialogCards && dialogCards.length > 0) {
            dialogCards[index].flip = !dialogCards[index].flip;
        }
        setCards(dialogCards)
        setUpdateView(!updateView)
    }

    const onHandlerFlip = (index) => {
        setSelectedChildIndex(index)
    }

    const renderBackImg = (dialogCardObj, onlyText) => {
        if(dialogCardObj.backImage){
            return (
                <div className="mb-3" style={{height: 200}}>
                    <img
                        height={300}
                        className="profile"
                        alt={'backImg'}
                        src={dialogCardObj.backImage ? dialogCardObj.backImage : '/img/profile/placeholder.jpg'}
                    />
                </div>
            )
        } else {
            return null
        }
    }

    return (
        <Glide
            index={index}
            key={'glide_' + index}
            // className='mb-3'
            options={{
                perView: 1
            }}
            noDots={false}
            noControls={true}
            extraButton={children && children.length == 1 ? false : true}
            extraButtonPrevName={t('onlineLesson.prev')}
            extraButtonNextName={t('action.next')}
            selectedChildIndex={selectedChildIndex}
            children={children?.map((dialogCardObj, dIndex) => {
                let onlyText = false;

                if(!dialogCardObj.frontImage && !dialogCardObj.backImage){
                    onlyText = true
                }

                let maxHeight = 150

                let frontHeight = frontRef?.current[dIndex]?.clientHeight
                let backHeight = backRef?.current[dIndex]?.clientHeight

                if(frontHeight && backHeight && frontHeight > backHeight){
                    maxHeight = frontHeight
                } 
                if(frontHeight && backHeight && frontHeight < backHeight){
                    maxHeight = backHeight
                }

                return (
                    <li key={'glide_' + dialogCardObj.id + '_' + dIndex} className="glide__slide">
                        <div 
                            style={{height: maxHeight}}
                        >
                            <ReactFlipCard
                                containerStyle={{ width: '100%', height: '100%' }}
                                frontComponent={
                                    <Card style={{ border: '1px solid rgba(0,0,0,0.125)', height: '99%', width: '99%' }}>
                                        <Card.Body  ref={el => frontRef.current[dIndex] = el}  style={{ textAlign: 'center' }}>
                                            {
                                                !onlyText && dialogCardObj.frontImage 
                                                ?
                                                    <div className="mb-3">
                                                        <img
                                                            width={'100%'}
                                                            height={300}
                                                            className="w-100 object-fit-contain"
                                                            alt={'frontImg'}
                                                            src={dialogCardObj.frontImage ? dialogCardObj.frontImage : '/img/profile/placeholder.jpg'}
                                                        />
                                                    </div>
                                                :
                                                onlyText
                                                ?
                                                    <div></div>
                                                :
                                                    <div style={{height: 215}}/>
                                            }
                                            <div className="mb-3" style={{height: 60}}>
                                                {
                                                    dialogCardObj.frontAudio &&
                                                    <ReactAudioPlayer
                                                        controls
                                                        src={dialogCardObj.frontAudio}
                                                    />
                                                }
                                            </div>
                                            {
                                                dialogCardObj.frontIsTradition
                                                ?
                                                    <div className='col-12 d-flex justify-content-center'>
                                                        <div className='text-semi-large text-dark ml-2 tradition-text-no-width' dangerouslySetInnerHTML={{ __html: dialogCardObj.frontText }} style={{height: 'auto'}}/>
                                                    </div>
                                                :
                                                    <div dangerouslySetInnerHTML={{ __html: dialogCardObj.frontText }} />
                                            }
                                            {/* <p style={{height: 30}}>{dialogCardObj.frontText}</p> */}

                                            <button 
                                                className={dialogCardObj.frontIsTradition ? (isStudent ? 'btn btn-primary mt-3' : 'btn btn-success mt-3') : (isStudent ? 'btn btn-primary' : 'btn btn-success')}
                                                onClick={() => { onDialogCardFlip(dIndex) }}
                                            >
                                                {t('onlineLesson.check')}
                                            </button>
                                        </Card.Body>
                                    </Card>
                                }
                                backComponent={
                                    <Card style={{ border: '1px solid rgba(0,0,0,0.125)' }}>
                                        <Card.Body ref={el => backRef.current[dIndex] = el} style={{ textAlign: 'center' }}>
                                            {
                                                !onlyText && dialogCardObj.backImage 
                                                ?
                                                    <div className="mb-3">
                                                        <img
                                                            height={300}
                                                            className="w-100 object-fit-contain"
                                                            alt={'frontImg'}
                                                            src={dialogCardObj.backImage ? dialogCardObj.backImage : '/img/profile/placeholder.jpg'}
                                                        />
                                                    </div>
                                                :
                                                onlyText
                                                ?
                                                    <div></div>
                                                :
                                                    <div style={{height: 215}}/>
                                            }
                                            <div className="mb-3" style={{height: 60}}>
                                                {
                                                    dialogCardObj.backAudio &&
                                                    <ReactAudioPlayer
                                                        controls
                                                        src={dialogCardObj.backAudio}
                                                    />
                                                }
                                            </div>
                                            {
                                                dialogCardObj.backIsTradition
                                                ?
                                                    <div className='col-12 d-flex justify-content-center'>
                                                        <div className='text-semi-large text-dark ml-2 tradition-text-no-width' dangerouslySetInnerHTML={{ __html: dialogCardObj.backText }} style={{height: 'auto'}}/>
                                                    </div>
                                                :
                                                    <div dangerouslySetInnerHTML={{ __html: dialogCardObj.backText }} />
                                            }
                                            {/* <p style={{height: 30}}>{dialogCardObj.backText}</p> */}

                                            <button 
                                                className='btn btn-link pb-0 pt-0' 
                                                onClick={() => { onDialogCardFlip(dIndex) }}
                                            >
                                                {t('common.back')}
                                            </button>
                                        </Card.Body>
                                    </Card>
                                }
                                flipByProp={dialogCardObj?.flip || false}
                                direction='horizontal'
                                flipTrigger={'disabled'}
                                onClick={() => onHandlerFlip(dIndex)}
                            />
                        </div>
                    </li>
                )
            })
            }
        />
    )
}
export default DialogCards