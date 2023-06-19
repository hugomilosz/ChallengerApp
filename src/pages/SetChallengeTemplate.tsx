import SetChallengeStep1 from './SetChallengeStep1'
import { SetChallengeTemplateForm } from './SetChallengeTemplateForm'
import React, { FormEvent, useState } from 'react';
import SetChallengeStep2 from './SetChallengeStep2';
import SetChallengeStep3 from './SetChallengeStep3';
import SetChallengeStep4 from './setChallengeStep4';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type ChData = {
    category: string
    type: string
    style: string
    twist: string
    tags: string
    date: string
    name: string
}

const INITIAL_DATA: ChData = {
    category: "",
    type: "",
    style: "",
    twist: "",
    tags: "",
    date: "",
    name: ""
}

const SetChallengeTemplate = () => {

    const navigate = useNavigate();

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        
        const target = event.target as typeof event.target & {
            chName: { value: string },
            chCtgr: { value: string },
            chDesc: { value: string },
            chTags: { value: string },
            chFile: { files: FileList },
            chDate: { value: string }
        };

        const formData = new FormData();
        formData.append("name", target.chName.value);
        formData.append("ctgr", target.chCtgr.value);
        formData.append("desc", target.chDesc.value);
        formData.append("tags", target.chTags.value);
        formData.append("file", target.chFile.files[0], target.chFile.files[0].name);
        formData.append("date", target.chDate.value);

        const response = await fetch('./server/createChallenge', {
            method: 'POST',
            body: formData,
        })
        if (response.status === 200) {
            alert("Challenge created!");
            navigate("/");
        } else {
            alert("Error creating challenge!");
        }
    }
    
    const [chData, setChData] = useState(INITIAL_DATA)

    function updateFields(fields: Partial<ChData>) {
        setChData(prev => {
            return { ...prev, ...fields }
        })
    }

    const { steps, currStepIdx, step, isFirstStep, isLastStep, prevStep, nextStep } = SetChallengeTemplateForm([
        <SetChallengeStep1 {...chData} updateFields={updateFields} />,
        <SetChallengeStep2 {...chData} updateFields={updateFields} />,
        <SetChallengeStep3 {...chData} updateFields={updateFields} />,
        <SetChallengeStep4 {...chData} updateFields={updateFields} />
    ])

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!isLastStep) return nextStep();
        handleSubmit(e);
    }


    return (
        <div className="setChallengeTemplate" style={{ paddingBottom: 20}}>
            <form onSubmit={onSubmit}>
                <div style={{ position: "relative"}}>
                    {currStepIdx + 1} / {steps.length}
                </div>
                { step }
                <div 
                    style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "5px",
                        justifyContent: "center"
                    }}>
                    
                    {!isFirstStep && (
                        <Button 
                        variant="contained"
                        color='secondary'
                        style={{ 
                          marginBottom: 10,
                          width: 150,
                          maxWidth: 150
                        }} 
                        onClick={prevStep} 
                        type='button'
                        > 
                            Go Back 
                        </Button>
                    )}
                    <Button 
                        variant="contained"
                        color='secondary'
                        style={{ 
                          marginBottom: 10,
                          width: 150,
                          maxWidth: 150
                        }}
                        type='submit'>  
                        {isLastStep ? "Set Challenge" : "Next"}
                    </Button>
                    
                </div>
            </form>
        </div>
    );
};

export default SetChallengeTemplate;