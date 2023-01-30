// import e from "express";
import React, { useState } from "react";
import { TabContainer, Row, Col, Form, Button, Table } from "react-bootstrap";

const GoProCheckOrder = () => {
  const [order, setOrder] = useState({
    nombre: "",
    nv: "",
    direccion: "",
    email: "",
    productos: "",
    date: "",
    delivery: "",
    order_id:""
  });
  const [input, setInput] = useState("");

  const handleChange = e => {
    setInput(e.target.value);
    // console.log(e.target.value)
  };

  const handleSubmit = async e => {
    // if(e.target.value === '') return
    e.preventDefault();
    const response = await fetch(`https://appleamaze.herokuapp.com/pe/v1/orders/gopro/${input}`);
    const data = await response.json();
    setOrder(data);

  };
const copyToClipboard = text => {
  navigator.clipboard.writeText(`Consulta el siguiente link para rastrear tu pedido:\nhttps://amaze.com.pe/rastrea-tu-pedido/\nNúmero de pedido es: ${text}`).then(
    function() {
      console.log("Copying to clipboard was successful!");
    },
    function(err) {
      console.error("Could not copy text: ", err);
    }
  );
};
const address = order.direccion.substring(0,35) + '...'
const fecha = order.date.split('T')[0]
  return (
    
    <TabContainer>
        <Row className="justify-content-md-center">
            <Col xs={6}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formOrderId">
                        <Form.Label><b>Ingresa número de pedido</b></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            // value={order.order_id}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <br></br>
                    <Button variant="primary" type="submit">
                        Buscar 
                    </Button>
                    
                    <br></br>
                </Form>
            </Col>
        </Row>
        <br></br>
            <Row className="justify-content-md-center">
                <Col xs={6}>
                    <Table bordered>
                        <tbody>
                            <tr>
                                <td><b>Order:</b></td>
                                <td>{order.order_id}</td>
                            </tr>
                             <tr>
                                <td><b>Guía:</b></td>
                                <td>
                                    {order.delivery
                                        ? order.delivery
                                        : "Sin Guía"}
                                </td>
                            </tr>
                            <tr>
                                <td><b>Ingram Order:</b></td>
                                <td>{order.nv}</td>
                            </tr>
                            <tr>
                                <td><b>Date:</b></td>
                                <td>{fecha}</td>
                            </tr>
                            <tr>
                                <td><b>Productos:</b></td>
                                <td>{order.productos}</td>
                            </tr>
                            <tr>
                                <td><b>Correo:</b></td>
                                <td>{order.email}</td>
                            </tr>
                            <tr>
                                <td><b>Dirección:</b></td>
                                <td>{address} </td>
                            </tr>
                            <tr>
                                <td><b>Nombre:</b></td>
                                <td>{order.nombre}</td>
                            </tr>
                           
                        </tbody>
                    </Table>
                    <Button variant="outline-secondary" onClick={() => copyToClipboard(order.delivery)}>Copiar Link</Button>
                </Col>
            </Row>
       <Row>
       {/* <div id="beetrack_widget" lang="es" api-key="GD3mFb3t9GxfSIOFI6a-Lw"></div> <script type="text/javascript" charset="UTF-8" language="javascript" src="https://beetrack-general.s3-us-west-2.amazonaws.com/widget/GD3mFb3t9GxfSIOFI6a-Lw.json"></script> <script async src="https://app.beetrack.cl/javascript_widget/beetrack_widget.js"></script> */}

       </Row>
    </TabContainer>
);


};

export default GoProCheckOrder;
