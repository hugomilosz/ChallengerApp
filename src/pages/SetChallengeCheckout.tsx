import React from 'react';
import { useState, ChangeEvent } from 'react';
import { SelectBox } from '../components';
import type { SelectOption } from '../components';

const SetChallengeCheckout = () => {
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

    const categories = ['Art & Craft', 'Culinary', 'Videography', 'Gardening', 'Music', 'Photography', 'Sport', 'Travel', 'Writing', 'Other'];

    const options: SelectOption[] = [
        { label: 'Select...', value: '' },
        ...categories.map((category) => ({ label: category, value: category })),
    ];

    const [selectCategory, setSelectCatgory] = useState('');

    const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectCatgory(event.target.value);
    };

    return (
        <div className="setChallengeCheckout" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Make a Challenge</h1>
            <form onSubmit={handleSubmit} id="form" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                
                
                <input type="text" placeholder='Challenge Name' style={{ marginBottom: 10 }} name="chName" />
                <SelectBox options={options} value={selectCategory} onChange={onChange} label="Category:" name="chCtgr" />
                <textarea cols={40} rows={5} placeholder='Description' style={{ marginTop:10, marginBottom: 10 }} name="chDesc" />
                <input type="text" placeholder='Tags' style={{ marginBottom: 10 }} name="chTags" />
                <input type="datetime-local" style={{ marginBottom: 10 }} name="chDate" />
                <input type="file" id="myFiles" accept="image/jpg" multiple style={{ marginBottom: 10 }} name="chFile" />
                <input type="submit" style={{ marginBottom: 10 }} />
            </form>
        </div >
    )
}

export default SetChallengeCheckout;
