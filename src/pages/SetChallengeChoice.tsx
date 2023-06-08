import { useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

const SetChallengeChoice = () => {

    let navigate = useNavigate();

    const navigateToCheckout = () => {
      navigate('/setChallengeCheckout');
    };

    const navigateToTemplate = () => {
      navigate('/setChallengeTemplate');
    };

    return (
        <div className="setChallengeChoice">
            <h1>Set up Challange</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <button style={{ marginBottom: 10 }} onClick={navigateToCheckout}>Skip</button>
                <button style={{ marginBottom: 10 }} onClick={navigateToTemplate}>Get Help</button>
            </div>
        </div>
    );
};

export default SetChallengeChoice;

