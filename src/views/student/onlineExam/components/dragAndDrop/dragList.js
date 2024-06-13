import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import WestIcon from '@mui/icons-material/West';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModal from "../../modal/ViewModal";

export const DragList = ({ id, name, path, equation, type }) => {
    const [selectedPath, setSelectedPath] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const [{ isDragging }, dragRef] = useDrag({
        type: 'dnd',
        item: { id, name, path, type, equation },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    const onViewHandler = (image) => {
        setSelectedPath(image)
        setShowModal(true)
    }

    const render = (type) => {
        if(type == 'text'){
            return (
                <div className='drag-list-style' ref={dragRef} style={{maxWidth: 250, height: 'max-content', minHeight: 80}}>
                    <div style={name.length > 25 ? {minWidth: 240} : {minWidth: name.length * 8}}>{name}</div>
                    {/* {isDragging && <WestIcon fontSize='small' />} */}
                </div>
            )
        } else if(type == 'image'){
            return (
                <div ref={dragRef} style={{marginRight: 15}}>
                    <img className='drag-list-path-style' src={path} height={80} width={80}/>
                    <VisibilityIcon fontSize='small cursor' style={{position: 'relative', bottom: 90, left: 70}} onClick={() => onViewHandler(path)}/>
                    {/* {isDragging && <WestIcon fontSize='small'/>} */}
                </div>
            )
        } else if(type == 'equation'){
            return (
                <div className='drag-list-style' ref={dragRef} style={{maxWidth: 250, width: '100%', height: 'max-content', minHeight: 80}}>
                    <div dangerouslySetInnerHTML={{ __html: name }} style={name.length > 40 ? {minWidth: 240} : {minWidth: name.length * 5}}/>
                    {/* {isDragging && <WestIcon fontSize='small'/>} */}
                </div>
            )
        } else if(type == 'mbscript') {
            return (
                <div className='drag-list-style' ref={dragRef} style={{maxWidth: 250, width: '100%', height: 'max-content', minHeight: 80}}>
                    <div className='text-semi-large text-dark tradition-text tradition-text-student' dangerouslySetInnerHTML={{ __html: name }}/>
                    {/* {isDragging && <WestIcon fontSize='small'/>} */}
                </div>
            )
        }
    }

    return (
        <>
            {render(type)}
            {
                showModal &&
                <ViewModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false)
                    }}
                    path={selectedPath}
                />
            }
        </>
    )
}