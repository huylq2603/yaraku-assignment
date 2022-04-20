<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('books')->insert([
            ['id' => 1, 'title' => 'seed title 1', 'author' => 'seed author 1'],
            ['id' => 2, 'title' => 'seed title 2', 'author' => 'seed author 2'],
        ]);
    }
}
