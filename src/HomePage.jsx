// HomePage.js


import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // import the new CSS file
import ListFilters from './ListFilters';
import FilterDetail from './FilterDetail';
import Settings from './Settings';

function HomePage() {
    let navigate = useNavigate();
    const [filters, setFilters] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [creatingNewFilter, setCreatingNewFilter] = useState(false);
    const [settingsPage, setSettingsPage] = useState(false);
    const [loadingCredits, setLoadingCredits] = useState(true);
    const [remaining, setRemaining] = useState(0);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            const uid = currentUser.uid;
            const db = firebase.firestore();
            db.collection('accounts').doc(uid).collection('filters').get()
                .then(querySnapshot => {
                    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setFilters(data);
                })
                .catch(error => {
                    console.log("Error getting documents: ", error);
                });

                const fetchData = async () => {
                    firebase.auth().currentUser.getIdToken().then(async (idToken) => {
                        try {
                            const response = await axios.get('https://us-central1-social-inbox-7390f.cloudfunctions.net/api/credits', {
                                headers: { 'Authorization': `Bearer ${idToken}` }
                            });
            
                            // Set remaining and total states
                            setRemaining(response.data.openai);
                            setTotal(response.data.fillup);
            
                        } catch (error) {
                            console.log('Error fetching credits', error);
                        } finally {
                            setLoadingCredits(false);
                        }
                    });
                };
            
                fetchData();
        } else {
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        
    }, []);

    const handleLogout = () => {
        firebase.auth().signOut().then(() => {
            navigate('/login');
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
    }

    const handleBack = () => {
        setSelectedFilter(null);
        setCreatingNewFilter(false);
        setSettingsPage(false);
    }

    const handleCreateFilter = () => {
        setCreatingNewFilter(true);
        setSelectedFilter({});
    }

    const handleFilterCreated = (newFilter) => {
        setFilters([...filters, newFilter]); // Add the new filter to the list of filters
        setSelectedFilter(newFilter); // Select the newly created filter
        setCreatingNewFilter(false); // We are not creating a new filter anymore
    }

    const handleFilterDeleted = (deletedFilter) => {
        setFilters(filters.filter(filter => filter.id !== deletedFilter.id)); // Remove the deleted filter from the list
        setSelectedFilter(null); // Deselect the filter
    }

    return (
        <div className="home-page">
          <div className="nav-bar">
            { selectedFilter || settingsPage ?
                <button onClick={handleBack}>
                    <svg className="vector" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path strokeWidth="3" d="M245.458824 490.706824L671.442824 64.752941a30.117647 30.117647 0 0 1 42.586352 42.586353L309.368471 512l404.570353 404.570353a30.087529 30.087529 0 0 1 0.060235 42.646588 29.967059 29.967059 0 0 1-42.646588-0.030117L245.519059 533.323294a30.087529 30.087529 0 0 1-0.030118-42.61647z" fill="#FFFFFF" /></svg>
                </button>
                : <></>
            }
            { selectedFilter || settingsPage ?
                <div className="spacer" />
                : <></>
            }
            <div className="text-wrapper">Filter GPT</div>
            <div className="spacer" />
            <button onClick={() => setSettingsPage(true)}>
                <svg className="vector"  fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.11111 0C0.497467 0 0 0.6396 0 1.42857C0 2.21754 0.497467 2.85714 1.11111 2.85714H18.8889C19.5026 2.85714 20 2.21754 20 1.42857C20 0.6396 19.5026 0 18.8889 0H1.11111ZM0 10C0 9.211 0.497467 8.57143 1.11111 8.57143H18.8889C19.5026 8.57143 20 9.211 20 10C20 10.789 19.5026 11.4286 18.8889 11.4286H1.11111C0.497467 11.4286 0 10.789 0 10ZM0 18.5714C0 17.7824 0.497467 17.1429 1.11111 17.1429H18.8889C19.5026 17.1429 20 17.7824 20 18.5714C20 19.3604 19.5026 20 18.8889 20H1.11111C0.497467 20 0 19.3604 0 18.5714Z" fill="white"/>
                </svg>
            </button>
          </div>
          {selectedFilter || creatingNewFilter ? (
                <FilterDetail 
                filter={selectedFilter} 
                creatingNewFilter={creatingNewFilter} 
                onFilterCreated={handleFilterCreated} 
                onFilterDeleted={handleFilterDeleted} />
            ) : 
                settingsPage ? (
                    <Settings onLogout={handleLogout} loadingCredits={loadingCredits} remaining={remaining} total={total}/>
                ) : (
                    <ListFilters filters={filters} onFilterSelect={handleFilterSelect} onCreateFilter={handleCreateFilter} loadingCredits={loadingCredits} remaining={remaining} total={total}/>
                )
            }
        </div>
      );
}


export default HomePage;
