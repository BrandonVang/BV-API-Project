import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotIndex from "./components/Spots/SpotsIndex";
import SpotsShow from "./components/Spots/SpotIndexItem";
import SpotDetail from "./components/Spots/SpotDetails";
import CreateSpotForm from "./components/Navigation/CreateSpot";
import SpotManagementPage from "./components/Navigation/CurrentUserSpots";
import UpdateSpot from "./components/Spots/UpdateSpot";
import ReviewDetails from "./components/Reviews/ReviewDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/" component={SpotIndex} />
          <Route exact path="/spots/new" component={CreateSpotForm}/>
          <Route exact path="/spots/current" component={SpotManagementPage} />
          <Route exact path="/spots/:spotId" component={SpotDetail} />
          <Route exact path="/spots/:spotId/edit" component={UpdateSpot} />
          {/* <Route exact path= "/spots/:spotId/reviews" component={ReviewDetails}/> */}
        </Switch>

      )}
    </div>
  );
}

export default App;
