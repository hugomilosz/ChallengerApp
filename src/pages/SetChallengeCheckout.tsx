import React from 'react';
import { useState, ChangeEvent } from 'react';
import { SelectBox } from '../components';
import type { SelectOption } from '../components';
import { Tooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom';

const SetChallengeCheckout = () => {
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

        fetch('./server/isLoggedIn').then((response) => {
            if (response.status === 204) {
                alert("You must be logged in to submit a Challenge!");
                return;
            }
        });

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

    const categories = ['Art & Craft', 'Culinary', 'Videography', 'Gardening', 'Music', 'Photography', 'Writing', 'Other'];

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
            <h1>Set the Challenge</h1>
            <form onSubmit={handleSubmit} id="form" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex" }}>
                    <input required type="text" placeholder='Challenge Name' style={{ marginBottom: 10 }} name="chName" />
                    <div className="title"><button type='button'>?</button></div>
                    <Tooltip anchorSelect=".title" place="top" style={{ width: "400px" }}>
                        Come up with a cathcy and descriptive title for your challenge. Example: "The hottest sauce ever", "Unbelivable macro shot", etc.
                    </Tooltip>
                </div>
                <SelectBox required={true} options={options} value={selectCategory} onChange={onChange} label="Category:" name="chCtgr" />
                <textarea required cols={40} rows={5} placeholder='Description' style={{ marginTop: 10, marginBottom: 10 }} name="chDesc" />
                <div style={{ display: "flex" }}>
                    <input required type="text" placeholder='Tags' style={{ marginBottom: 10 }} name="chTags" />
                    <div className="tags1"><button type='button'>?</button></div>
                    <Tooltip anchorSelect=".tags1" place="top" style={{ width: "400px" }}>
                        Add the tags (separated by ',') that could help find your challenge.
                        Format: "tag1, tag2, tag3, etc".
                    </Tooltip>
                </div>
                <h4>Upload an example submission:</h4>
                <input required type="file" id="myFiles" accept="image/*" multiple style={{ marginBottom: 30 }} name="chFile" />
                <p>Set Deadline:</p>
                <input required type="datetime-local" style={{ marginBottom: 20 }} name="chDate" />
                <input required type="submit" style={{ marginBottom: 10 }} />
            </form>
        </div >
    )
}

export default SetChallengeCheckout;
