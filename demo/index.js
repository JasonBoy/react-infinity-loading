import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteLoading, {emitter, TYPE} from '../dist/react-infinite-loading';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.reInit = this.reInit.bind(this);

    this.initLoadingListener = emitter.addListener(TYPE.INIT_LOADING, () => {
      this.loadData();
    });

    this.loadingListener = emitter.addListener(TYPE.LOADING, () => {
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
    if(this.loading || !this.state.hasMore) {
      return;
    }
    this.loading = true;
    const temp = [];
    for(let i = 0; i < this.pagination.pageSize; i++) {
      temp.push(Object.assign({
        position: this.pagination.page * this.pagination.pageSize + i + 1,
      }, this.mock));
    }
    const newData = this.state.data.concat(temp);
    const hasMore = newData.length < this.state.totalRecords;
    emitter.emit(hasMore ? TYPE.LOADING_FINISHED : TYPE.ALL_LOADED);
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
      emitter.emit(TYPE.REINITIALIZE);
    }, 0);
  }

  render() {
    return (
      <div>
        <ul>
          {
            this.state.data.map((item, index) => {
              return (
                <li key={index}>
                  <h2 style={{textAlign: 'center', margin: '50px auto'}}>{item.position}-{item.title}</h2>
                </li>
              )
            })
          }
        </ul>
        <InfiniteLoading delay={1000}/>
        {
          !this.state.hasMore && (
            <div>
              <p style={{textAlign: 'center'}}>All Loaded</p>
              <a href="" onClick={this.reInit}>Try Again</a>
            </div>
          )
        }
      </div>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);