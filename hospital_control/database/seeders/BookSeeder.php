<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Books;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();
        for( $i = 0; $i < 50; $i ++){
            Books::create([
                'name' => $faker->sentence,
                'author' => $faker->sentence,
                'publish_date' => $faker->date,
            ]);
        }
    }
}
