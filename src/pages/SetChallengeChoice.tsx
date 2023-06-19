import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

const SetChallengeChoice = () => {

  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    fetch("/server/isLoggedIn").then((response) => {
      if (response.status === 204) {
        setLoggedIn(false);
      }
      if (response.status === 200) {
        setLoggedIn(true);
      }
    }
    );
  }, []);

  let navigate = useNavigate();

  const navigateToCheckout = () => {
    navigate('/setChallengeCheckout');
  };

  const navigateToTemplate = () => {
    navigate('/setChallengeTemplate');
  };

  return (
    <div className="setChallengeChoice" style={{ display: "grid", gridTemplateColumns: "1fr", justifyItems: "center", alignItems: "center" }}>
      <h2>Set up Challange</h2>
      <p style={{ width: 300 }}>Please follow the template to create a new challenge or skip it and go straign to the submission form.</p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Button 
          variant="contained" 
          color='secondary'
          style={{ 
            marginBottom: 10,
            width: 300,
            maxWidth: 300
          }} 
          onClick={navigateToTemplate} 
          disabled={!isLoggedIn}
        >
          Get Help
        </Button>
        <Button 
          variant="contained"
          color='secondary'
          style={{ 
            marginBottom: 10,
            width: 300,
            maxWidth: 300
          }} 
          onClick={navigateToCheckout} 
          disabled={!isLoggedIn}
        >
          Skip
        </Button>
        {!isLoggedIn && <h2>You must log in to set a challenge!</h2>}
      </div>
    </div>
  );
};

export default SetChallengeChoice;

