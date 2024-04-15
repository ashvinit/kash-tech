import React from "react";

function InvoiceDateRangeFilter() {
  // Write function to track filter choices and run function sent via props to update state on parent in order to pass to new invoice component
  return (
    <form method="POST" className="invoice-filter-form">
      <fieldset>
        <label htmlFor="company-selection">Company</label>
        <select id="company-selection" name="company-selection" typeof="text">
          <option value=""></option>
          {/* map over list of companies */}
        </select>
      </fieldset>
      <fieldset>
        <label htmlFor="project-selection">Project</label>
        <select id="project-selection" name="project-selection" typeof="text">
          <option value=""></option>
          {/* map over list of companies */}
        </select>
      </fieldset>

      <fieldset className="invoice-date-rage-form-group">
        <h5>Date Range</h5>
        <div>
          <div>
            <label htmlFor="date-filter-from">Start Date</label>
            <input id="date-filter-from" name="date-filter-from" type="date" />
          </div>

          <div>
            <div>
              <label htmlFor="date-filter-to">End Date</label>
              <input id="date-filter-to" name="date-filter-to" type="date" />
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

export default InvoiceDateRangeFilter;