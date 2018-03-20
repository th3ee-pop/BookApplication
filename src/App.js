import React, {Component}from 'react'
 import * as BooksAPI from './BooksAPI'
import { Route, Link} from 'react-router-dom'
import BookList from './BookList'
import { DatePicker } from 'antd'
import SearchBook from './Search'
import './App.css'

class BooksApp extends Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
      books: {
      currentlyReading: [],
      wantToRead: [],
      read: [],
          none: []
      }
  };

  componentWillMount() {
    BooksAPI.getAll().then((books) => {
      books.forEach(book => {
        switch (book.shelf) {
            case 'currentlyReading': this.state.books.currentlyReading.push(book);
            break;
            case 'wantToRead': this.state.books.wantToRead.push(book);
            break;
            case 'read': this.state.books.read.push(book);
            break;
            default: this.state.books.none.push(book);
            break;
        }
      });
      console.log(this.state.books);
      this.setState(state => ({
          books: state.books
        }))
    })
  }

  switchShelf = (book, source, target) => {
    book.shelf = target;
    if (source) {
        this.state.books[source] = this.state.books[source].filter((d) => d.id !== book.id);
    }
    console.log(this.state.books[source]);
    this.state.books[target].push(book);
    this.setState({books: this.state.books}, () => {
      console.log(this.state.books);
    });
      BooksAPI.update(book, target).then(
          (data) => console.log(data)
      )
  };

  render() {
    return (
      <div className="app">
        <Route exact path='/' render = {() => (
            <div className="list-books">
                <div className="list-books-title">
                    <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                    <div>
                        <BookList title={'Currently Reading'} books={this.state.books.currentlyReading} onSwitch = {this.switchShelf}/>
                        <BookList title={'Want to Read'} books={this.state.books.wantToRead} onSwitch = {this.switchShelf}/>
                        <BookList title={'Already Read'} books={this.state.books.read} onSwitch = {this.switchShelf}/>
                    </div>
                </div>
                <div className="open-search">
                    <Link to = '/search'/>
                </div>
            </div>
        )}/>
          <Route path='/search' render = {({history}) => (
              <SearchBook onSwitch = {this.switchShelf}/>
          )}/>
      </div>
    )
  }
}

export default BooksApp
