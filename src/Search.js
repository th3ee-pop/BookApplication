import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from "./BooksAPI";
import PropTypes from 'prop-types';
import { Debounce } from 'react-throttle';
class SearchBook extends Component {

    static propTypes = {
        books: PropTypes.any.isRequired,
        onSwitch: PropTypes.func.isRequired
    };
    state = {
        query: '',
        searchedBooks: [],
        books: [],
        warning: 'enter a string to query'
    };
    componentWillMount() {
       const myBooks = [
           ...this.props.books.currentlyReading,
           ...this.props.books.wantToRead,
           ...this.props.books.read,
           ...this.props.books.none
       ];
       console.log(this.props.books.currentlyReading);
        this.setState({
            books: myBooks
        }, () => {
            console.log(this.state.books)
        })
    }

    searchBook(query) {
        console.log(query);
            this.setState({query: query.trim()}, () => {
                if (query !== '') {
                    BooksAPI.search(this.state.query).then(
                        data => {
                            if (data instanceof Array) {
                                data.forEach(book => {
                                    this.state.books.forEach(myBook => {
                                        if(book.id === myBook.id) {
                                            book.shelf = myBook.shelf
                                        }
                                    });
                                    if (!book.shelf) {
                                        book.shelf = 'none'
                                    }
                                });
                                this.setState({searchedBooks: data}, ()=> {
                                    console.log(this.state.searchedBooks);
                                })
                            } else {
                                console.log('no match');
                                this.setState({searchedBooks: [], warning: 'No result, try another query string~'})
                            }
                        }
                    ).catch(
                        err => console.log(err)
                    )
                } else {
                    this.setState({searchedBooks: [], warning: 'enter a string to query'})
                }
            })
    }

    render() {
        const { books, onSwitch } =this.props;
        return (
            <div className="search-books">

                <div className="search-books-bar">
                    <Link className='close-search' to='/'></Link>
                    <div className="search-books-input-wrapper">

                       {/* NOTES: The search from BooksAPI is limited to a particular set of search terms.
                        You can find these search terms here:
                        https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                        However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                        you don't find a specific author or title. Every search is limited by search terms.*/}

                        <Debounce time='100' handler='onChange'>
                            <input type="text" placeholder="Search by title or author"  onChange={(e) => this.searchBook(e.target.value)}/>
                        </Debounce>
                    </div>
                </div>

                {this.state.searchedBooks.length === 0 ? (
                    <div className='search-books-results'>
                        <div style={{textAlign: 'center'}}>{this.state.warning}</div>
                    </div>
                ) : (
                    <div className="search-books-results">
                        <ol className='books-grid'>
                            {
                                this.state.searchedBooks.map((book) => (
                                    <li key={book.id}>
                                        <div className='book'>
                                            <div className='book-top'>
                                                {
                                                    book.imageLinks ? (
                                                        <div className='book-cover' style={{
                                                            width: 128,
                                                            height: 193,
                                                            backgroundImage: `url(${book.imageLinks.thumbnail})`
                                                        }}></div>
                                                    ) : (
                                                        <div style={{width: 128, height: 193}} className='book-cover'>No image</div>
                                                    )
                                                }

                                                <div className="book-shelf-changer">
                                                    <select defaultValue={book.shelf}  onChange={(e) => {
                                                        console.log(e.target.value);
                                                        onSwitch(book, book.shelf, e.target.value)
                                                    }}
                                                    >
                                                        <option value="none" disabled>Move to...</option>
                                                        <option value="currentlyReading">Currently Reading</option>
                                                        <option value="wantToRead" >Want to Read</option>
                                                        <option value="read" >Read</option>
                                                        <option value="none">None</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='book-title'>
                                                {book.title}
                                            </div>
                                            {book.authors ? (<div className='book-authors'>
                                                {book.authors.join(',')}
                                            </div>) : (
                                                <div className='book-authors'>
                                                    no authors info
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))
                            }
                            </ol>
                    </div>
                )}

            </div>

        )
    }
}

export default SearchBook;
