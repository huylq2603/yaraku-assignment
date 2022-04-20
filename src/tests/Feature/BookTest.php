<?php

namespace Tests\Feature;

use App\Book;
use BookSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class BookTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->seed(BookSeeder::class);
    }

    public function test_get_books()
    {
        //get seeded books via get api
        $response = $this->get('/api/books');

        //assert that response has 2 seeded books
        $response
            ->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJson([
                ['title' => 'seed title 1', 'author' => 'seed author 1'],
                ['title' => 'seed title 2', 'author' => 'seed author 2'],
            ]);
    }

    public function test_get_no_book()
    {
        //refresh books migration to get an empty 'books' table
        $this->artisan("migrate:refresh", ["--path" => "/database/migrations/2022_04_16_213245_create_books_table.php"]);

        //get books via get api
        $response = $this->get('/api/books');

        //assert that response has 0 books
        $response
            ->assertStatus(200)
            ->assertJsonCount(0);
    }

    public function test_add_book()
    {
        //add new book via post api
        $this->post('/api/books', [
            "title" => "test",
            "author" => "test",
        ]);

        //assert that the book was added to database
        $this->assertDatabaseHas("books", [
            "title" => "test",
            "author" => "test"
        ]);
    }

    public function test_cannot_add_book()
    {
        //add new book via post api without needed parameter
        //should throw ValidationException
        $this->withoutExceptionHandling();
        $this->expectException(ValidationException::class);
        $this->post('/api/books', [
            "title" => "",
            "author" => "",
        ]);
        //assert that nothing new was added to database other than 2 seeded books
        $this->assertCount(2, Book::all());
    }

    public function test_get_book()
    {
        //get seeded book via get api
        $response = $this->get('/api/books/1');

        //assert that response has 2 seeded books
        $response
            ->assertStatus(200)
            ->assertJson([
                'title' => 'seed title 1',
                'author' => 'seed author 1'
            ]);
    }

    public function test_cannot_get_book_non_exist()
    {
        //get non existing book via get api
        $response = $this->get('/api/books/5');

        //assert that response has 404 status
        $response->assertStatus(404);
    }

    public function test_update_book_author()
    {
        //update author of seeded book via put api
        $this->put('/api/books/1', [
            "author" => "updated author"
        ]);

        //assert that the book was added to database
        $this->assertDatabaseHas("books", [
            "id" => 1,
            "title" => "seed title 1",
            "author" => "updated author"
        ]);
    }

    public function test_cannot_update_book_author()
    {
        //update author of seeded book via put api without needed parameter
        //should throw ValidationException
        $this->withoutExceptionHandling();
        $this->expectException(ValidationException::class);
        $this->put('/api/books/1', [
            "author" => ""
        ]);

        //assert that the book was not updated
        $this->assertDatabaseHas("books", [
            "id" => 1,
            "title" => "seed title 1",
            "author" => "seed author 1"
        ]);
    }

    public function test_cannot_update_book_title()
    {
        //update seeded book via put api with wrong parameter
        $this->put('/api/books/1', [
            "title" => "updated title"
        ]);

        //assert that the book was not updated
        $this->assertDatabaseHas("books", [
            "id" => 1,
            "title" => "seed title 1",
            "author" => "seed author 1"
        ]);
    }

    public function test_cannot_update_book_non_exist()
    {
        //update non exist book via put api
        $response = $this->put('/api/books/5', [
            "author" => "updated author"
        ]);

        //assert that response has 404 status
        $response->assertStatus(404);
        //assert that the book was not updated
        $this->assertDatabaseMissing("books", [
            "id" => 5,
            "author" => "updated author"
        ]);
    }

    public function test_delete_book()
    {
        //delete seeded book via delete api
        $response = $this->delete('/api/books/1');

        //assert that response is ok
        $response->assertStatus(200);
        //assert that the book was deleted and only 1 seeded book left in database
        $this
            ->assertDatabaseMissing("books", [
                "id" => 1,
                "title" => "seed title 1",
                "author" => "seed author 1"
            ])
            ->assertCount(1, Book::all());
    }

    public function test_cannot_delete_book_non_exist()
    {
        //delete non exist book via delete api
        $this->delete('/api/books/5');

        //assert that database still has 2 seeded books
        $this->assertCount(2, Book::all());
    }

    public function test_export()
    {
        $response = $this->get('/api/books/export');

        //assert that response is ok
        $response->assertStatus(200);
    }

    public function test_export_csv()
    {
        $response = $this->get('/api/books/export?fileFormat=csv');

        //assert that response is ok
        $response->assertStatus(200);
    }

    public function test_export_xml()
    {
        $response = $this->get('/api/books/export?fileFormat=xml');

        //assert that response is ok
        $response->assertStatus(200);
    }

    public function test_export_csv_title_only()
    {
        $response = $this->get('/api/books/export?fileFormat=csv&fields=title');

        //assert that response is ok
        $response->assertStatus(200);
    }

    public function test_export_csv_author_only()
    {
        $response = $this->get('/api/books/export?fileFormat=csv&fields=author');

        //assert that response is ok
        $response->assertStatus(200);
    }

    public function test_export_xml_title_only()
    {
        $response = $this->get('/api/books/export?fileFormat=xml&fields=title');

        //assert that response is ok
        $response->assertStatus(200);
    }

    public function test_export_xml_author_only()
    {
        $response = $this->get('/api/books/export?fileFormat=xml&fields=author');

        //assert that response is ok
        $response->assertStatus(200);
    }
}
