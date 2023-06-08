import SetChallengeStep1 from './SetChallengeStep1'
import { SetChallengeTemplateForm } from './SetChallengeTemplateForm'
import React, { FormEvent, useState } from 'react';
import SetChallengeStep2 from './SetChallengeStep2';
import SetChallengeStep3 from './SetChallengeStep3';
import SetChallengeStep4 from './setChallengeStep4';

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
        alert("Successful Challenge Submission")
    }


    return (
        <div className="setChallengeTemplate">
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
                        <button type='button' onClick={prevStep}> 
                            Go Back 
                        </button>
                    )}
                    <button type='submit'>  
                        {isLastStep ? "Set Challenge" : "Next"}
                    </button>
                    
                </div>
            </form>
        </div>
    );
};

export default SetChallengeTemplate;