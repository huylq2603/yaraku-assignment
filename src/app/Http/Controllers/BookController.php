<?php

namespace App\Http\Controllers;

use App\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use DOMDocument;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Book::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'author' => 'required',
        ]);

        return Book::create($request->only(['title', 'author']));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Book::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'author' => 'required'
        ]);
        $book = Book::findOrFail($id);
        $book->update($request->only(['author']));
        return $book;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return DB::table('books')->where('id', $id)->delete();
    }

    /**
     * Export to CSV/XML.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function export(Request $request)
    {
        $fileFormat = $request->query('fileFormat');
        $fields = $request->query('fields');    //comma separated export fields

        $requestedFields = isset($fields) ? explode(",", strtolower($fields)) : [];

        $exportFields = ["title" => false, "author" => false];

        //export requested fields in query parameter $fields
        foreach ($exportFields as $key => $val) {
            if (in_array($key, $requestedFields)) {
                $exportFields[$key] = true;
            }
        }

        //default export all fields
        if (!in_array(true, array_values($exportFields))) {
            foreach ($exportFields as $key => $val) {
                $exportFields[$key] = true;
            }
        }

        $books = Book::all();

        switch (strtolower($fileFormat)) {
            case "xml":
                $xml = new DOMDocument('1.0');
                $xml->formatOutput = true;

                $booksEl = $xml->createElement("books");
                $xml->appendChild($booksEl);

                foreach ($books as $book) {
                    $bookEl = $xml->createElement("book");
                    $bookEl->setAttribute("id", $book->id);
                    $booksEl->appendChild($bookEl);

                    foreach ($exportFields as $key => $val) {
                        if ($val) {
                            $el = $xml->createElement($key, $book[$key]);
                            $bookEl->appendChild($el);
                        }
                    }
                }

                return response($xml->saveXML())
                    ->header('Content-Type', 'application/xml')
                    ->header('Content-Disposition', 'attachment;filename=books.xml');
            default:    //default is csv
                $content = "";
                foreach ($books as $book) {
                    $content .= $book->id;

                    foreach ($exportFields as $key => $val) {
                        if ($val) {
                            $content .= "," . "\"" . $book[$key] . "\"";
                        }
                    }

                    $content .= "\n";
                }
                return response($content)
                    ->header('Content-Type', 'text/csv')
                    ->header('Content-Disposition', 'attachment;filename=books.csv');
        }
    }
}
