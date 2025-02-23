<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            // Auto increment primary key
            $table->id(); // This will create an auto-incrementing primary key `id` as `bigint(20) UNSIGNED`
            $table->string('title', 255);

            // `slug` column with index
            $table->string('slug', 255)->index();

            // `description` column with `text` type
            $table->text('description');

            // `excerpt` column with `text` type and nullable
            $table->text('excerpt')->nullable();

            // `feature_image` column with `varchar(255)` and nullable
            $table->string('feature_image', 255)->nullable();

            // `gallery_images` column with `varchar(10000)`
            $table->string('gallery_images', 10000);

            // `map_url` column with `varchar(1000)` and nullable
            $table->string('map_url', 1000)->nullable();

            // `video_link` column with `varchar(800)`
            $table->string('video_link', 800);

            // `reviews` column with `varchar(800)`
            $table->string('reviews', 800);

            // `status` column with enum options
            $table->enum('status', ['trash', 'publish', 'draft'])->default('draft');

            // `user_id` column with `bigint(20) UNSIGNED` index
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Assuming foreign key relation with users table

            // `deleted` column with tinyint(1) default 0
            $table->tinyInteger('deleted')->default(0);

            // `created_by` column with `bigint(20) UNSIGNED` and nullable
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');

            // `timestamps` columns (`created_at`, `updated_at`)
            $table->timestamps();

            // `deleted_at` column for soft deletes
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
