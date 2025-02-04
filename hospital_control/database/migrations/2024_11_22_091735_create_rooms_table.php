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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id('room_id');
            $table->unsignedBigInteger('hotel_id');
            $table->string('room_type');
            $table->integer('big_bed_count');
            $table->integer('small_bed_count');
            $table->integer('bed_count');
            $table->integer('wc_count');
            $table->integer('kitchen_count');
            $table->integer('living_room_count');
            $table->decimal('price_per_night', 10, 2);
            $table->decimal('price_per_morning', 10, 2);
            $table->text('description')->nullable();
            $table->enum('status', ['Available', 'Unavailable'])->default('Available'); 
            $table->timestamps();
            // Foreign key constraint
            $table->foreign('hotel_id')->references('hotel_id')->on('hotels')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rooms');
    }
};
