<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/test-db', function () {
    try {
        DB::connection()->getPdo();
        return "Koneksi ke database berhasil! Nama database: " . DB::connection()->getDatabaseName();
    } catch (\Exception $e) {
        return "Gagal terhubung ke database: " . $e->getMessage();
    }
});