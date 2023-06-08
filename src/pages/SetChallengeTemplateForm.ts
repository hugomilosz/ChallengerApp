import { ReactElement, useState } from "react";

export function SetChallengeTemplateForm(steps: ReactElement[]) {

    const [currStepIdx, setCurrStep] = useState(0);

    function nextStep() {
        setCurrStep(i => {
            if (i > steps.length - 1) return i
            return i + 1
        });
    }

    function prevStep() {
        setCurrStep(i => {
            if (i <= 0) return i
            return i - 1
        });
    }

    function goto(idx: number) {
        setCurrStep(idx);
    }


    return {
        currStepIdx,
        steps,
        step: steps[currStepIdx],
        isFirstStep: currStepIdx === 0,
        isLastStep: currStepIdx === steps.length - 1,
        nextStep,
        prevStep,
        goto
    }

}