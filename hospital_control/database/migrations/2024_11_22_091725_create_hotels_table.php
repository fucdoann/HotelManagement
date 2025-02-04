<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id('hotel_id');
            $table->integer('admin_id');
            $table->string('name');
            $table->text('address')->nullable();
            $table->integer('commune')->nullable();
            $table->integer('district')->nullable();
            $table->integer('province');
            $table->string('zip_code', 20);
            $table->integer('star_rating')->nullable();
            $table->text('description')->nullable();
            $table->string('contact_number', 20)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hotels');
    }
};
