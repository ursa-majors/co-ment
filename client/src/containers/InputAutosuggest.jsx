import React from 'react';
import Autosuggest from 'react-autosuggest';
import {match, parse} from '../utils';

const escapeRegexCharacters = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const getSuggestionValue = (suggestion) => {
  return suggestion;
}

const renderSuggestion = (suggestion, { query }) => {
  const matches = match(suggestion, query);
  const parts = parse(suggestion, matches);

  return (
    <span>
      {parts.map((part, index) => {
        const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;

        return (
          <span className={className} key={index}>
            {part.text}
          </span>
        );
      })}
    </span>
  );
}

class InputComponent extends React.Component {
  render() {
    return <div><input {...this.props.inputProps} /></div>;
  }
}

const renderInputComponent = inputProps => {
  return <InputComponent inputProps={inputProps} />;
};


class InputAutosuggest extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.handleKeyPressAdd = this.handleKeyPressAdd.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  onChange(_, { newValue }) {
    const { id, onChange } = this.props;

    this.setState({
      value: newValue
    });
    onChange(id, newValue);
  };

  getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') {
      return [];
    }
    const { list } = this.props;
    const regex = new RegExp('^' + escapedValue, 'i');
    return list.filter(item => regex.test(item));
  }

  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  // comma or enter or tab in skill field triggers addSkill
  handleKeyPressAdd(e) {
    if (!this.props.gridControls) {
      if (e.charCode === 44 || e.which === 44
        || e.charCode === 13 || e.which === 13
        || e.keyCode === 9 || e.which === 9
        ) {
        e.preventDefault();
        this.props.addTag();
        this.setState({
          value: ''
        });
      }
    } else {
      return null;
    }
  }

// enter or delete triggers removeSkill on icon/button focus
  handleKeyPressRemove(e) {
    if (e.charCode === 13 || e.which === 13 || e.charCode === 8 || e.which === 8) {
      this.props.removeTag(e);
    }
  }

  render() {
    const { id, placeholder, name } = this.props;
    const { value, suggestions } = this.state;
    const inputProps = {
      name,
      placeholder,
      value,
      onChange: this.onChange,
      onKeyPress: this.handleKeyPressAdd
    };

    return (
      <Autosuggest
        id={id}
        name={name}
        className={this.props.className}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInputComponent}
        inputProps={inputProps}
        highlightFirstSuggestion={true}
        focusFirstSuggestion={true}
      />
    );
  }
}

export default InputAutosuggest;