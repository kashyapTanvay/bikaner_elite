import { useState } from "react";
import Form from "react-bootstrap/esm/Form";
import styles from "./CreateUser.module.css";
const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passsword, setPassword] = useState("");
  const [contactNumber, setConatctNumber] = useState("");
  const [desgination, setDesignation] = useState("");

  return (
    <>
      <Form>
        <Form.Group>
          <Form.Label>
            Name{" "}
            {name?.length === 0 ||
              (name === "" && <span className={styles.required}>*</span>)}
          </Form.Label>
          <Form.Control
            type="text"
            name="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="text"
            name="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Contact Number</Form.Label>
          <Form.Control
            type="text"
            name="ConatctNumber"
            value={name}
            onChange={(e) => setConatctNumber(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Designation</Form.Label>
          <Form.Control
            type="text"
            name="Designation"
            value={name}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="text"
            name="Password"
            value={passsword}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default CreateUser;
