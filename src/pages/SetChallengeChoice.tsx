import { useNavigate } from 'react-router-dom';

const SetChallengeChoice = () => {

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
            <button style={{ marginBottom: 10 }} onClick={navigateToTemplate}>Get Help</button>
                <button style={{ marginBottom: 10 }} onClick={navigateToCheckout}>Skip</button>
            </div>
        </div>
    );
};

export default SetChallengeChoice;

