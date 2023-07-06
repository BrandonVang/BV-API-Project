import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotIndex from "./components/Spots/SpotsIndex";
import SpotsShow from "./components/Spots/SpotIndexItem";
import SpotDetail from "./components/Spots/SpotDetails";
import CreateSpotForm from "./components/Navigation/CreateSpot";

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
          <Route path="/spots/new" component={CreateSpotForm}/>
          <Route path="/spots/:id" component={SpotDetail} />
        </Switch>

      )}
    </div>
  );
}

export default App;
