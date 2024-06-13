import React from "react";
import { Col, Row } from "react-bootstrap";

export default function LineGraphSingle({
  value = 0,
  title = "",
  className,
}) {
  return (
    <Row className={`align-items-center ${className}`}>
      <Col sm={8} md={5}>
        <div
          className="icon-14 font-bold font-heading mr-4 html-content-container"
          style={{ color: "black" }}
          dangerouslySetInnerHTML={{ __html: title.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') }} />
      </Col>
      <Col sm={4} md={7} className="d-flex flex-row align-items-center">
        <div
          style={{
            borderRadius: 12,
            height: 10,
            width: 120 * (parseInt(value) / 100),
            backgroundColor: value > 60 ? "#3EBFA3" : "#E02020",
          }}
        />
        <div style={{ fontSize: 12, color: "#868AA8", marginLeft: 4 }}>
          {value}%
        </div>
      </Col>
    </Row>
  );
}
