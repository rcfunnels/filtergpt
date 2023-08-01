// ListFilters.js
import './HomePage.css'; // import the new CSS file
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function ListFilters({ filters, onFilterSelect, onCreateFilter, loadingCredits, remaining, total}) {
    return (
   <div className="w-full max-w-screen-sm">
      {loadingCredits ? (
            <div>Loading...</div> )
            : (
      <div className="usage-summary">
      <div className="usage-tile">
        <div className="filer-title-bar">
          <div className="div">Usage</div>
          <div className="spacer-2" />
          <div className="buy-button">
            <div className="text-wrapper-2">Buy More</div>
          </div>
        </div>
        <div className="max-h-52" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}> 
          <CircularProgressbarWithChildren value={(remaining / total + 0.0) * 100} className="max-h-52"
              styles={{
                  path: {
                      stroke: `rgba(60, 91, 243, 1)`,
                  },
              }}
              >
          </CircularProgressbarWithChildren>
          <div className="description" style={{position: 'absolute'}}>
              <h1 className="h-1">{remaining}</h1>
              <div className="emails-remaining">
                  emails
                  <br />
                  remaining
              </div>
          </div>
      </div>
      </div>
    </div>
    )}
    <div className="usage-summary-2">
      <div className="text-wrapper-3">GPT Filters</div>
      <ul className="filters-list">
        {filters.map((filter, index) => (
          <button className="filter" key={index} onClick={() => onFilterSelect(filter)}>
            <div className="filer-title-bar">
              <div className="text-wrapper-3">{filter.name}</div>
              <div className="spacer-2" />
              <svg className="img" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.6404 8.74258L2.09714 15.1921C1.6173 15.6026 0.839333 15.6026 0.359731 15.1921C-0.11991 14.782 -0.11991 14.1168 0.359731 13.7068L7.0341 7.99983L0.359731 2.29322C-0.11991 1.88294 -0.11991 1.21783 0.359731 0.807713C0.839372 0.397429 1.6173 0.397429 2.09714 0.807713L9.6404 7.25727C9.88023 7.46243 10 7.73103 10 7.99976C10 8.26862 9.87999 8.53742 9.64021 8.74248" fill="white"/>
              </svg>

            </div>
          </button>
        ))}
      </ul>
      <button className="sign-in-with-google" onClick={() => onCreateFilter()}>
        <div className="text-wrapper-4">Create Filter</div>
      </button>
    </div>
   </div>
    );
  }
  
  export default ListFilters;
  