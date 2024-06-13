import React from 'react'
import { Card } from 'react-bootstrap'

const Body = ({children, className = ''}) => {
    return (
        <Card className={className}>
            <Card.Body>
                {children}
            </Card.Body>
        </Card>
    )
}

export default Body
