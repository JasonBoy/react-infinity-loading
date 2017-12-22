/*!
 * @license MIT
 * Event-driven, fully-controlled infinite scroll loading for React.
 * https://github.com/JasonBoy/react-infinity-loading
 */

'use strict';

import { EventEmitter as ee } from 'fbemitter';
import React from 'react';
import PropTypes from 'prop-types';

export const EventEmitter = ee;
export const emitter = new EventEmitter();
export const TYPE = {
  INIT_LOADING: 'IL_INIT_LOADING',
  LOADING: '  IL_LOADING',
  ALL_LOADED: 'IL_ALL_LOADED',
  LOADING_FINISHED: 'IL_LOADING_FINISHED',
  REINITIALIZE: 'IL_REINITIALIZE',
};

class InfiniteLoading extends React.Component {
  constructor(props) {
    super(props);

    this.scrollHandler = this.scrollHandler.bind(this);
    this.initHandler = this.initHandler.bind(this);
    this.clear = this.clear.bind(this);
    this.destroy = this.destroy.bind(this);
    this.reInitHandler = this.reInitHandler.bind(this);
    this.toggleLoadingDone = this.toggleLoadingDone.bind(this);

    this.initialLoad = this.props.initialLoad;
    this.emitter = this.props.emitter || emitter;
    this.state = {
      loadingDone: false,
    };
  }

  componentDidMount() {
    this.initHandler();
    this.reInitializeListener = this.emitter.addListener(
      TYPE.REINITIALIZE,
      cb => {
        this.toggleLoadingDone(false);
        this.reInitHandler();
        cb && cb();
      }
    );
  }

  componentWillUnmount() {
    this.clear();
    this.destroy();
    this.reInitializeListener.remove();
  }

  reInitHandler() {
    this.clear();
    this.destroy();
    this.log('Reinitializing InfiniteLoading status...');
    this.initHandler();
  }

  initHandler() {
    this.screenHeight = window.screen.availHeight;
    this.loading = false;
    this.scale = 1;
    this.offset = this.props.offset;
    //to prevent loading too often
    this.delay = this.props.delay;
    this.allLoaded = false;

    this.loadingFinishedListerner = this.emitter.addListener(
      TYPE.LOADING_FINISHED,
      () => {
        this.loading = false;
        this.log('Current loading done...');
      }
    );

    this.allLoadedListener = this.emitter.addListener(TYPE.ALL_LOADED, () => {
      this.clear();
      this.toggleLoadingDone(true);
      this.log('All loaded...');
    });

    window.addEventListener('scroll', this.scrollHandler, false);
    if (this.initialLoad) {
      //init one
      setTimeout(() => {
        this.log('Emitting INIT_LOADING event...');
        this.toggleLoadingDone(false);
        this.emitter.emit(TYPE.INIT_LOADING);
      }, this.delay);
    }
  }

  clear() {
    this.allLoaded = true;
    this.loading = false;
    window.removeEventListener('scroll', this.scrollHandler, false);
  }

  destroy() {
    this.loadingFinishedListerner.remove();
    this.allLoadedListener.remove();
    clearTimeout(this.waitTimer);
  }

  scrollHandler() {
    if (this.loading || this.allLoaded) return;
    const position = this.loadingDom.getBoundingClientRect();
    if (this.screenHeight - position.bottom * this.scale >= this.offset) {
      this.loading = true;
      this.waitTimer = setTimeout(() => {
        this.log('Emitting LOADING event...');
        this.toggleLoadingDone(false);
        this.emitter.emit(TYPE.LOADING);
      }, this.delay);
    }
  }

  toggleLoadingDone(loadingDone = true) {
    this.setState({
      loadingDone,
    });
  }

  log(msg, level = 'log') {
    if (process.env.NODE_ENV === 'production') return;
    console[level](msg);
  }

  render() {
    const style = {
      display: this.state.loadingDone ? 'none' : 'block',
    };
    const className = this.props.className ? ` ${this.props.className}` : '';
    return (
      <div
        className={`infinite-loading${className}`}
        style={style}
        ref={ele => (this.loadingDom = ele)}
      >
        {this.props.loader || this.props.children || 'Loading...'}
      </div>
    );
  }
}

InfiniteLoading.defaultProps = {
  offset: 0,
  delay: 0,
  initialLoad: true,
};

InfiniteLoading.propTypes = {
  //add custom css classes
  className: PropTypes.string,
  //offset to the bottom when considering loading more
  offset: PropTypes.number,
  //delay of ms before loading more
  delay: PropTypes.number,
  //if need to emit the INIT_LOADING event initially
  initialLoad: PropTypes.bool,
  //pass custom emitter instance instead of using the one exported
  emitter: PropTypes.instanceOf(EventEmitter),
  //custom loader
  loader: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]),
};

export default InfiniteLoading;
