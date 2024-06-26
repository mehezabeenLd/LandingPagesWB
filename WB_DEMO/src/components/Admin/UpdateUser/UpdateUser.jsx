import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faSave } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./UpdateUser.css";
import SideBar from "../../SideBar/SideBar";



import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function UpdateUser() {
  const location = useLocation();
  const user = location.state;
  console.log(user);
  const [userId, setuserId] = useState(user.userId);
  const [firstName, setFirstName] = useState(user.firstName);
  const [middleName, setMiddleName] = useState(user.middleName);
  const [lastName, setLastName] = useState(user.lastName);
  const [role, setRole] = useState(user.role);
  const [emailId, setemailId] = useState(user.emailId);
  const [emailError, setEmailError] = useState("");
  const [contactNoError, setContactNoError] = useState("");
  const [contactNo, setcontactNo] = useState(user.contactNo);
  const [company, setcompany] = useState(user.company);
  const [site, setsite] = useState(user.site);
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/company/names")
      .then((response) => response.json())
      .then((data) => {
        console.log("Company List:", data);
        setCompanies(data);
      })
      .catch((error) => {
        console.error("Error fetching company list:", error);
      });

    fetchSiteList(user.company);
  }, [user.company]);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/roles/get/all/role")
      .then((response) => response.json())
      .then((data) => {
        console.log("Roles List:", data);
        const filteredRoles = data.filter((role) => role !== "ADMIN");
        setRoles(filteredRoles);
      })
      .catch((error) => {
        console.error("Error fetching roles list:", error);
      });
  }, []);

  const fetchSiteList = (selectedCompany) => {
    fetch(`http://localhost:8080/api/v1/sites/company/${selectedCompany}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Site List:", data);
        const formattedSites = data.map((site) => ({
          site: `${site.siteName},${site.siteAddress}`,
          siteId: site.siteId,
        }));
        setSites(formattedSites);
      })
      .catch((error) => {
        console.error("Error fetching site list:", error);
      });
  };

  const handleCompanyChange = (e) => {
    setcompany(e.target.value);
    fetchSiteList(e.target.value);
  };

  const handleClear = () => {
    navigate("/manage-user");
  };

  const handleSave = () => {
    let emailIsValid = true;
    let phoneIsValid = true;

    if (
      role.length === 0 ||
      company.trim() === "" ||
      site.trim() === "" ||
      contactNo.trim() === "" ||
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      emailId.trim() === ""
    ) {
      Swal.fire({
        title: "Please fill in all the required fields.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      setEmailError("Please enter a valid email address.");
      emailIsValid = false;
    } else {
      setEmailError("");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactNo)) {
      setContactNoError("Please enter a valid 10-digit phone number.");
      phoneIsValid = false;
    } else {
      setContactNoError("");
    }

    if (!emailIsValid || !phoneIsValid) {
      return;
    }

    const userData = {
      userId,
      site,
      company,
      emailId,
      contactNo,
      role,
      firstName,
      middleName,
      lastName,
    };

    fetch(`http://localhost:8080/api/v1/users/updateUser/${user.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          // Check if the response is JSON or text
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            // If the response is JSON, parse it as JSON
            return response.json();
          } else {
            // If the response is text, return the text
            return response.text();
          }
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        // Determine the title for the SweetAlert modal
        const title =
          typeof data === "string" ? data : "User Updated Successfully!";

        navigate("/manage-user");
        Swal.fire({
          title: title,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
        // Optionally, show an error message to the user
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      });
  };

  const handleRoleChange = (selectedRole) => {
    if (role.includes(selectedRole)) {
      setRole(role.filter((r) => r !== selectedRole));
    } else {
      setRole([...role, selectedRole]);
    }
  };

  const handleSelectAllRoles = () => {
    if (role.length === roles.length) {
      setRole([]);
    } else {
      setRole([...roles]);
    }
  };

  return (
    <SideBar>
      <div className="update-user">
        <div className="update-main-content container-fluid">
          <h2 className="text-center">Update User</h2>
          <div className="update-user-container">
            <div className="card update-user-form">
              <div
                className="card-body"
                style={{ backgroundColor: "rgb(243,244,247)" }}
              >
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="userId" className="form-label">
                        User ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="userId"
                        placeholder="Enter User ID"
                        value={userId}
                        onChange={(e) => setuserId(e.target.value)}
                        required
                        disabled
                      />
                    </div>
                    {/* <div className="col-md-6">
                    <label htmlFor="userStatus" className="form-label">
                      Status
                    </label>
                    <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                    <select
                      className="form-select"
                      id="userStatus"
                      value={userStatus}
                      onChange={(e) => setuserStatus(e.target.value)}
                      required
                      
                    >
                      <option value="" selected disabled>Select Status</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div> */}
                    <div className="col-md-6">
                      <label htmlFor="role" className="form-label">
                        Role
                      </label>
                      <span style={{ color: "red", fontWeight: "bold" }}>
                     {" "}*
                      </span>
                      <div className="d-flex gap-2">
                        <div className="d-flex flex-wrap gap-2">
                          {role.map((r, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center bg-secondary text-white px-2 py-1 rounded"
                            >
                              <span className="me-2">{r}</span>
                              <FontAwesomeIcon
                                icon={faEraser}
                                className="cursor-pointer"
                                onClick={() => handleRoleChange(r)}
                              />
                            </div>
                          ))}
                          <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownRole"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Select Roles
                          </button>
                          <ul className="dropdown-menu" aria-labelledby="dropdownRole">
                            {roles.map((r, index) => (
                              <li key={index}>
                                <label className="dropdown-item">
                                  <input
                                    type="checkbox"
                                    onChange={() => handleRoleChange(r)}
                                    checked={role.includes(r)}
                                  />
                                  {r}
                                </label>
                              </li>
                            ))}
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <label className="dropdown-item">
                                <input
                                  type="checkbox"
                                  onChange={handleSelectAllRoles}
                                  checked={role.length === roles.length}
                                />
                                Select All Roles
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <span style={{ color: "red", fontWeight: "bold" }}>
                     {" "}*
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        placeholder="Enter First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="middleName" className="form-label">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="middleName"
                        placeholder="Enter Middle Name"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <span style={{ color: "red", fontWeight: "bold" }}>
                     {" "}*
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        placeholder="Enter Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="emailId" className="form-label">
                        Email Id
                      </label>
                      <span style={{ color: "red", fontWeight: "bold" }}>
                     {" "}*
                      </span>
                      <input
                        type="emailId"
                        className={`form-control ${emailError && "is-invalid"}`}
                        id="emailId"
                        placeholder="Enter email address"
                        value={emailId}
                        onChange={(e) => setemailId(e.target.value)}
                      />
                      {emailError && (
                        <div className="invalid-feedback">{emailError}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="contactNo" className="form-label">
                        Mobile Number
                      </label>
                      <span style={{ color: "red", fontWeight: "bold" }}>
                     {" "}*
                      </span>
                      <input
                        type="tel"
                        className={`form-control ${contactNoError && "is-invalid"
                          }`}
                        id="contactNo"
                        placeholder="Enter Mobile Number"
                        value={contactNo}
                        onChange={(e) => setcontactNo(e.target.value)}
                        pattern="\d{10}"
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(/\D/g, ""))
                        }
                        title="Please enter 10 numbers"
                        maxLength="10"
                        required
                      />
                      {contactNoError && (
                        <div className="invalid-feedback">{contactNoError}</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="company" className="form-label">
                        Company Name
                      </label>
                      <span style={{ color: "red", fontWeight: "bold" }}>
                     {" "}*
                      </span>
                      <select
                        className="form-select"
                        id="company"
                        value={company}
                        onChange={handleCompanyChange}
                        required
                      >
                        <option value="">Select Company Name</option>
                        {companies.map((c, index) => (
                          <option key={index} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="site" className="form-label">
                        Site Name
                      </label>
                      <span style={{ color: "red", fontWeight: "bold" }}>
                     {" "}*
                      </span>
                      <select
                        className="form-select"
                        id="site"
                        value={site}
                        onChange={(e) => setsite(e.target.value)}
                        required
                      >
                        <option value="">Select Site Name</option>
                        {sites.map((s, index) => (
                          <option key={index} value={s.siteId}>
                            {s.site}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3"></div>
                </form>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    className="btn btn-danger me-4 btn-hover"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid #cccccc",
                       
                      width: "100px",

                      // transition: "transform 0.3s ease-in-out",
                    }}
                    onClick={handleClear}
                  >
                    <FontAwesomeIcon icon={faEraser} className="me-1" />
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-success-1 btn-hover"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                       
                      border: "1px solid #cccccc",
                      width: "100px",

                      // transition: "transform 0.3s ease-in-out",
                    }}
                    onClick={handleSave}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default UpdateUser;
