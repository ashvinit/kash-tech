import React, { useState, useRef, useEffect } from "react";
import AlertMessage from "../components/AlertMessage";
import { Link } from "react-router-dom";
import { domain } from "../assets/api/apiEndpoints";
import "../assets/styles/Styles.css";

function AddProject(props) {
  // let projectNameInput = useRef();
  let projectType;
  let projectSOWId;
  let projectStatus;
  let projectStartDate;
  let projectEndDate;
  let projectEstimatedHours;
  let selectedCompany;
  let selectedCompanyId;
  let projectSOWIDEXistsArr = [];
  let projectTypeInput = useRef();
  let statementOfWorkIdInput = useRef();
  let projectStatusInput = useRef();
  let projectStartDateInput = useRef();
  let projectEndDateInput = useRef();
  let estimatedHoursInput = useRef();
  let selectedCompanyInput = useRef();
  let selectedCompanyOption = useRef();
  let confirmationSubmitDialoguePopup = useRef();
  let addProjectForm = useRef();
  let confirmationCompanyName = useRef();
  let confirmationProjectType = useRef();
  let confirmationProjectSOWId = useRef();
  let alertMessage = useRef();
  let [message, setMessage] = useState("");
  let [allCompanyAdminsArr, setAllCompanyAdminsArr] = useState([]);
  let [allProjectsArr, setAllProjectsArr] = useState([]);
  let [allCompaniesArr, setAllCompaniesArr] = useState([]);

  // useEffect to get (POST) companies from database and add to allCompanies state array
  useEffect(() => {
    if (props.loggedInUser.AdminLevel === "Super Admin") {
      getCompanies();
    } else {
      getCompaniesByCompAdmin();
    }

    // load projects to make sure that duplicate SOW IDs are not created
    getProjects();
  }, []);

  const getCompanies = () => {
    fetch(`${domain}GenericResultBuilderService/buildResults`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _keyword_: "KASH_OPERATIONS_COMPANY_TABLE" }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setAllCompaniesArr(res.data);
      })
      .catch((err) => {
        setMessage(
          alertMessageDisplay(
            `Unable to load companies from database. Error: ${err}`
          )
        );
        alertMessage.current.showModal();
      });
  };

  const getCompaniesByCompAdmin = () => {
    fetch(`${domain}GenericResultBuilderService/buildResults`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _keyword_: "COMPANY_BY_COMPANY_ADMIN_TABLE",
        EmpId: props.loggedInUser.EmpId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setAllCompaniesArr(res.data);
      })
      .catch((err) => {
        setMessage(
          alertMessageDisplay(
            `Unable to load companies from database. Error: ${err}`
          )
        );
        alertMessage.current.showModal();
      });
  };

  const getProjects = () => {
    fetch(`${domain}GenericResultBuilderService/buildResults`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _keyword_: "KASH_OPERATIONS_CREATED_PROJECTS_TABLE",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setAllProjectsArr(res.data);
      })
      .catch((err) => {
        setMessage(
          alertMessageDisplay(
            `Unable to load projects from database. Error: ${err}`
          )
        );
        alertMessage.current.showModal();
      });
  };

  // const getCompanyAdmins = () => {
  //   fetch(`${domain}GenericResultBuilderService/buildResults`, {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json, text/plain, */*",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       _keyword_: "KASH_OPERATIONS_COMPANY_ADMIN_ROLE_TABLE",
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(res);
  //       setAllCompanyAdminsArr(res.data);
  //     })
  //     .catch((err) => {
  //       setMessage(
  //         alertMessageDisplay(
  //           `Unable to load company admins from database. Error: ${err}`
  //         )
  //       );
  //       alertMessage.current.showModal();
  //     });
  // };

  // open project added confirmation modal
  const onModalOpen = () => {
    console.log(
      "show added project modal function ",
      confirmationSubmitDialoguePopup
    );

    confirmationCompanyName.current.innerHTML = selectedCompany;
    confirmationProjectType.current.innerHTML = projectType;
    confirmationProjectSOWId.current.innerHTML = projectSOWId;
    if (
      typeof confirmationSubmitDialoguePopup.current.showModal === "function"
    ) {
      confirmationSubmitDialoguePopup.current.showModal();
    } else {
      setMessage(
        alertMessageDisplay(
          "Sorry, the <dialog> API is not supported by this browser."
        )
      );
      alertMessage.current.showModal();
    }
  };

  // function to check if SOW ID already exists
  const checkIfSOWIdAlreadyExists = () => {
    console.log(
      "does project SOW Id exist ",
      statementOfWorkIdInput.current.value
    );
    console.log(allProjectsArr);
    let projectSOWIdFiltered = allProjectsArr.filter((project, i) => {
      return project.SowId === statementOfWorkIdInput.current.value;
    });
    console.log(projectSOWIdFiltered);
    projectSOWIDEXistsArr = projectSOWIdFiltered;
  };

  const getSelectedCompanyId = (e) => {
    selectedCompanyId =
      e.target[e.target.selectedIndex].getAttribute("data-companyid");
    console.log(selectedCompanyId);
  };

  const fetchToAddProject = async () => {
    console.log("add project to database fetch call");

    try {
      const response = await fetch(
        `${domain}GenericTransactionService/processTransaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // your expected POST request payload goes here
            data: [
              {
                SowId: projectSOWId,
                CompanyId: selectedCompanyId,
                ProjectCategory: projectType,
                OriginalEndDate: projectEndDate,
                CurrentStatus: projectStatus,
                OriginalStartDate: projectStartDate,
                TotalProjectedHours: projectEstimatedHours,
              },
            ],
            _keyword_: "KASH_OPERATIONS_CREATED_PROJECTS_TABLE",
            secretkey: "2bf52be7-9f68-4d52-9523-53f7f267153b",
          }),
        }
      );
    } catch (error) {
      setMessage(alertMessageDisplay(`Unable to add project. Error: ${error}`));
      alertMessage.current.showModal();
    }
  };

  const addProjectToDatabase = (e) => {
    // get values from the form and assign to variables
    e.preventDefault();
    const newProjectData = new FormData(e.target);
    // console.log(newCompanyData.entries());
    // for (let [key, value] of newProjectData.entries()) {
    //   console.log(key, value);
    // }
    selectedCompany = newProjectData.get(
      "add-project-form--company-name-input"
    );
    projectType = newProjectData.get("add-project--type-input");
    projectSOWId = newProjectData.get("add-project--sow-input");
    projectStatus = newProjectData.get("add-project--project-status-input");
    projectStartDate = newProjectData.get("add-project--start-date-input");
    projectEndDate = newProjectData.get("add-project--end-date-input");
    projectEstimatedHours = newProjectData.get(
      "add-project--estimated-hours-input"
    );
    console.log(
      `${selectedCompany} ${projectType} ${projectSOWId} ${projectStatus} ${projectStartDate} ${projectEndDate} ${projectEstimatedHours}`
    );
    checkIfSOWIdAlreadyExists();
    if (projectSOWIDEXistsArr.length !== 0) {
      setMessage(alertMessageDisplay("Project SOW ID already exists."));
      alertMessage.current.showModal();
    } else {
      fetchToAddProject();
      onModalOpen();
      addProjectForm.current.reset();
    }
  };

  const alertMessageDisplay = (entry) => {
    return entry;
  };

  const closeAlert = () => {
    alertMessage.current.close();
  };

  const validateRequiredInputs = () => {
    // validate input fields
    // run function to POST project to database
    // show confirmation modal
  };
  return (
    <div>
      <AlertMessage ref={alertMessage} close={closeAlert} message={message} />
      <dialog
        className="database-submit-dialog"
        id="database-submit-dialog"
        ref={confirmationSubmitDialoguePopup}
      >
        <form
          method="dialog"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <p>Project Created:</p>
          <span
            id="project-page-dialog--company-name-span"
            className="project-page-dialog--company-name-span"
            ref={confirmationCompanyName}
          ></span>
          <span
            className="project-page-dialog--project-type-span"
            id="project-page-dialog--project-type-span"
            ref={confirmationProjectType}
          ></span>
          <span
            id="project-page-dialog--sow-id-span"
            className="project-page-dialog--sow-id-span"
            ref={confirmationProjectSOWId}
          ></span>
          <div>
            <button
              className="dialog-modal-confirm-button"
              id="dialog-modal-confirm-button"
              value="confirm"
            >
              OK
            </button>
          </div>
        </form>
      </dialog>

      <main className="add-project-page__main-section max-width--main-container">
        <h1 className="add-project-title form-page-title--lg-1">
          Add a Project
        </h1>
        <div className="edit_page__return-link-holder">
          <Link to="/client-hub" className="return-link">
            <svg
              width="80"
              height="134"
              viewBox="0 0 80 134"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M76.7864 3.36106C72.8812 -0.544183 66.5495 -0.544181 62.6443 3.36106L1.12622 64.8787C-0.0453612 66.0503 -0.0453675 67.9497 1.12621 69.1213L62.6445 130.64C66.5497 134.545 72.8814 134.545 76.7866 130.64C80.6919 126.734 80.6919 120.403 76.7866 116.497L29.4107 69.1216C28.2391 67.95 28.2391 66.0505 29.4107 64.8789L76.7864 17.5032C80.6917 13.598 80.6917 7.2663 76.7864 3.36106Z"
                fill="#255463"
              />
            </svg>
            <p className="return-link-text">Return to Client Hub</p>
          </Link>
        </div>
        <div className="add-project-page--content-holder">
          {/* <!-- <div className="add-project--watermark"></div> --> */}
          <div className="add-project-page--img-holder">
            <img
              src="https://raw.githubusercontent.com/Alex-Gardner/KASH_Tech_Operations_Portal/main/kashtech-project-reporting-portal/assets/raster-assets/construction-tools--resize.webp"
              alt="Group of tools on dark background"
              className="add-project-page--img"
            />
          </div>
          <form
            action=""
            onSubmit={addProjectToDatabase}
            id="add-project--form"
            className="add-project--form"
            ref={addProjectForm}
          >
            <div className="add-project-form--project-details">
              <label
                htmlFor="add-project-form--company-name-input"
                className="add-project-form--company-name-label"
              >
                Company Name
                <select
                  required="required"
                  className="add-project-form--company-name-input"
                  id="add-project-form--company-name-input"
                  name="add-project-form--company-name-input"
                  ref={selectedCompanyInput}
                  onChange={getSelectedCompanyId}
                >
                  <option value="">- Choose A Company -</option>
                  {allCompaniesArr.map((company, i) => {
                    return (
                      <option
                        key={i}
                        value={company.CompanyName}
                        data-companyid={company.CompanyId}
                        ref={selectedCompanyOption}
                      >
                        {company.CompanyName}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label
                htmlFor="add-project--type-input"
                className="add-project--type-label"
              >
                Project Type
                <input
                  required="required"
                  type="text"
                  className="add-project-form--form-input add-project--type-input"
                  id="add-project--type-input"
                  name="add-project--type-input"
                  ref={projectTypeInput}
                />
              </label>

              <label
                htmlFor="add-project--sow-input"
                className="add-project--sow-label"
              >
                Statement of Work ID
                <br />
                <span className="parenthetical-sub-label">(SOW I.D.)</span>
                <input
                  required="required"
                  type="text"
                  className="add-project-form--form-input add-project--sow-input"
                  id="add-project--sow-input"
                  name="add-project--sow-input"
                  ref={statementOfWorkIdInput}
                />
              </label>
            </div>

            <div className="project-estimates">
              <label
                htmlFor="add-project--project-status-input"
                className="add-project--project-status-label"
              >
                Project Status
                <input
                  type="text"
                  className="add-project-form--form-input add-project--project-status-input"
                  id="add-project--project-status-input"
                  name="add-project--project-status-input"
                  ref={projectStatusInput}
                />
              </label>

              <div className="date-estimates-holder">
                <label
                  htmlFor="add-project--start-date-input"
                  className="add-project--start-date-label"
                >
                  Start Date
                  <input
                    type="date"
                    className="add-project-form--form-input add-project--start-date-input"
                    id="add-project--start-date-input"
                    name="add-project--start-date-input"
                    ref={projectStartDateInput}
                  />
                </label>

                <label
                  htmlFor="add-project--end-date-input"
                  className="add-project--end-date-label"
                >
                  End Date
                  <input
                    type="date"
                    className="add-project-form--form-input add-project--end-date-input"
                    id="add-project--end-date-input"
                    name="add-project--end-date-input"
                    ref={projectEndDateInput}
                  />
                </label>
              </div>

              <label
                htmlFor="add-project--estimated-hours-input"
                className="add-project--estimated-hours-label"
              >
                Estimated Hours
                <input
                  required="required"
                  type="number"
                  step="1"
                  className="add-project-form--form-input add-project--estimated-hours-input"
                  id="add-project--estimated-hours-input"
                  name="add-project--estimated-hours-input"
                  ref={estimatedHoursInput}
                />
              </label>
            </div>

            <button
              // onClick={validateRequiredInputs}
              id="add-project-form--add-project-button"
              className="add-project-form--add-project-button"
            >
              Add Project
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddProject;
