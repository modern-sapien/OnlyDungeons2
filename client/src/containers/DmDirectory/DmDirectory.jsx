// import { load } from "npm";
import React, { useEffect, useState } from "react";
import Dmaster from "../../components/Dmaster/Dmaster";
import DmSearch from "../../components/DmSearch/DmSearch";
import DmCategoryCheckbox from "../../components/DmCategoryCheckbox/DmCategoryCheckbox";
import DmAvailabilityCheckbox from "../../components/DmAvailabilityCheckbox/DmAvailabilityCheckbox";
import API from "../../utils/API";

function DmDirectory() {
  const [allDms, setDms] = useState([]);
  const [filteredDms, setFilteredDms] = useState([]);
  const [searchedDms, setSearchedDms] = useState([]);
  const [categoryFilters, setFilters] = useState({
    categories: [],
  });
  const [availabilityFilters, setAvailabilityFilters] = useState({
    days: [],
  });

  // Address clearing search when something is unselected && being able to use both category & availability filtering.

  useEffect(() => {
    loadDms();
  }, []);

  function loadDms() {
    API.getDms()
      .then((res) => {
        setDms(res.data);
        setSearchedDms(res.data);
      })
      .catch((err) => console.log(err));
  }

  function setOriginalDms() {
    setSearchedDms(allDms);
  }

  function handleSearch(event) {
    let searchedDm = event.target.value;
    if (searchedDm === "") {
      setOriginalDms();
    } else {
      setSearchedDms(
        searchedDms.filter((dm) => {
          return dm.userName.indexOf(searchedDm) !== -1;
        })
      );
    }
  }

  const handleFilters = (filters, category) => {
    if (filters.length === 0) {
      setOriginalDms();
      // setFilters()
    } else {
      const newFilters = { ...categoryFilters };
      newFilters[category] = filters;
      setFilters(newFilters);
    }
  };

  const handleDayFilters = (dayFilters, day) => {
    if (dayFilters.length === 0) {
      setOriginalDms();
    } else {
      const newFilters = { ...availabilityFilters };
      newFilters[day] = dayFilters;
      setAvailabilityFilters(newFilters);
    }
  };

  useEffect(() => {
    setOriginalDms();
    console.log("USE EFFECT OF CHECKBOXES");
    let filtersArray = categoryFilters.categories;
    for (let i = 0; i < filtersArray.length; i++) {
      let x = i + 1;
      setSearchedDms((prevState) =>
        prevState.filter((dm) => {
          for (const [key, value] of Object.entries(dm.categoryType)) {
            // console lo the amount of times the array works through
            if (key === filtersArray[i] && value === true) {
              return dm;
            }
          }
        })
      );
    }
  }, [categoryFilters.categories]);

  useEffect(() => {
    setOriginalDms();
    console.log("USE EFFECT OF CHECKBOXES");
    let dayFiltersArray = availabilityFilters.days;
    for (let i = 0; i < dayFiltersArray.length; i++) {
      let x = i + 1;
      setSearchedDms((prevState) =>
        prevState.filter((dm) => {
          for (const [key, value] of Object.entries(dm.availability)) {
            if (key === dayFiltersArray[i] && value === true) {
              return dm;
            }
          }
        })
      );
    }
  }, [availabilityFilters.days]);

  return (
    <>
      <DmSearch handleSearch={handleSearch} />

      <div className="row">
        <div className="col s3 content-border">
          <div className="row">
            <div className="col s12">
              <h5>Category:</h5>
              <DmCategoryCheckbox
                handleFilters={(filters) =>
                  handleFilters(filters, "categories")
                }
              />

              <div className="col s12">
                <h5>Availability:</h5>
              </div>
              <DmAvailabilityCheckbox
                handleDayFilters={(dayFilters) =>
                  handleDayFilters(dayFilters, "days")
                }
              />
            </div>
          </div>
        </div>

        <div className="col s9 content-border">
          {searchedDms.map((dm) => (
            <Dmaster key={dm._id} userName={dm.userName} tagLine={dm.tagLine} />
          ))}
        </div>
      </div>
    </>
  );
}

export default DmDirectory;
