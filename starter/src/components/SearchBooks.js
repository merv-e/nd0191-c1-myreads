import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from "../BooksAPI";
import SearchedBooksWithShelfInfo from './SearchedBooksWithShelfInfo';
import { PropTypes } from 'prop-types';

const SearchBooks = ({ data, updateBook, getBook }) => {

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState();

 // data comes with the API call will be stored in the variable below for the search page.  
  const [newSetOfBooks, setNewSetOfBooks] = useState([]);

  // it'll take the query variable (a.k.a where user searchs for books) , if it's empty which is the default value, it'll show nothing. However, if user starts typing something the query will be updated and searchBook variable will filter it accordingly.
 
  const searchBook =   
  query === "" 
    ? newSetOfBooks 
    : newSetOfBooks.filter((book) => 
    book.title.toLowerCase().includes(query.toLowerCase())
    )

    // this is where we also capture what user types and send it to make a call to the API so that searchBook variable can filter the books for us.
    const handleChange = (e) => {
      setQuery(e.target.value);
      console.log('Typing...');
    };  
      
    console.log(newSetOfBooks);          

      useEffect(() => {
        
        if(query.length === 0) {
          console.log("There's nothing to look for.")
          
          return ( 
            <p>Please search for a book.</p>
            );
        };

        // when the user navigates to the search page and types a title, id etc. it'll show the relevant books.

        const search = async () => {
          const result = await BooksAPI.search(query, 20).then((book) =>
          setNewSetOfBooks(book)
          );
          console.log("I am making an HTTP request");
        };
        
         const limit = setTimeout(() => {
          console.log("Hello, I'm still searching, don't limit me!");
          search();
        }, 3000);

        return () => {
          console.log("CLEANUP!");
          clearTimeout(limit);
        };
      }, [query]); //

  return (
    <div className="search-books">
          <div className="search-books-bar">  
            <Link to='/'
              className="close-search">
            Close
            </Link>
            <div className="search-books-input-wrapper">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN"
                value={query}
                onChange= {handleChange}
              />
            </div>
          </div>
          
          {
            newSetOfBooks.length === 0  
            ? <p>No such book has been found.</p>
            : (

            <div className="search-books-results">
              <SearchedBooksWithShelfInfo 
                searchBook={ searchBook}
                data = {data}
                updateBook = {updateBook}
                getBook = {getBook}
              />
            </div>

          )
          }

        </div>
  )
}

SearchBooks.propTypes = {
  data: PropTypes.array.isRequired,
  updateBook: PropTypes.func.isRequired,
}

export default SearchBooks