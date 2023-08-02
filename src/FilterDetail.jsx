// FilterDetail.js

import axios from 'axios';
import firebase from 'firebase/compat/app';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';
import './FilterDetail.css';

const customStyles = {
    control: (base, state) => ({
      ...base,
      height: 'auto',
      minHeight: '40px',
      background: 'rgba(242, 242, 242, 0.4)',
      borderColor: state.isFocused ? '#f2f2f2' : '#f2f2f2',
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        borderColor: state.isFocused ? '#f2f2f2' : '#f2f2f2'
      }
    }),
    valueContainer: (base, state) => ({
      ...base,
      padding: '0 6px'
    }),
    input: (base, state) => ({
      ...base,
      margin: '0px',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      fontWeight: '500',
    }),
    indicatorsContainer: (base, state) => ({
      ...base,
      alignItems: 'center',
      color: 'white',
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: 'white',
    }),
    clearIndicator: (base, state) => ({
      ...base,
      color: 'white',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      fontWeight: '500',
    }),
    multiValue: (base) => ({
    ...base,
    backgroundColor: 'white',
    }),
  };
  

function FilterDetail({ filter, creatingNewFilter, onFilterCreated, onFilterDeleted}) {
    const [labels, setLabels] = useState([]);
    const [selectedInput, setSelectedInput] = useState([]);
    const [selectedOutput, setSelectedOutput] = useState([]);
    const [filterName, setFilterName] = useState(filter.name || "");
    const [taskInstructions, setTaskInstructions] = useState(filter.taskInstructions || "");
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            firebase.auth().currentUser.getIdToken().then(async (idToken) => {
                try {
                    const response = await axios.get('https://us-central1-social-inbox-7390f.cloudfunctions.net/api/labels', {
                        headers: { 'Authorization': `Bearer ${idToken}` }
                    });
                    const labelOptions = response.data.labels.map(label => ({ value: label.id, label: label.name }));
                    setLabels(labelOptions);
                    console.log(filter);
                    if (filter.labels) {
                        setSelectedInput(labelOptions.filter(label => filter.labels.includes(label.value)));
                    }
                    if (filter.output) {
                        setSelectedOutput(labelOptions.filter(label => filter.output.includes(label.value)));
                    }
                } catch (error) {
                    console.log('Error fetching labels:', error);
                } finally {
                    setLoading(false);
                }
            });
        };

        fetchData();
    }, [filter]);
    

    const handleInputChange = (selected) => {
        setSelectedInput(selected);
        console.log("Selected Input Labels: ", selected.map(s => s.value));
    }

    const handleOutputChange = (selected) => {
        setSelectedOutput(selected);
        console.log("Selected Output Labels: ", selected.map(s => s.value));
    }

    const handleFilterNameChange = (event) => {
        setFilterName(event.target.value);
    }

    const handleInstructionsChange = (event) => {
        setTaskInstructions(event.target.value);
    }

    const handleSave = async () => {
        const payload = {
            name: filterName,
            taskInstructions: taskInstructions,
            labels: selectedInput.map(input => input.value),
            output: selectedOutput.map(output => output.value)
        };
    
        if (!creatingNewFilter) {
            payload.filterId = filter.id;
        }

        console.log(payload);
    
        const url = creatingNewFilter ? 
            'https://us-central1-social-inbox-7390f.cloudfunctions.net/api/filters/create' : 
            'https://us-central1-social-inbox-7390f.cloudfunctions.net/api/filters/modify';
    
        const method = creatingNewFilter ? 'post' : 'patch';
    
        firebase.auth().currentUser.getIdToken().then(async (idToken) => {
            try {
                const response = await axios({ method, url, data: payload, headers: { 'Authorization': `Bearer ${idToken}` } });
                console.log('Response from server:', response.data);
    
                if (creatingNewFilter) {
                    onFilterCreated(response.data); // Here we call the new callback with the created filter
                }
            } catch (error) {
                console.log('Error sending request:', error);
            }
        });
    }
    
    const handleDelete = async () => {
        if (!creatingNewFilter && window.confirm("Are you sure you want to delete this filter?")) { // <-- add confirmation here
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                const uid = currentUser.uid;
                const db = firebase.firestore();
                db.collection('accounts').doc(uid).collection('filters').doc(filter.id).delete()
                    .then(() => {
                        onFilterDeleted(filter); // call the new prop here
                    }).catch((error) => {
                        console.error("Error removing filter: ", error);
                    });
            }
        }
    }

    const darkTheme = theme => ({
        ...theme,
        borderRadius: 0,
        colors: {
            ...theme.colors,
            primary25: 'blue',
            primary: 'black',
            neutral0: 'black',
            neutral80: 'black',
            neutral20: 'black'
        },
    })

    /*
    return (
        loading ? 
            <div>Loading...</div>
            :
            <div>
                <h2>Filter Name:</h2>
                <input type="text" value={filterName} onChange={handleFilterNameChange} />
                <h2>Read Emails From:</h2>
                <Select
                    isMulti
                    name="input"
                    options={labels}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleInputChange}
                    value={selectedInput}
                    theme={darkTheme}
                />
                <h2>Put Emails In:</h2>
                <Select
                    isMulti
                    name="output"
                    options={labels}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleOutputChange}
                    value={selectedOutput}
                    theme={darkTheme}
                />
                <h2>Task Instructions:</h2>
                <textarea value={taskInstructions} onChange={handleInstructionsChange} />
                <button onClick={handleSave}>{creatingNewFilter ? "Create" : "Save"}</button>
                {!creatingNewFilter && <button onClick={handleDelete}>Delete</button>}
            </div>
    );
    */
   return (
        loading ? 
            <div>Loading...</div>
            :
            <div className="mx-auto w-full max-w-screen-md py-6 px-5 flex flex-col items-center gap-4 text-sm">
            <div className="w-full flex flex-col items-start gap-2">
              <label className="text-white text-base font-medium">Filter Name</label>
              <div className="relative bg-gray-200 bg-opacity-40 border border-gray-400 rounded-md w-full">
                <input 
                  className="bg-transparent text-white text-base font-medium outline-none px-3 py-2 w-full h-11"
                  type="text" 
                  placeholder="Jobs Filter"
                  value={filterName}
                  onChange={handleFilterNameChange} 
                />
              </div>
            </div>
            <div className="w-full flex flex-col items-start gap-2">
                <label className="text-white text-base font-medium">GPT Filter Instructions</label>
                <div className="relative bg-gray-200 bg-opacity-40 border border-gray-400 rounded-md w-full">
                <TextareaAutosize 
                    minRows={5}
                    className="bg-transparent text-white text-base font-medium outline-none px-3 py-2 w-full "
                    placeholder="You are my AI assistant. You will be reading my email inbox and identifying any emails that are job offers. Do not include promotional emails about products. I want you to identify only emails related to potential job offers for me. These often include a job description and a little bit of information about a company. Respond with true if the email is a job opportunity and false otherwise."
                    value={taskInstructions} onChange={handleInstructionsChange}
                />
                </div>
            </div>
            <div className="w-full flex flex-col items-start gap-2">
                <label className="text-white text-base font-medium">Labels To Read Emails From</label>
                <Select 
                className = "w-full"
                options={labels} 
                isMulti 
                styles={customStyles}
                onChange={handleInputChange}
                value={selectedInput}
                />
            </div>
            <div className="w-full flex flex-col items-start gap-2">
                <label className="text-white text-base font-medium">Labels To Put Filtered Emails In</label>
                <Select 
                className = "w-full"
                options={labels} 
                isMulti 
                styles={customStyles}
                style={{ width: '100%' }}
                onChange={handleOutputChange}
                value={selectedOutput}
                />
            </div>
            <div className="h-5" />
            <button className="fd-save-button" onClick={handleSave}>
                <div className="fd-save-text">{creatingNewFilter ? "Create" : "Save"}</div>
            </button>
            {!creatingNewFilter &&
                <button className="fd-delete-button" onClick={handleDelete}>
                    <div className="fd-del-text">Delete Filter</div>
                </button>
            }
    </div>
   );
}

export default FilterDetail;
