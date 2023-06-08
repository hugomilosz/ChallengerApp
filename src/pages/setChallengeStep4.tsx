import React from 'react';
import { useState, ChangeEvent } from 'react';
import { SelectBox } from '../components';
import type { SelectOption } from '../components';

type ChData = {
    category: string
    type: string
    style: string
    twist: string
    tags: string
    date: string
    name: string
}

type ChDataProps = ChData & {
    updateFields: (fields: Partial<ChData>) => void
}

const SetChallengeCheckout = ({ category, type, style, twist, tags, date, name, updateFields }: ChDataProps) => {
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

    const [ctgr, setCtgr] = useState(category);

    const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCtgr(event.target.value);
        updateFields({ category: event.target.value })
    };

    function getDescription(type: string, style: string, twist: string): string {
        return "For this challenge you have to submit a " + type + " in " + style + ". The twist is that " + twist + "."
    }

    return (
        <div className="setChallengeCheckout" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Make a Challenge</h1>
            <form onSubmit={handleSubmit} id="form" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                
                
                <input required type="text" placeholder='Challenge Title' style={{ marginBottom: 10 }} name="chName" value={name} onChange={e => updateFields({ name: e.target.value })}/>
                <SelectBox options={options} value={ctgr} onChange={onChange} label="Category:" name="chCtgr" />
                <textarea required cols={40} rows={5} placeholder='Description' style={{ marginTop:10, marginBottom: 10 }} name="chDesc" defaultValue={getDescription(type, style, twist)} />
                <input required type="text" placeholder='Tags' style={{ marginBottom: 10 }} name="chTags" value={tags} onChange={e => updateFields({ tags: e.target.value })} />
                <input required type="file" id="myFiles" accept="image/jpg" multiple style={{ marginBottom: 10 }} name="chFile" />
                <input required type="datetime-local" style={{ marginBottom: 10 }} name="chDate" value={date} onChange={e => updateFields({ date: e.target.value })} />
            </form>
        </div >
    )
}

export default SetChallengeCheckout;
