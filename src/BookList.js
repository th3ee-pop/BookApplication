import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BookList extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        books: PropTypes.array.isRequired,
        onSwitch: PropTypes.func.isRequired
    };

    state= {
        destination: ''
    };


    render() {
      const { title, books, onSwitch } =this.props;
      console.log(title);

      let readingBooks = books;

      return (
       <div className='bookshelf'>
           <h2 className='bookshelf-title'>{title}</h2>
           <div className='bookshelf-books'>
               <ol className='books-grid'>
                   {
                    readingBooks.map((book) => (
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
                                            <div style={{width: 128, height: 193, textAlign: 'center'}} className='book-cover'>No image</div>
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
       </div>
      )
    }
}

export default BookList
