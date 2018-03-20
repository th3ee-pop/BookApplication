import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from "./BooksAPI";
import PropTypes from 'prop-types';
class SearchBook extends Component {

    static propTypes = {
        onSwitch: PropTypes.func.isRequired
    };
    state = {
        query: '',
        searchedBooks: []
    };

    searchBook(query) {
            this.setState({query: query.trim()}, () => {
                if (query !== '') {
                    BooksAPI.search(this.state.query).then(
                        data => {
                            if (data instanceof Array) {
                                console.log(data);
                                this.setState({searchedBooks: data})
                            }
                        }
                    ).catch(
                        err => console.log(err)
                    )
                } else {
                    this.setState({searchedBooks: []})
                }

            })
    }

    render() {
        const { onSwitch } =this.props;
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

                        <input type="text" placeholder="Search by title or author" value={this.state.query} onChange={(e) => this.searchBook(e.target.value)}/>
                    </div>
                </div>
                {this.state.searchedBooks.length === 0 ? (
                    <div className='search-books-results'></div>
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
                                                        <div className='book-cover'>No image</div>
                                                    )
                                                }

                                                <div className="book-shelf-changer">
                                                    <select defaultValue='none'  onChange={(e) => {
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