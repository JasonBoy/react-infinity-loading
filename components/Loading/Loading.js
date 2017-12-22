import React from 'react';
import 'spinkit/css/spinners/10-fading-circle.css';

class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div className="sk-fading-circle default-infinite-loading">
        <div className="sk-circle1 sk-circle" />
        <div className="sk-circle2 sk-circle" />
        <div className="sk-circle3 sk-circle" />
        <div className="sk-circle4 sk-circle" />
        <div className="sk-circle5 sk-circle" />
        <div className="sk-circle6 sk-circle" />
        <div className="sk-circle7 sk-circle" />
        <div className="sk-circle8 sk-circle" />
        <div className="sk-circle9 sk-circle" />
        <div className="sk-circle10 sk-circle" />
        <div className="sk-circle11 sk-circle" />
        <div className="sk-circle12 sk-circle" />
      </div>
    );
  }
}

export default Loading;
