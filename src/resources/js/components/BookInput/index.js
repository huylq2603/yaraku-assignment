import React, { Component } from 'react';
import styles from "./BookInput.module.css"
import axios from 'axios';

class BookInput extends Component {

    state = {
        book: {
            id: "",
            title: "",
            author: ""
        },
        export: {
            fileFormat: "csv",
            fields: {
                title: true,
                author: true,
            },
        }
    };

    handleInput = (e) => {
        let val = e.target.value;
        let target = e.target.id;   //handle multiple inputs based on its id
        this.setState(prevState => ({
            ...prevState,
            book: {
                ...prevState.book,
                [target]: val
            }
        }));
    }

    export = () => {
        let fileFormat = this.state.export.fileFormat;
        let fields = `fields=${this.state.export.fields.title && 'title'},${this.state.export.fields.author && 'author'}`;

        //download file
        axios({
            url: `/api/books/export?fileFormat=${fileFormat}&${fields}`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `books.${fileFormat}`);
            document.body.appendChild(link);
            link.click();
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.book && nextProps.book !== this.state.book) {
            this.setState({ book: nextProps.book });
        }
    }

    render() {
        return (
            <div className="row">
                <div class="col s12">
                    <div class="card blue-grey lighten-5" style={{ padding: "0 50px" }}>
                        <div class="card-content">
                            <div>
                                <div class="input-field" style={{ width: "40%" }}>
                                    <input placeholder=""
                                        id="title"
                                        type="text"
                                        class="validate"
                                        required
                                        onChange={this.handleInput}
                                        value={this.state.book.title}
                                        disabled={this.state.book.id} />
                                    <label for="title">Title<span className='red-text'>*</span></label>
                                </div>
                                <div class="input-field" style={{ width: "40%" }}>
                                    <input placeholder=""
                                        id="author"
                                        type="text"
                                        class="validate"
                                        required
                                        onChange={this.handleInput}
                                        value={this.state.book.author} />
                                    <label for="author">Author<span className='red-text'>*</span></label>
                                </div>
                            </div>
                        </div>
                        <div class="card-action">
                            {/* Inputing new book == no book id */}
                            {!this.state.book.id &&
                                <button className="btn blue"
                                    onClick={() => { this.props.addBook && this.props.addBook(this.state.book) }}
                                    disabled={!(this.state.book.title && this.state.book.author)}
                                >Add</button>
                            }
                            {this.state.book.id &&
                                <div style={{ display: "inline-block" }}>
                                    <button className="btn blue"
                                        onClick={() => { this.props.updateBook && this.props.updateBook(this.state.book) }}
                                        disabled={!(this.state.book.title && this.state.book.author)}>Update</button>
                                    <button className="btn grey" style={{ margin: "0 15px" }}
                                        onClick={() => { this.props.refreshBookDetail && this.props.refreshBookDetail() }}>Cancel</button>
                                </div>
                            }
                            <div className={`${styles.exportGroup}`}>
                                <p>
                                    <label>
                                        <input type="checkbox" class="filled-in"
                                            checked={this.state.export.fields.title}
                                            onChange={() => {
                                                this.setState(prevState => ({
                                                    ...prevState,
                                                    export: {
                                                        ...prevState.export,
                                                        fields: {
                                                            ...prevState.export.fields,
                                                            title: !prevState.export.fields.title
                                                        }
                                                    }
                                                }), () => { console.log(this.state) })
                                            }} />
                                        <span>Title</span>
                                    </label>
                                </p>
                                <p>
                                    <label>
                                        <input type="checkbox" class="filled-in"
                                            checked={this.state.export.fields.author}
                                            onChange={() => {
                                                this.setState(prevState => ({
                                                    ...prevState,
                                                    export: {
                                                        ...prevState.export,
                                                        fields: {
                                                            ...prevState.export.fields,
                                                            author: !prevState.export.fields.author
                                                        }
                                                    }
                                                }), () => { console.log(this.state) })
                                            }} />
                                        <span>Author</span>
                                    </label>
                                </p>
                                <div class="input-field">
                                    <select className='browser-default'
                                        value={this.state.export.fileFormat}
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            this.setState(prevState => ({
                                                ...prevState,
                                                export: { ...prevState.export, fileFormat: val }
                                            }), () => { console.log(this.state) })
                                        }
                                        }>
                                        <option value="csv" selected>CSV</option>
                                        <option value="xml">XML</option>
                                    </select>
                                </div>
                                <button className="btn blue"
                                    onClick={() => { this.export() }}>Export</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default BookInput;