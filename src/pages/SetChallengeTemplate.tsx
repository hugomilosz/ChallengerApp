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