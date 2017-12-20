# react-infinite-loading
📜Event-driven, fully-controlled infinite scroll loading for React

![react-infinite-loading-demo](https://raw.githubusercontent.com/JasonBoy/react-infinite-loading/master/demo/demo.gif)

### Why

There are a lot of infinite scroll components out there, and I tried some of them, which usually handles and hide many details inside, and you can't control every phase when you scroll down the page, which makes it really unpredictable in some cases, and as a result, I have to create yet another component to let you control every part of the scroll phases based on a simple event emitter.

## Usage

`npm i react-infinite-loading --save` or `yarn add react-infinite-loading`

and in your component:
```javascript
import InfiniteLoading, {emitter, TYPE, EventEmitter} from 'react-infinite-loading';
//demo loading component
import Loading from 'react-infinite-loading/components/Loading';

class App extends React.Component {
  constructor(props) {
    //default emitter exported
    this.emitter = emitter;
    //or create a new EventEmitter instance to prevent conflict with the default one if you have multiple InfiniteLoading instances on the same page
    // this.emitter = new EventEmitter();
    
    //add handler after the <InfiniteLoading> initialized before user scroll, usually when page loaded 
    this.initLoadingListener = this.emitter.addListener(TYPE.INIT_LOADING, () => {
      //load your own data
      this.loadData();
    });
    //handler for page scroll when the <InfiniteLoading> may be visible
    this.loadingListener = this.emitter.addListener(TYPE.LOADING, () => {
      //load your own data when user scroll to page bottom
      this.loadData();
    });
  }
  
  componentWillUnmount() {
    //remove event listener before unmount
    this.initLoadingListener.remove();
    this.loadingListener.remove();
  }
  
  render() {
    return (
      <div>
        <ul>
          <li></li>
          {/*... your list map*/}
        </ul>
        <InfiniteLoading className="custom-css-class" delay={1000} loader={<Loading/>}/>
      </div>
    )
  }
}

``` 

## Events

### Fired from InfiniteLoading component

- `TYPE.INIT_LOADING`: fired on component initialization(usually on page loaded)
- `TYPE.LOADING`: fired every time when user scroll to the bottom, this is when you need to load more data from your api

### Fired by you

- `TYPE.LOADING_FINISHED`: every time after you load more chunk of data, emit this event to notify InfiniteLoading to finish the current loading phase
- `TYPE.ALL_LOADED`: when you've done loading all your data, you should notify InfiniteLoading to stop listen for user scroll by `emitter.emit(TYPE.ALL_LOADED)`.
- `TYPE.REINITIALIZE`: sometimes when you changed the search filters, you may need to reset the loading status/pagination, this is the event you need to tell InfiniteLoading to reset all events, and re-init the scroll process, just like the first initialization. 


## Demo

Open `./build/index.html` in your browser, and start scroll down the page.

## LICENSE

MIT @ 2017-2018 [jason](https://blog.lovemily.me)