/*!
 * @license MIT
 * Event-driven, fully-controlled infinite scroll loading for React.
 * https://github.com/JasonBoy/react-infinite-loading
 */

'use strict';

import {EventEmitter} from 'fbemitter';
import React from 'react';
import PropTypes from 'prop-types';

import Loading from '../Loading';

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

    this.initialLoad = this.props.initialLoad !== false;
    this.state = {
      loadingDone: false,
    }
  }

  componentDidMount() {
    this.initHandler();
    this.reInitializeListener = emitter.addListener(TYPE.REINITIALIZE, (cb) => {
      this.toggleLoadingDone(false);
      this.reInitHandler();
      cb && cb();
    });
  }

  componentWillUnmount() {
    this.clear();
    this.destroy();
    this.reInitializeListener.remove();
  }

  reInitHandler() {
    this.clear();
    this.destroy();
    console.log('reinit loading...');
    this.initHandler();
  }

  initHandler() {
    // this.loadingDom.style.visibility = 'visible';
    // this.loadingDom.style.display = 'block';
    this.screenHeight = window.screen.availHeight;
    this.loading = false;
    this.scale = 1;
    // const loadingText = $scope.loadingText || 'loading...';
    this.offset = this.props.offset === undefined ? 0 : this.props.offset;
    //to prevent loading too often
    this.delay = this.props.delay === undefined ? 100 : this.props.delay;
    this.allLoaded = false;
    // this.firstTime = true;

    this.loadingFinishedListerner = emitter.addListener(TYPE.LOADING_FINISHED, () => {
      this.loading = false;
      // this.loadingDom.style.visibility = 'hidden';
      console.log('loading done...');
    });

    this.allLoadedListener = emitter.addListener(TYPE.ALL_LOADED, () => {
      this.clear();
      this.toggleLoadingDone(true);
      console.log('all loaded...');
    });

    window.addEventListener('scroll', this.scrollHandler, false);
    if (this.initialLoad) {
      //init one
      setTimeout(() => {
        console.log('init loading...');
        this.toggleLoadingDone(false);
        emitter.emit(TYPE.INIT_LOADING);
      }, this.delay);
    }

  }

  clear() {
    this.allLoaded = true;
    this.loading = false;
    // this.loadingDom.style.visibility = 'hidden';
    // this.loadingDom.style.display = 'none';
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
    // if (!this.firstTime) return;
    if ((this.screenHeight - position.bottom * this.scale) >= this.offset) {
      // this.firstTime = false;
      this.loading = true;
      // this.loadingDom.style.visibility = 'visible';
      this.waitTimer = setTimeout(() => {
        console.log('loading...');
        this.toggleLoadingDone(false);
        emitter.emit(TYPE.LOADING);
      }, this.delay);
    }
  }

  toggleLoadingDone(loadingDone = true) {
    this.setState({
      loadingDone,
    })
  }

  render() {
    const style = {
      display: this.state.loadingDone ? 'none' : 'block',
    };
    return (
      <div className="infinite-loading"
           style={style}
           ref={ele => this.loadingDom = ele}
      >
        {this.props.children || <Loading/>}
      </div>
    );
  }
}

InfiniteLoading.propTypes = {
  offset: PropTypes.number,
  delay: PropTypes.number,
  text: PropTypes.string,
  initialLoad: PropTypes.bool,
};

export default InfiniteLoading;
