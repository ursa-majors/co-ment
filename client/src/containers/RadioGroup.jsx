import React from 'react';

const RadioGroup = (props) => (
	<div>
		<label className="form__label">{props.title}</label>
		<div className="form__input--radio-group">
			{props.options.map(option => {
				return (
						<label key={option} className="form__input--radio-label" htmlFor={props.setName}>
							<input
								className="form__input--radio"
								id={props.setName}
								name={props.setName}
								onChange={props.controlFunc}
								value={option}
								checked={props.selectedOptions === option}
								type={props.type} /> {option}
						</label>
				);
			})}
		</div>
	</div>
);

export default RadioGroup;