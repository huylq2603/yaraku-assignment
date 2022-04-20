import React, { Component } from 'react';
import styles from "./BookList.module.css"

class BookList extends Component {

    state = {
        bookList: this.props.bookList,  //original book list
        displayBookList: this.props.bookList,   // searched/sorted book list
        search: "",
        sort: {
            by: "",
            order: 0, //0: sortById, 1: asc, 2: desc
        }
    }

    handleInput = (e) => {
        let val = e.target.value;
        let target = e.target.id;
        this.setState(prevState => ({
            ...prevState,
            [target]: val
        }), () => { this.displayBooks() });
    }

    /**
     * Get list of display books based on search string
     */
    displayBooks = () => {
        let displayBookList = [...this.state.bookList]
            .filter(el => !search
                || el.title.toLowerCase().includes(this.state.search.trim().toLowerCase())
                || el.author.toLowerCase().includes(this.state.search.trim().toLowerCase()));

        //reset sort criterias each time displayBookList is changed
        this.setState(prevState => ({
            ...prevState,
            displayBookList,
            sort: {
                by: "",
                order: 0,
            }
        }));
    }

    /**
     * Sort displayBookList
     * @param {*} by: sort book by field name
     */
    sortBooks = (by) => {
        let order = this.state.sort.order >= 2 ? 0 : this.state.sort.order + 1; //change sortOrder
        order = this.state.sort.by == by ? order : 1;
        let displayBookList = [...this.state.displayBookList].sort((a, b) => {
            switch (order) {
                case 1: //asc
                    return a[by].localeCompare(b[by]);
                case 2: //desc
                    return b[by].localeCompare(a[by]);
                default:    //sortById
                    return a.id - b.id;
            }
        });

        this.setState(prevState => ({
            ...prevState,
            displayBookList,
            sort: {
                by,
                order
            }
        }));
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.bookList && nextProps.bookList !== this.state.bookList) {
            this.setState({ bookList: nextProps.bookList }, () => { this.displayBooks() });
        }
    }

    render() {
        const bookList = this.state.displayBookList.map((el, index) => {
            return (
                <tr key={index} onClick={() => { this.props.showBookDetail && this.props.showBookDetail(el); }}>
                    <td>{el.title}</td>
                    <td>{el.author}</td>
                    <td><button onClick={(e) => {
                        e.stopPropagation();
                        this.props.deleteBook && this.props.deleteBook(el.id);
                    }} className="btn red">Delete</button></td>
                </tr>
            )
        })

        return (
            <div className={`${styles.bookList}`}>
                <table className="highlight striped centered">
                    <thead>
                        <tr>
                            <th onClick={() => { this.sortBooks("title") }}
                                className={`${styles.attract}`}>
                                Title<sub>{this.state.sort.by == "title" && ((this.state.sort.order == 1 && "asc") || (this.state.sort.order == 2 && "desc"))}</sub>
                            </th>
                            <th onClick={() => { this.sortBooks("author") }}
                                className={`${styles.attract}`}>
                                Author<sub>{this.state.sort.by == "author" && ((this.state.sort.order == 1 && "asc") || (this.state.sort.order == 2 && "desc"))}</sub>
                            </th>
                            <th style={{ cursor: "inherit" }}>
                                <div class="input-field">
                                    <input placeholder="Search" id="search" type="text" class="validate" onChange={this.handleInput} value={this.state.search} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookList}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default BookList;