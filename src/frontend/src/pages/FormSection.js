import React from 'react';
import './styles/FormSections.css';

const InputField = ({ label, type, name, value, onChange, options }) => {
  return (
    <div className="input-field">
      <label htmlFor={name}>{label}:</label>
      {type === 'checkbox' ? (
        options.map((option, index) => (
          <label key={index} className="checkbox-label">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={onChange}
            />
            {option.label}
          </label>
        ))
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <fieldset className="section">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
};

const FormSections = () => {
  // Define the state for your form fields here
  // ...

  // Handlers for your form inputs
  // ...

  return (
    <div className="form-container">
      <Section title="Course Information">
        <InputField label="Course Code" type="text" name="courseCode" /* State props here */ />
        <InputField label="Course Size" type="number" name="courseSize" /* State props here */ />
        {/* More fields */}
      </Section>
      
      <Section title="Lecture Information">
        {/* More InputFields */}
      </Section>
      
      <Section title="Lab Preferences">
        <InputField label="Days" type="checkbox" name="labDays" options={[
          { label: 'Monday', value: 'Mon' },
          // More days...
        ]} /* State props here */ />
        {/* More fields */}
      </Section>
      
      {/* Add button to submit form */}
    </div>
  );
};

export default FormSections;