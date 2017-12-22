import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteLoading, {
  emitter,
  TYPE,
  EventEmitter,
} from '../dist/react-infinite-loading';
// import InfiniteLoading, {emitter, TYPE, EventEmitter} from '../components/InfiniteLoading';
import Loading from '../components/Loading';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.reInit = this.reInit.bind(this);

    //if you don't create EventEmitter instance, use the default emitter exported above,
    //in which case you don't need to pass the custom emitter to <InfiniteLoading/>
    this.emitter = new EventEmitter();

    this.initLoadingListener = this.emitter.addListener(
      TYPE.INIT_LOADING,
      () => {
        this.loadData();
      }
    );

    this.loadingListener = this.emitter.addListener(TYPE.LOADING, () => {
      this.loadData();
    });

    this.mock = {
      title: 'Loading',
    };

    this.state = {
      totalRecords: 30,
      hasMore: true,
      data: [],
    };

    this.pagination = {
      pageSize: 10,
      page: 0,
    };

    this.loading = false;
  }

  loadData() {
    if (this.loading || !this.state.hasMore) {
      return;
    }
    this.loading = true;
    const temp = [];
    for (let i = 0; i < this.pagination.pageSize; i++) {
      temp.push(
        Object.assign(
          {
            position: this.pagination.page * this.pagination.pageSize + i + 1,
          },
          this.mock
        )
      );
    }
    const newData = this.state.data.concat(temp);
    const hasMore = newData.length < this.state.totalRecords;
    this.emitter.emit(hasMore ? TYPE.LOADING_FINISHED : TYPE.ALL_LOADED);
    this.setState({
      data: newData,
      hasMore,
    });
    this.pagination.page++;
    this.loading = false;
    console.log('load data done');
  }

  componentWillUnmount() {
    this.initLoadingListener.remove();
    this.loadingListener.remove();
  }

  reInit(e) {
    e.preventDefault();
    window.scroll(0, 0);
    this.pagination.page = 0;
    this.loading = false;
    this.setState({
      hasMore: true,
      data: [],
    });
    setTimeout(() => {
      this.emitter.emit(TYPE.REINITIALIZE);
    }, 0);
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.data.map((item, index) => {
            return (
              <li key={index}>
                <h2 style={{ textAlign: 'center', margin: '50px auto' }}>
                  {item.position}-{item.title}
                </h2>
              </li>
            );
          })}
        </ul>
        <InfiniteLoading
          className="il-custom"
          delay={1000}
          emitter={this.emitter}
          loader={<Loading />}
        />
        {!this.state.hasMore && (
          <div>
            <p style={{ textAlign: 'center' }}>All Loaded</p>
            <a href="" onClick={this.reInit}>
              Try Again
            </a>
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
