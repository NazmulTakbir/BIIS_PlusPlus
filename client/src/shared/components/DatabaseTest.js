import { Fragment, useState } from "react";

const DatabaseTest = () => {
  const [departments, setDepartments] = useState([]);

  const getDepartments = async () => {
    try {
      const response = await fetch("/depts");
      const jsonData = await response.json();

      setDepartments(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button className="btn btn-danger" onClick={() => getDepartments()}>
        Load Departments
      </button>
      <table class="table mt-5 text-center">
        <thead>
          <tr>
            <th>Dept ID</th>
            <th>Dept Name</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department.deptid}>
              <td>{department.deptid}</td>
              <td>{department.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default DatabaseTest;
