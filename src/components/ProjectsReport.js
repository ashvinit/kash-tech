import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { domain } from "../assets/api/apiEndpoints";
import "../assets/styles/Reports.css";

function ProjectsReport() {
  let [allProjectsArr, setAllProjectsArr] = useState([]);
  let [columnVisibilityModel, setColumnVisibilityModel] = useState({
    CompanyAddress: false,
    CompanyId: false,
    CompanyLocationCity: false,
    CompanyLocationCountry: false,
    CompanyLocationState: false,
    CompanyName: true,
    CompanyZipCode: false,
    CurrentStatus: true,
    ExternalUsername: false,
    OriginalEndDate: true,
    OriginalStartDate: true,
    ProjectCategory: true,
    SowId: true,
    TotalProjectedHours: true,
  });

  useEffect(() => {
    getAllProjects();
  }, []);

  const getAllProjects = async () => {
    await fetch(`${domain}GenericResultBuilderService/buildResults`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _keyword_: "PROJECTS_AND_COMPANY_INFO_TABLE",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        setAllProjectsArr(res.data);
      })
      .catch((err) => alert("Unable to get projects from database.", err));
  };

  // Transform the data
  const transformedRows = allProjectsArr.map((item, i) => ({
    id: i,
    CompanyId: item.CompanyId,
    ProjectCategory: item.ProjectCategory,
    OriginalEndDate: item.OriginalEndDate,
    CurrentStatus: item.CurrentStatus,
    CompanyLocationCountry: item.CompanyLocationCountry,
    OriginalStartDate: item.OriginalStartDate,
    TotalProjectedHours: item.TotalProjectedHours,
    CompanyZipCode: item.CompanyZipCode,
    CompanyAddress: item.CompanyAddress,
    CompanyName: item.CompanyName,
    SowId: item.SowId,
    ExternalUsername: item.ExternalUsername,
    CompanyLocationState: item.CompanyLocationState,
    CompanyLocationCity: item.CompanyLocationCity,
  }));

  const initialHiddenColumns = [
    "CompanyLocationCity",
    "CompanyId",
    "CompanyZipCode",
    "ExternalUsername",
    "CompanyAddress",
    "CompanyLocationCountry",
    "CompanyLocationState",
    "CompanyLocationCity",
  ];

  const customColumnOrder = [
    "id",
    "CompanyName",
    "SowId",
    "ProjectCategory",
    "OriginalStartDate",
    "OriginalEndDate",
    "CurrentStatus",
    "TotalProjectedHours",
  ];

  const columnList = customColumnOrder.map((item) => ({
    field: item,
    width: 150,
  }));

  const handleToggleColumnVisibility = (column) => {
    setColumnVisibilityModel((prevModel) => ({
      ...prevModel,
      [column]: !prevModel[column],
    }));
  };

  const visibleColumns = columnList.filter(
    (column) => columnVisibilityModel[column.field]
  );

  return (
    <div>
      <h1 className="report-title">KASH OPS PROJECTS</h1>
      <div className="report-container">
        <DataGrid
          rows={transformedRows}
          columns={visibleColumns}
          getRowId={(row) => row.id}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={handleToggleColumnVisibility}
        />
      </div>
    </div>
  );
}

export default ProjectsReport;