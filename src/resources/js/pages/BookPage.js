import React, { Component } from 'react';
import axios from 'axios';

import BookInput from '../components/BookInput'
import BookList from '../components/BookList'

class BookPage extends Component {

    state = {
        book: {
            id: "",
            title: "",
            author: "",
        },
        bookList: [],
    }

    componentDidMount = () => {
        this.getAllBook();
    }

    /**
     * 
     * @param {*} id: book id being deleted
     */
    deleteBook = async (id) => {
        axios.delete(`/api/books/${id}`);
        console.log(this.state.book.id, id);
        if (this.state.book.id == id) {
            console.log("alo");
            this.refreshBookDetail();
        }
        let bookList = [...this.state.bookList].filter(el => el.id != id);
        this.setState({ bookList }, () => { console.log('del', this.state) });
    }

    /**
     * 
     * @param {*} book: book being added
     */
    addBook = async (book) => {
        this.refreshBookDetail();
        let bookList = [...this.state.bookList, book];
        this.setState({ bookList }, () => { console.log('add', this.state) });
        await axios.post('/api/books', book);
        this.getAllBook();
    }

    /**
     * 
     * @param {*} book: book being updated
     */
    updateBook = async (book) => {
        this.refreshBookDetail();
        let bookList = [...this.state.bookList].map(el => { return el.id == book.id ? book : el });
        this.setState({ bookList }, () => { console.log('update', this.state) });
        axios.put(`/api/books/${book.id}`, book);
    }

    /**
     * Get book detail and change action to update book
     * @param {*} book : book detail being shown to update
     */
    showBookDetail = (book) => {
        this.setState({ book }, () => { console.log('detail', this.state) });
    }

    /**
     * Refresh book detail and change action to add book
     */
    refreshBookDetail = () => {
        let book = {
            id: "",
            title: "",
            author: "",
        }
        this.setState({ book }, () => { console.log('refresh', this.state) });
    }

    getAllBook = () => {
        axios.get('/api/books').then(res => {
            this.setState({ bookList: res.data }, () => { console.log('get', this.state) })
        });
    }

    render() {
        return (
            <div style={{ minWidth: "725px" }}>
                <h4 className='center'>Book Store</h4>
                <BookInput book={this.state.book} addBook={this.addBook} updateBook={this.updateBook} refreshBookDetail={this.refreshBookDetail} />
                <BookList bookList={this.state.bookList} deleteBook={this.deleteBook} showBookDetail={this.showBookDetail} />
            </div>
        )
    }
}

export default BookPage;