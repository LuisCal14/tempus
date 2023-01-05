import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../css/crudtable.css";
import ModalEmployee from "../../components/modalswindows/ModalEmployee";

function Usertable() {
    //Ventana Modal
    const [showModal, setShowModal] = useState(false);
const [employeeName, setEmployeeName] = useState("");
const [employeeLastName, setEmployeeLastName] = useState("");
const [employeeIdNumber, setEmployeeIdNumber] = useState("");
const [employeeCellphone, setEmployeeCellphone] = useState("");
const [employeeEmail, setEmployeeEmail] = useState("");



  //Tomar datos de la base de datos

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:8000/employees");

      setEmployees(res.data);
    }
    fetchData();
  }, []);

  async function handleCreate(employee) {
    const res = await axios.post("http://localhost:8000/employees", employee);
    setEmployees([...employees, res.data]);
  }

  async function handleUpdate(employee) {
    const response = await axios.put(
      `http://localhost:8000/employees/${employee.id}`,
      employee
    );
    const updatedEmployees = employees.map((r) => {
      if (r.id === employee.id) {
        return response.data;
      }
      return r;
    });
    setEmployees(updatedEmployees);
  }

  async function handleDelete(id) {
    try {
      await axios.delete("http://localhost:8000/employees/" + id);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  //Aqui declaro el elementRef para cambiar atributos de el elemento seleccionado (Buscador)
  const elementRef = useRef(null);

  //Para que expanda y cierre al hacerle click
  const handleSearch = () => {
    if (!elementRef.current.classList.contains("inSearch")) {
      elementRef.current.classList.add("inSearch");
    } else elementRef.current.classList.remove("inSearch");
  };

  //Habilita el elemento del buscador
  const [isDisabled, setIsDisabled] = useState(true);
  const disableSearch = () => {
    isDisabled
      ? (elementRef.current.style.color = "var(--black1)")
      : (elementRef.current.style.color = "transparent");
    setIsDisabled(!isDisabled);
  };

  //Recopilando funciones en una sola
  function searchEvents() {
    handleSearch();
    disableSearch();
  }

  //Buscar los datos
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearched = event => {
      setSearchTerm(event.target.value);
      
    
  };

  const filteredData = employees.filter((row) => {
    
    return (
      row._name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row._lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row._email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row._idEmployee.toString().includes(searchTerm)||
      row._idNumber.toString().includes(searchTerm)

    );
  });







  return (
    <>
      
      <div className="crudContainer">
        <button
          className="createButton"
          onClick={() => setShowModal(true)}
        >
            {showModal ? (
  <div className="modal">
    {/* Contenido de la modal aquí */}
  </div>
) : null}
          <i class="fa-solid fa-circle-plus fa-xl" /> Create
        </button>
        <input
          type="text"
          name="search"
          id="crudSearch"
          className="crudSearch "
          ref={elementRef}
          disabled={isDisabled}
          value={searchTerm}
        onChange={handleSearched}
        />

        <i
          class="fa-solid fa-magnifying-glass fa-xl searchIcon"
          onClick={searchEvents}
        />
        <div className="table-container">
          <table className="crudTable">
            <thead>
              <tr>
                <th className="tableHeader">ID</th>
                <th className="tableHeader">Name</th>
                <th className="tableHeader">Lastname</th>
                <th className="tableHeader">ID Number</th>
                <th className="tableHeader">Cellphone</th>
                <th className="tableHeader">Email</th>
                <th className="tableHeader">Actions</th>
              </tr>
            </thead>
            <tbody>
              { filteredData.length === 0
                ? (
                  <tr>
                    <td className="noDataCell" colSpan={7}>No data</td>

                  </tr>
                )
                : filteredData.map((employee) => (
                <tr key={employee._idEmployee}>
                  <td >{employee._idEmployee ? employee._idEmployee : 'no data' }</td>
                  <td >{employee._name? employee._name : 'nodata'  }</td>
                  <td >{employee._lastName}</td>
                  <td >{employee._idNumber}</td>
                  <td >{employee._cellphone}</td>
                  <td >{employee._email}</td>

                  <td>
                    <button
                      className="crudButton edit"
                      onClick={() => handleUpdate(employee)}
                    >
                      <i class="fa-solid fa-pen-to-square fa-xl" />
                      Edit
                    </button>
                    <button
                      className="crudButton delete"
                      onClick={() => handleDelete(employee._idEmployee)}
                    >
                      <i class="fa-solid fa-trash fa-xl" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Usertable;
